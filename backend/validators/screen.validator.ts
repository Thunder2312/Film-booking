function validateGetScreens(req: any, res: any, next: any) {
  const theater_id = parseInt(req.params.theater_id, 10);

  if (isNaN(theater_id)) {
    return res.status(400).json({ error: 'Invalid theater_id' });
  }

  // Attach the parsed value so the controller doesn't need to parse again
  req.parsedParams = { theater_id };
  next();
}

module.exports = {
  validateGetScreens,
};
