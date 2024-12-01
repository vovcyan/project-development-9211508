const {getAppId} = require('./utils');

const appid = getAppId();
const endpoint = 'https://api.openweathermap.org/data/2.5';

class HttpClient {

    // Method generates OpenWeatherMap API URL with passed search params for specified path
    _prepareUrl(path, params) {
        const paramEntries = Object.entries(params);
        let searchParamsStr = '';

        if (paramEntries.length > 0) {
            const searchParams = new URLSearchParams();

            paramEntries.forEach(([key, value]) => {
                searchParams.append(key, value);
            });

            searchParamsStr = `?${searchParams.toString()}`;
        }
        
        return `${endpoint}${path}${searchParamsStr}`;
    }

    async findCityByQuery(query) {
        const url = this._prepareUrl('/find', {
            q: query,
            cnt: 10,
            type: 'like',
            sort: 'population',
            appid,
        });

        const res = await fetch(url);
        return res.json();
    }

    async fetchWeatherByCityId(id) {
        const url = this._prepareUrl('/weather', {
            id,
            appid,
            units: 'metric',
        });

        const res = await fetch(url);
        return res.json();
    }

    async fetchWeatherForecastByGeo(lat, lon) {
        const url = this._prepareUrl('/forecast', {
            lat,
            lon,
            appid,
            units: 'metric',
        });

        const res = await fetch(url);
        return res.json();
    }
}

module.exports = new HttpClient();