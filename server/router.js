const express = require('express');

const httpClient = require('./http-client');
const {getMapApiKey} = require('./utils');

const router = express.Router();

/**
 * API handler for GET request which returns
 * basic weather information for specified list of city ids.
 */
router.get('/api/list', async (req, res) => {
    try {
        const cities = Array.isArray(req.query.city) ? req.query.city : [];

        console.log(`[API_LIST]: Trying fetch weather for cities - ${cities.join(', ')}`);

        const responses = await Promise.all(
            cities.map((city) => httpClient.fetchWeatherByCityId(city))
        );

        console.log(`[API_LIST]: Successfully received response`);

        res.status(200).json({cities: responses});
    } catch (error) {
        console.error('[API_MAPS]: Error to fetch weather for cities', error);
        res.status(500).json({code: 'ERROR_LIST'});
    }
});

/**
 * API handler for GET request which returns
 * image preview map for specified city in binary format.
 */
router.get('/api/maps', async (req, res) => {
    const size = (req.query.size || '').trim();
    const center = (req.query.center || '').trim();

    if (!size || !center) {
        res.status(400);
        return;
    }

    try {
        console.log(`[API_MAPS]: Trying fetch map image with params - ${size}, ${center}`);

        const searchParams = new URLSearchParams();
        searchParams.append('maptype', 'terrain');
        searchParams.append('size', size);
        searchParams.append('center', center);
        searchParams.append('zoom', 12);
        searchParams.append('rapidapi-key', getMapApiKey());

        const response = await fetch(`https://maptoolkit.p.rapidapi.com/staticmap/?${searchParams.toString()}`);

        // Transform image in array buffer format to Uint8Array which express.js can use
        const buffer = await response.arrayBuffer();
        const imgData = new Uint8Array(buffer)

        console.log(`[API_MAPS]: Successfully received response`);

        // Returns image content type and its size
        res.set('content-type', response.headers.get('content-type'));
        res.set('content-length', response.headers.get('content-length'));

        // Returns image in binary form
        res.end(imgData, 'binary');
    } catch (error) {
        console.error('[API_MAPS]: Error to fetch map image', error);
        res.status(500).json({code: 'ERROR_MAP'});
    }
});

/**
 * API handler for GET request which returns
 * detailed weather information for specified city.
 */
router.get('/api/:cityId/details', async (req, res) => {
    const {cityId} = req.params;

    try {
        console.log(`[API_CITY_DETAILS]: Trying fetch weather by city id - ${cityId}`);
        const response = await httpClient.fetchWeatherByCityId(cityId);
        console.log(`[API_CITY_DETAILS]: Successfully received response`);

        res.status(200).json(response);
    } catch (error) {
        console.error('[API_CITY_DETAILS]: Error to fetch data', error);
        res.status(500).json({code: 'ERROR_CITY_DETAILS'});
    }
});

/**
 * API handler for GET request which returns
 * weather forecast for specified city.
 */
router.get('/api/:cityId/forecast', async (req, res) => {
    const {cityId} = req.params;

    try {
        console.log(`[API_CITY_FORECAST]: Trying fetch weather by city id - ${cityId}`);
        const {coord: {lat, lon}} = await httpClient.fetchWeatherByCityId(cityId);
        console.log(`[API_CITY_FORECAST]: Successfully received response`);

        console.log(`[API_CITY_FORECAST]: Trying fetch weather forecast by geo (lat, lon) - (${lat}, ${lon})`);
        const response = await httpClient.fetchWeatherForecastByGeo(lat, lon);
        console.log(`[API_CITY_FORECAST]: Successfully received response`);

        res.status(200).json(response);
    } catch (error) {
        console.error('[API_CITY_FORECAST]: Error to fetch data', error);
        res.status(500).json({code: 'ERROR_CITY_FORECAST'});
    }
});

/**
 * API handler for GET request which returns
 * suggested city names by specified text.
 */
router.get('/api/suggest', async (req, res) => {
    const city = (req.query.city || '').trim();

    if (!city) {
        res.status(200).json({list: []});
        return;
    }

    try {
        const uniqueCities = new Map();

        console.log(`[API_SUGGEST]: Trying to find city by query - ${city}`);
        const response = await httpClient.findCityByQuery(city);
        console.log(`[API_SUGGEST]: Successfully received response`);

        (response.list || []).forEach((item) => {
            const id = `${item.name},${item.sys.country}`;

            if (!uniqueCities.has(id)) {
                uniqueCities.set(id, item);
            }
        });

        res.status(200).json({list: Array.from(uniqueCities.values())});
    } catch (error) {
        console.error('[API_SUGGEST]: Error to fetch data', error);
        res.status(500).json({code: 'ERROR_CITY_SUGGEST'});
    }
});

module.exports = router;