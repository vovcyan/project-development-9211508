const express = require('express');

const httpClient = require('./http-client');

const router = express.Router();

router.get('/api/:city/details', async (req, res) => {
    const {city} = req.params;

    try {
        console.log(`[API_CITY_DETAILS]: Trying fetch weather by city id - ${city}`);
        const response = await httpClient.findCityByQuery(city);
        console.log(`[API_CITY_DETAILS]: Successfully received response`);

        res.status(200).json(response);
    } catch (error) {
        console.error('[API_CITY_DETAILS]: Error to fetch data');
        res.status(500).json({code: 'ERROR_CITY_DETAILS'});
    }
});

router.get('/api/suggest', async (req, res) => {
    const city = (req.query.city || '').trim();

    if (!city) {
        res.status(200).json({list: []});
        return;
    }

    try {
        console.log(`[API_SUGGEST]: Trying to find city by query - ${city}`);
        const response = await httpClient.findCityByQuery(city);
        console.log(`[API_SUGGEST]: Successfully received response`);

        res.status(200).json({list: response.list || []});
    } catch (error) {
        console.error('[API_SUGGEST]: Error to fetch data');
        res.status(500).json({code: 'ERROR_CITY_SUGGEST'});
    }
});

module.exports = router;