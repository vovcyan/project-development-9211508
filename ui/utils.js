import dayjs from 'dayjs';

const STORAGE_CITIES_DATA_LOCATOR = 'LS_CITIES_DATA_LOCATOR';

const DEFAULT_STORAGE_STATE = JSON.stringify({
    cities: [792680, 2643743, 2950159, 2988507],
});

export function addSavedCity(cityId) {
    const cities = getSavedCities();

    cities.push(cityId);
    localStorage.setItem(STORAGE_CITIES_DATA_LOCATOR, JSON.stringify({cities}));
}

export function getSavedCities() {
    const {cities} = JSON.parse(
        localStorage.getItem(STORAGE_CITIES_DATA_LOCATOR) || DEFAULT_STORAGE_STATE
    );
    return cities;
}

export function getCityMapImageUrl(city) {
    const params = new URLSearchParams({
        size: '750x300',
        center: `${city.coord.lat},${city.coord.lon}`,
    });

    return `/api/maps?${params}`;
}

export function unixDateToStr(unixDate) {
    return dayjs(unixDate).format('DD.MM.YY HH:mm');
}