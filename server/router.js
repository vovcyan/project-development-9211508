const express = require('express');

const httpClient = require('./http-client');
const {getMapApiKey} = require('./utils');

const router = express.Router();

router.get('/api/list', async (_, res) => {
    const cities = [792680, 2643743, 2950159];
    const responses = await Promise.all(cities.map((city) => httpClient.fetchWeatherByCityId(city)));

    res.status(200).json({cities: responses});
});

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
        const buffer = await response.arrayBuffer();
        const imgData = new Uint8Array(buffer)
        
        console.log(`[API_MAPS]: Successfully received response`);

        res.set('content-type', response.headers.get('content-type'));
        res.set('content-length', response.headers.get('content-length'));
        res.end(imgData, 'binary');
    } catch (error) {
        console.error('[API_MAPS]: Error to fetch map image');
        res.status(500).json({code: 'ERROR_MAP'});
    }
});

router.get('/api/:cityId/details', async (req, res) => {
    const {cityId} = req.params;

    try {
        console.log(`[API_CITY_DETAILS]: Trying fetch weather by city id - ${cityId}`);
        const response = await httpClient.fetchWeatherByCityId(cityId);
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