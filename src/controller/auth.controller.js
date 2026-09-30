import authService from '../service/auth.service.js';
import catchAsyncWrapper from '../middleware/catchAsyncWrapper.middleware.js';
import tokenUtils from '../utils/token.utils.js';
import { httpResponseSuccessCode } from "../utils/enums/httpResponseStatusCode.js";
import { httpSuccessResponse } from "../utils/httpResponseFormatter.js";

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

        const token = await tokenUtils.generateToken(
            {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        );

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse({ user, token })
            )
    }
);

export default {
    register,
    login
};