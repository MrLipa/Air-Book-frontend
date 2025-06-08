const { session } = require('../config/db');
require('dotenv').config();

const getAllAirports = async (req, res) => {
  try {
    const result = await session.run(
      `MATCH (a:Airport) RETURN a.airport_id, a.city, a.country, a.image`
    );

    const airports = result.records.map((record) => ({
      airportId: record.get('a.airport_id').low,
      city: record.get('a.city'),
      country: record.get('a.country'),
      image: record.get('a.image'),
    }));

    res.status(200).json(airports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAirports,
};
