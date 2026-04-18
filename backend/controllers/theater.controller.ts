const theaterService = require('../services/theater.service');

async function getTheaters(req: any, res: any) {
  try {
    const theaters = await theaterService.getAllTheaters();
    res.status(200).json({ result: theaters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

async function getTheaterNames(req: any, res: any) {
  try {
    const theaters = await theaterService.getTheaterNames();
    res.status(200).json(theaters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

async function addTheater(req: any, res: any) {
  try {
    const { name, location, total_screens, city } = req.body;
    const theater = await theaterService.addTheater({ name, location, total_screens, city });
    return res.status(201).json(theater);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
}

async function removeTheater(req: any, res: any) {
  try {
    const { theater_id } = req.body;
    await theaterService.removeTheater(theater_id);
    return res.status(200).json({ message: 'Theater removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = {
  getTheaters,
  getTheaterNames,
  addTheater,
  removeTheater,
};
