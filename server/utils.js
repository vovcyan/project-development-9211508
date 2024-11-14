function getAppId() {
    if (!process.env.APP_ID) {
        throw new Error('OpenWeather app id must be provided as \'APP_ID\' in env');
    }

    return process.env.APP_ID;
}

module.exports = {
    getAppId,
}