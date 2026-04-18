function validateAddMovie(req: any, res: any, next: any) {
  const { title, description, duration_minutes, genre, language, rated, release_date, img_link } = req.body;

  if (!title || !description || !duration_minutes || !genre || !language || !rated || !release_date || !img_link) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  next();
}

function validateDeactivateMovie(req: any, res: any, next: any) {
  const { movie_id } = req.body;

  if (!movie_id) {
    return res.status(400).json({ error: 'Missing movie_id' });
  }

  next();
}

module.exports = {
  validateAddMovie,
  validateDeactivateMovie,
};
