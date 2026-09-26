const authService = require('../service/auth.service');
const UserModel = require('../model/user.model');

/**
 * Register a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The newly created user and their authentication token
 */
const register = async (req, res ,next) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.create({ name, email, password });
        const token = await authService.generateToken(user);
        return res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


/**
 * Log in a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} The user and their authentication token
 */
const login = async (req, res ,next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.authenticateUser(email, password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = await authService.generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    register,
    login
};