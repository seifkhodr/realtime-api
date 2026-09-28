import express from 'express';
import authValidator from '../validator/auth.validator.js';
import authController from '../controller/auth.controller.js';
import validatorMiddleware from '../middleware/validator.middleware.js';
import validateAllowedField from '../middleware/allowedField.middleware.js';
import allowedFields from '../utils/enums/allowedFields.js';

const router = express.Router();

router.route('/register')
    .post(authValidator.register,validatorMiddleware,validateAllowedField(allowedFields.authFields.register),authController.register);

router.route('/login')
    .post(authValidator.login,validatorMiddleware,validateAllowedField(allowedFields.authFields.login),authController.login);
    
export default router;