/**
 * Methods returns OpenWeather app id as a string
 * @returns {string}
 */
function getAppId() {
    if (!process.env.APP_ID) {
        throw new Error('OpenWeather app id must be provided as \'APP_ID\' in env');
    }

    return process.env.APP_ID;
}

/**
 * Methods returns app id for OpenStreetMap as a string
 * @returns {string}
 */
function getMapApiKey() {
    if (!process.env.MAP_API_KEY) {
        throw new Error('Map API key must be provided as \'MAP_API_KEY\' in env');
    }

    return process.env.MAP_API_KEY;
}

module.exports = {
    getAppId,
    getMapApiKey,
}