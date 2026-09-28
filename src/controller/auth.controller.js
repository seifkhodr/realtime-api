import authService from '../service/auth.service.js';
import catchAsyncWrapper from '../middleware/catchAsyncWrapper.middleware.js';
import httpResponseFormatter from '../utils/httpResponseFormatter.js';
import tokenUtils from '../utils/token.utils.js';
import httpResponseCode from '../utils/enums/httpResponseStatusCode.js';

const register = catchAsyncWrapper(
    async (req, res, next) => {
        const newUser = await authService.createUser(req.data);

        const token = await tokenUtils.generateToken(
            {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        );

        return res
            .status(
                httpResponseCode.httpResponseSuccessCode.CREATED
            )
            .json(
                httpResponseFormatter.httpSuccessResponse({ user: newUser, token })
            );
    }
);

const login = catchAsyncWrapper(
    async (req, res, next) => {
        // const { email, password } = req.body;
        const user = await authService.authenticateUser(req.data);

        const token = await tokenUtils.generateToken(
            {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        );

        return res
            .status(
                httpResponseCode.httpResponseSuccessCode.OK
            )
            .json(
                httpResponseFormatter.httpSuccessResponse({ user, token })
            )
    }
);

export default {
    register,
    login
};