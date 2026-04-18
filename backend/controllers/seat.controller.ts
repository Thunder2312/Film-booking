const seatService = require('../services/seat.service');

async function getSeats(req: any, res: any) {
  try {
    const { showtimeId } = req.params;
    const seats = await seatService.getSeatsByShowtimeId(showtimeId);
    res.status(200).json({ result: seats });
  } catch (error) {
    console.error('Error getting seats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getSeats,
};
