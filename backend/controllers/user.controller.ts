const bcrypt = require('bcrypt');
const userService = require('../services/user.service');

async function getUsers(req: any, res: any) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
}

async function register(req: any, res: any) {
  try {
    const { username, full_name, email, phone, password, role } = req.body;

    const user = await userService.createUser({ username, full_name, email, phone, password, role });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function login(req: any, res: any) {
  try {
    const { username, password } = req.body;

    const user = await userService.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    //password compare karo
    const approved = user.role_approval;

    if (!approved) {
      return res.status(403).json({ message: 'Kindly wait for approval from admins' });
    }

    const isMatch = await bcrypt.compare(password, user.hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const accessToken = userService.generateAccessToken(user);

    res.status(200).json({ message: 'Login Succesfull', token: accessToken });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function logout(req: any, res: any) {
  // Client should just discard the token
  res.status(200).json({ message: 'Logged out successfully. Discard the token on client.' });
}

async function getUnapprovedUsers(req: any, res: any) {
  try {
    const users = await userService.getUnapprovedUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function approveUser(req: any, res: any) {
  try {
    const { user_id } = req.body;
    await userService.approveUser(user_id);
    res.status(200).json({ message: 'Approval is done' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = {
  getUsers,
  register,
  login,
  logout,
  getUnapprovedUsers,
  approveUser,
};
