import React, {useCallback, useEffect, useState} from 'react';
import {Card, CardBody, CardFooter, Image, Spinner} from '@nextui-org/react';

function getCityMapImageUrl(city) {
    const params = new URLSearchParams({
        size: '750x300',
        center: `${city.coord.lat},${city.coord.lon}`,
    });

    return `/api/maps?${params}`;
}

export function ListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [cityData, setCityData] = useState([]);

    const fetchListPageData = useCallback(async () => {
        const response = await fetch('/api/list');
        const {cities} = await response.json();

        setCityData(cities);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchListPageData();
    }, []);

    if (isLoading) {
        return (
            <Spinner />
        );
    }

    return (
        <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
            {cityData.map((item, index) => (
                <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
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
                        <b>{item.name}</b>
                        <p className="text-default-500">
                            {Math.round(item.main.temp_min)}° — {Math.round(item.main.temp_max)}°
                        </p>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}