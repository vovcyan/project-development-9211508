import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Card,
    CardBody,
    CardFooter,
    Image,
    Spinner,
    Divider,
    Button,
    useDisclosure,
} from '@nextui-org/react';

import {NewCityModal} from './Modal/NewCityModal.jsx';
import {getSavedCities, addSavedCity} from '../../utils.js';

function getCityMapImageUrl(city) {
    const params = new URLSearchParams({
        size: '750x300',
        center: `${city.coord.lat},${city.coord.lon}`,
    });

    return `/api/maps?${params}`;
}

export function ListPage() {
    const [selectedCities, setSelectedCities] = useState(getSavedCities());
    const [isLoading, setIsLoading] = useState(true);
    const [cityData, setCityData] = useState([]);
    const navigate = useNavigate();

    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onOpenChange: onModalOpenChange
    } = useDisclosure();

    const fetchListPageData = useCallback(async () => {
        const params = new URLSearchParams();
        selectedCities.forEach((cityId) => params.append('city', cityId));

        const response = await fetch(`/api/list?${params.toString()}`);
        const {cities} = await response.json();

        setCityData(cities);
        setIsLoading(false);
    }, [selectedCities]);

    const onNewCity = useCallback((cityId) => {
        addSavedCity(cityId);
        setSelectedCities(getSavedCities());
    }, []);

    const handleCardClick = useCallback((item) => {        
        navigate(`/details?city=${item.id}`);
    }, []);

    useEffect(() => {
        fetchListPageData();
    }, [fetchListPageData]);

    if (isLoading) {
        return (
            <Spinner />
        );
    }

    return (
        <div className="flex flex-wrap w-full gap-4">
            <div className="flex flex-wrap w-full justify-between pt-6">
                <div className="flex items-center">
                    <h2 className="text-2xl md:text-xl font-medium">Temperature in the cities</h2>
                </div>
                <Button
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    onPress={onModalOpen}
                >
                    Add
                </Button>
            </div>

            <Divider />

            <div className="w-full gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
                {cityData.map((item, index) => (
                    <Card shadow="sm" key={index} isPressable onPress={() => handleCardClick(item)}>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={item.name}
                                className="w-full object-cover h-[140px]"
                                src={getCityMapImageUrl(item)}
                            />
                        </CardBody>
                        <CardFooter className="text-small justify-between">
                            <b>{item.name}, {item.sys.country}</b>
                            <p className="text-default-500">
                                {Math.round(item.main.temp_min)}° — {Math.round(item.main.temp_max)}°
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <NewCityModal
                isOpen={isModalOpen}
                onOpenChange={onModalOpenChange}
                onNewCity={onNewCity}
            />
        </div>
    );
}