

import Joi from 'joi';

export const signupSchema = Joi.object({
    name: Joi.string().trim().min(2).max(60).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(128).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': 'Passwords do not match',
    }),
    role: Joi.string().valid('admin','mentor','user').optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
})