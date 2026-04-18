function validateRegister(req: any, res: any, next: any) {
  const { username, full_name, email, phone, password } = req.body;

  if (!username || !full_name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  next();
}

function validateLogin(req: any, res: any, next: any) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  next();
}

function validateApproveUser(req: any, res: any, next: any) {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateApproveUser,
};
