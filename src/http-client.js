const {getAppId} = require('./utils');

const appid = getAppId();
const endpoint = 'https://api.openweathermap.org/data/2.5';

class HttpClient {
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

    async fetchWeatherByCityId(cityId) {
        const url = this._prepareUrl('/weather', {
            q: cityId,
            appid,
        });

        const res = await fetch(url);
        return res.json();
    }
}

module.exports = new HttpClient();