function validateAddShowtime(req: any, res: any, next: any) {
  const { movie_id, screen_id, start_time, end_time, seatTypes } = req.body;

  if (!movie_id || !screen_id || !start_time || !end_time || !Array.isArray(seatTypes)) {
    return res.status(400).json({ message: 'Incomplete data sent from request' });
  }

  next();
}

module.exports = {
  validateAddShowtime,
};
