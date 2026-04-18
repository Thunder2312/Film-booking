const movieService = require('../services/movie.service');

async function addMovie(req: any, res: any) {
  try {
    const { title, description, duration_minutes, genre, language, rated, release_date, img_link, writers, actors, country } = req.body;
    const added_by = req.user.username; // Get from decoded JWT

    const movie = await movieService.addMovie({
      title, description, duration_minutes, genre, language, rated,
      release_date, added_by, img_link, writers, actors, country,
    });

    res.status(200).json({ message: 'Movie Added', movie });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMovies(req: any, res: any) {
  try {
    const movies = await movieService.getActiveMovies();
    res.status(200).json({ result: movies });
  } catch (error) {
    console.error('Error getting movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMovieById(req: any, res: any, next: any) {
  try {
    const { movieId } = req.params;
    const movie = await movieService.getMovieById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the movie is inactive
    if (movie.is_active === false) {
      return res.status(403).json({ message: 'Movie is inactive' });
    }

    res.status(200).json({ result: movie });
  } catch (err) {
    next(err);
  }
}

async function deactivateMovie(req: any, res: any) {
  try {
    const { movie_id } = req.body;
    const rowCount = await movieService.deactivateMovie(movie_id);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating movie', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  addMovie,
  getMovies,
  getMovieById,
  deactivateMovie,
};
