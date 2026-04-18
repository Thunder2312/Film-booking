const showtimeService = require('../services/showtime.service');

async function getMovieShowTimes(req: any, res: any) {
  try {
    const { movieId } = req.params;
    let { startDate, endDate } = req.query;

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    startDate = startDate || today;
    endDate = endDate || today;

    const showtimes = await showtimeService.getMovieShowTimes(movieId, startDate, endDate);
    res.json(showtimes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getDayShowTimes(req: any, res: any) {
  try {
    let { startDate, endDate } = req.query;

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    startDate = startDate || today;
    endDate = endDate || today;

    const showtimes = await showtimeService.getDayShowTimes(startDate, endDate);
    res.json(showtimes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function addShowTime(req: any, res: any) {
  try {
    const { movie_id, screen_id, start_time, end_time, seatTypes } = req.body;
    await showtimeService.addShowTime({ movie_id, screen_id, start_time, end_time, seatTypes });
    return res.status(200).json({ message: 'Showtime added to theater' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = {
  getMovieShowTimes,
  getDayShowTimes,
  addShowTime,
};
