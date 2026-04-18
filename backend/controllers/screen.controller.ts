const screenService = require('../services/screen.service');

async function getScreens(req: any, res: any) {
  try {
    const theater_id = req.parsedParams?.theater_id ?? parseInt(req.params.theater_id, 10);
    const screens = await screenService.getScreensByTheaterId(theater_id);
    res.status(200).json({ result: screens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getScreens,
};
