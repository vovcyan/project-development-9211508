import dayjs from 'dayjs';

const STORAGE_CITIES_DATA_LOCATOR = 'LS_CITIES_DATA_LOCATOR';

const DEFAULT_STORAGE_STATE = JSON.stringify({
    cities: [792680, 2643743, 2950159, 2988507],
});

/**
 * Method saves city to localStorage
 * @param {string} cityId 
 */
export function addSavedCity(cityId) {
    const cities = getSavedCities();

    cities.push(cityId);
    localStorage.setItem(STORAGE_CITIES_DATA_LOCATOR, JSON.stringify({cities}));
}

/**
 * Method returns saved cities from localStorage
 * @param {string} cityId 
 */
export function getSavedCities() {
    const {cities} = JSON.parse(
        localStorage.getItem(STORAGE_CITIES_DATA_LOCATOR) || DEFAULT_STORAGE_STATE
    );
    return cities;
}

/**
 * Method returns URL for map preview image
 * @param {string} cityId 
 */
export function getCityMapImageUrl(city) {
    const params = new URLSearchParams({
        size: '750x300',
        center: `${city.coord.lat},${city.coord.lon}`,
    });

    return `/api/maps?${params}`;
}

/**
 * Method transforms unix date for text format
 * @param {string} cityId 
 */
export function unixDateToStr(unixDate) {
    return dayjs(unixDate).format('DD.MM.YY HH:mm');
}