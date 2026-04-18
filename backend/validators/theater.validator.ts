function validateAddTheater(req: any, res: any, next: any) {
  const { name, location, total_screens, city } = req.body;

  if (!name || !location || !total_screens || !city) {
    return res.status(400).json({ message: 'Incomplete data sent from request' });
  }

  next();
}

function validateRemoveTheater(req: any, res: any, next: any) {
  const { theater_id } = req.body;

  if (!theater_id) {
    return res.status(400).json({ message: 'Theater id missing' });
  }

  next();
}

module.exports = {
  validateAddTheater,
  validateRemoveTheater,
};
