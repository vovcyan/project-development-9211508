import React, {useEffect, useState, useCallback} from 'react';
import {Spinner, Card, Image} from '@nextui-org/react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {AgCharts} from 'ag-charts-react';

import {getCityMapImageUrl, unixDateToStr} from '../../utils.js';

const CHART_SERIES = {
    type: 'bar',
    xKey: 'date',
    yKey: 'main.temp',
    tooltip: {
        renderer: function ({datum}) {
            return {
                content: `${datum.main.temp}°C`,
                title: 'Temperature',
            };
        },
    },
};

export function DetailsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentWeatherData, setCurrentWeatherData] = useState();
    const [forecastWeatherData, setForecastWeatherData] = useState();
    const navigate = useNavigate();

    const [params] = useSearchParams();
    const city = params.get('city');

    const fetchCityData = useCallback(async () => {
        const [detailsResponse, forecastResponse] = await Promise.all([
            fetch(`/api/${city}/details`),
            fetch(`/api/${city}/forecast`),
        ]);
        const currentWeatherData = await detailsResponse.json();
        const forecastWeatherData = await forecastResponse.json();

        setCurrentWeatherData(currentWeatherData);
        setForecastWeatherData(forecastWeatherData.list.slice(0, 10));
        setIsLoading(false);
    }, [city]);

    useEffect(() => {
        fetchCityData();
    }, [fetchCityData]);


    if (!city || !currentWeatherData || !forecastWeatherData) {
        return navigate('/');
    }

    if (isLoading) {
        return (
            <Spinner className="center" />
        );
    }

    const chartOptions = {
        series: [CHART_SERIES],
        data: forecastWeatherData.map((item) => {
            item.date = unixDateToStr(item.dt * 1000);
            return item;
        }),
    };

    const definitionsListItems = [
        {
            label: 'Feels like',
            value: `${currentWeatherData.main.feels_like}°C`,
        },
        {
            label: 'Humidity',
            value: `${currentWeatherData.main.humidity}%`,
        },
        {
            label: 'Pressure',
            value: `${currentWeatherData.main.pressure}hPa`,
        },
        {
            label: 'Min temperature',
            value: `${currentWeatherData.main.temp_min}°C`,
        },
        {
            label: 'Max temperature',
            value: `${currentWeatherData.main.temp_max}°C`,
        },
    ];

    return (
        <div className="flex flex-wrap flex-col w-full gap-10 pt-6">
            <div className="flex flex-wrap w-full justify-between gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl md:text-xl font-medium">
                            {currentWeatherData.name}, {currentWeatherData.sys.country}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            <img
                                src={`https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`}
                                width={45}
                                height={45}
                            />
                            <p className="text-4xl">{Math.round(currentWeatherData.main.temp)}°C</p>
                        </div>
                    </div>

                    {definitionsListItems.map((item) => (
                        <div className="flex flex-wrap gap-1">
                            <div className="text-default-500">{item.label}</div>
                            :
                            <div className="">{item.value}</div>
                        </div>
                    ))}
                </div>

                <Card className="border-none" radius="lg">
                    <Image
                        className="object-cover"
                        src={getCityMapImageUrl(currentWeatherData)}
                        alt={currentWeatherData.name}
                    />
                </Card>
            </div>

            <AgCharts options={chartOptions} />
        </div>
    );
}