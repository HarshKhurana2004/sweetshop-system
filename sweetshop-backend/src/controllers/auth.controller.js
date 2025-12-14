const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await authService.register(name, email, password);

    return res.status(201).json({
      message: 'User registered successfully'
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    return res.status(200).json({
      token: token
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};
