import { body } from 'express-validator';

const authValidator = {
    register :
    [
        body('firstName')
            .notEmpty()
            .withMessage('First Name is required')
            .bail()
            .isLength({min : 3 , max : 30})
            .withMessage('First Name must be at least 3 character and at most 30 character')
            .bail()
            .trim(),
        body('lastName')
            .notEmpty()
            .withMessage('Last Name is required')
            .bail()
            .isLength({min:3 , max : 30})
            .withMessage('Last Name must be at least 3 character and at most 30 character')
            .bail()
            .trim(),
        body('age')
            .notEmpty()
            .withMessage('Age is required')
            .bail()
            .isInt({min : 18 , max : 99})
            .withMessage('Age must be between 18 and 99')
            ,
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .bail()
            .isEmail()
            .withMessage('Invalid email address')
            .bail()
            .toLowerCase(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .bail()
            .isLength({min : 8 , max : 30})
            .withMessage('Password must be at least 8 character and at most 30'),
        body('avatar')
            .optional()
            .notEmpty()
            .withMessage('Avatar cannot be empty')
            .bail()
            .isURL()
            .withMessage('Invalid image url')
    ] ,
    login :
    [
        body('email')
            .notEmpty()
            .withMessage('Email is requred')
            .bail()
            .isEmail()
            .withMessage('Invalid email address')
            .toLowerCase(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ]
};

export default authValidator;