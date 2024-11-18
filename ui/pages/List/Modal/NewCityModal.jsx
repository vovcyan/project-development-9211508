import React, {useCallback, useState} from 'react';
import {debounce} from 'lodash';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Spinner,
    Chip,
} from '@nextui-org/react';

export function NewCityModal({isOpen, onOpenChange, onNewCity}) {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);

    const searchForCity = useCallback(async (city) => {
        setIsLoading(true);
        setSuggestions([]);
        setSelectedSuggestionId(null);

        try {
            const params = new URLSearchParams();
            params.append('city', city);

            const response = await fetch(`/api/suggest?${params.toString()}`);
            const data = await response.json();

            setSuggestions(data.list || []);
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false);
    }, []);

    return (
        <Modal isOpen={isOpen} onOpenChange={(value) => {
            onOpenChange(value);
            setSuggestions([]);
            setSelectedSuggestionId(null);
        }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add new city</ModalHeader>
                        <ModalBody>
                            <p>Search for the city and selected it from the suggestions</p>
                            <Input
                                type="city"
                                label="City"
                                placeholder="Enter city"
                                onValueChange={debounce(searchForCity, 1000)}
                            />
                            <div className="flex flex-wrap w-full gap-4">
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    suggestions.map((item, index) => (
                                        <Chip
                                            className="clickable"
                                            size="md"
                                            key={index}
                                            color={selectedSuggestionId === index ? 'primary' : 'default'}
                                            onClick={() => setSelectedSuggestionId(index)}
                                        >
                                            {item.name}, {item.sys.country}
                                        </Chip>
                                    ))
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={() => {
                                onNewCity(suggestions[selectedSuggestionId].id);
                                onClose();
                            }}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}