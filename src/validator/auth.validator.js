/**
 * validate :
 * 1- createAccount (registration)
 * 2- signin (login)
 * 
 */

import { body } from 'express-validator';

const authValidator = {
    register :
    [
        body('name')
            .notEmpty()
            .withMessage('Name is Required')
    ] ,
    login :
    [

    ]
};

export default authValidator;