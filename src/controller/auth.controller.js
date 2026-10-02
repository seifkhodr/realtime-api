import authService from '../service/auth.service.js';
import catchAsyncWrapper from '../middleware/catchAsyncWrapper.middleware.js';
import tokenUtils from '../utils/token.utils.js';
import { httpResponseSuccessCode } from "../utils/enums/httpResponseStatusCode.js";
import { httpSuccessResponse } from "../utils/httpResponseFormatter.js";
import { UnauthorizedError } from '../utils/AppError.js';

const cookieBaseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
};

const accessCookieOptions = {
    ...cookieBaseOptions,
    path: '/',
    maxAge: 30 * 60 * 1000
};

const refreshCookieOptions = {
    ...cookieBaseOptions,
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

async function issueTokens(res, user) {
    const authenticatedUserPayload = {
        id: user._id?.toString() || user.id?.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };
    const accessToken = await tokenUtils.generateAccessToken(authenticatedUserPayload);
    const refreshToken = await tokenUtils.generateRefreshToken(authenticatedUserPayload);

    res.cookie('accessToken', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return accessToken;
}

const register = catchAsyncWrapper(
    async (req, res, next) => {
        const createdUser = await authService.createUser(req.data);

        const accessToken = await issueTokens(res, createdUser);

        return res
            .status(
                httpResponseSuccessCode.CREATED
            )
            .json(
                httpSuccessResponse({ user: createdUser, token: accessToken })
            );
    }
);

const login = catchAsyncWrapper(
    async (req, res, next) => {
        const authenticatedUser = await authService.authenticateUser(req.data);

        const accessToken = await issueTokens(res, authenticatedUser);

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse({ user: authenticatedUser, token: accessToken })
            )
    }
);

const refresh = catchAsyncWrapper(async (req, res) => {

    const refreshTokenCookie = req.cookies?.refreshToken;

    if (!refreshTokenCookie)
        throw new UnauthorizedError('Refresh token is required');

    const refreshTokenPayload = await tokenUtils.verifyRefreshToken(refreshTokenCookie);

    if (refreshTokenPayload.type !== 'refresh' || !refreshTokenPayload.id)
        throw new UnauthorizedError('Invalid refresh token');

    const accessToken = await issueTokens(res, refreshTokenPayload);

    return res
        .status(
            httpResponseSuccessCode.OK
        )
        .json(
            httpSuccessResponse({ token: accessToken })
        );
});

const logout = (req, res) => {
    res.clearCookie('accessToken', { ...cookieBaseOptions, path: '/' });
    res.clearCookie('refreshToken', refreshCookieOptions);
    return res
        .status(
            httpResponseSuccessCode.NO_CONTENT
        )
        .end();
};

export default {
    register,
    login,
    refresh,
    logout
};