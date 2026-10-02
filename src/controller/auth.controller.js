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
    const payload = {
        id: user._id?.toString() || user.id?.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };
    const token = await tokenUtils.generateAccessToken(payload);
    const refreshToken = await tokenUtils.generateRefreshToken(payload);

    res.cookie('accessToken', token, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return token;
}

const register = catchAsyncWrapper(
    async (req, res, next) => {
        const newUser = await authService.createUser(req.data);

        const token = await issueTokens(res, newUser);

        return res
            .status(
                httpResponseSuccessCode.CREATED
            )
            .json(
                httpSuccessResponse({ user: newUser, token })
            );
    }
);

const login = catchAsyncWrapper(
    async (req, res, next) => {
        // const { email, password } = req.body;
        const user = await authService.authenticateUser(req.data);

        const token = await issueTokens(res, user);

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse({ user, token })
            )
    }
);

const refresh = catchAsyncWrapper(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
        throw new UnauthorizedError('Refresh token is required');

    const decoded = await tokenUtils.verifyRefreshToken(refreshToken);
    if (decoded.type !== 'refresh' || !decoded.id)
        throw new UnauthorizedError('Invalid refresh token');

    const token = await issueTokens(res, decoded);
    return res
        .status(httpResponseSuccessCode.OK)
        .json(httpSuccessResponse({ token }));
});

const logout = (req, res) => {
    res.clearCookie('accessToken', { ...cookieBaseOptions, path: '/' });
    res.clearCookie('refreshToken', refreshCookieOptions);
    return res
        .status(httpResponseSuccessCode.NO_CONTENT)
        .end();
};

export default {
    register,
    login,
    refresh,
    logout
};