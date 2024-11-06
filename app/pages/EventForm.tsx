
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import MapView, { Marker } from 'react-native-maps';
import { zodResolver } from '@hookform/resolvers/zod';
import { styles } from '../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { CATEGORIES } from '../helpers/backend';
import { capitalize } from '../helpers/util';

const formSchema = z.object({
    coordinates: z.object({
        latitude: z.number().min(-90).max(90, { message: 'La latitud debe estar entre -90 y 90' }),
        longitude: z.number().min(-180).max(180, { message: 'La longitud debe estar entre -180 y 180' }),
    }),
    title: z.string().min(0, { message: 'El título debe tener al menos 6 caracteres' }).max(255, { message: 'El título debe tener 255 caracteres o menos' }),
    description: z.string().min(0, { message: 'La descripción debe tener al menos 6 caracteres' }).max(1024, { message: 'La descripción debe tener 1024 caracteres o menos' }),
    category: z.enum(CATEGORIES, {
        errorMap: () => ({ message: 'La categoría debe ser una de las opciones permitidas: ' + CATEGORIES.join(', ') + '.' }),
    }),
});


export default function EventForm() {
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(formSchema),
    });
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { authState, reloadSpots } = useAuth();
    const boundaries = {
        northEast: { latitude: -33.495314, longitude: -70.604986 },
        southWest: { latitude: -33.501466, longitude: -70.616074 },
    }

    const [region, setRegion] = useState({
        latitude: (boundaries.southWest.latitude + boundaries.northEast.latitude) / 2,
        longitude: (boundaries.southWest.longitude + boundaries.northEast.longitude) / 2,
        latitudeDelta: boundaries.northEast.latitude - boundaries.southWest.latitude,
        longitudeDelta: boundaries.northEast.longitude - boundaries.southWest.longitude
    });

    const onSubmit = async (data: any) => {
        console.log(data);

        // Send the data to the API

        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Redirect to the event page
                Alert.alert('Evento creado exitosamente');
                console.log('created event', data);
                navigation.goBack();
                reloadSpots();
            } else {
                // Display an error message
                console.error('Failed to create event');
                const error = await response.json();
                console.error(error);
            };
        } catch (error) {
            console.error('Failed to create event');
            console.error(error);
        }

    };

    // Handle the map press to set coordinates
    const onRegionChangeComplete = (newRegion: { latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }) => {
        setRegion(newRegion);
        // Update the coordinates in the form
        setValue('coordinates', { latitude: newRegion.latitude, longitude: newRegion.longitude });
    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.label}>Titulo</Text>
                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.title?.message && <Text style={styles.error}>{String(errors.title.message)}</Text>}

                <Text style={styles.label}>Descripción</Text>
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.textArea}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline
                        />
                    )}
                />
                {errors.description && <Text style={styles.error}>{String(errors.description.message)}</Text>}

                <Text style={styles.label}>Categoria</Text>
                <Controller
                    control={control}
                    name="category"
                    render={({ field: { onChange, value } }) => (
                        <DropDownPicker
                            items={
                                CATEGORIES.map(id => { return { label: capitalize(id), value: id } })
                            }
                            listMode="SCROLLVIEW"
                            value={value}
                            placeholder='Selecciona una categoría'
                            containerStyle={styles.dropdownContainer}
                            style={styles.dropdown}
                            setValue={onChange}
                            multiple={false}
                            onChangeValue={onChange}
                            open={open}
                            setOpen={setOpen}
                        />
                    )}
                />
                {errors.category && <Text style={styles.error}>{String(errors.category.message)}</Text>}

                <Text style={styles.label}>Ubicacion</Text>
                <MapView
                    style={{
                        width: '100%',
                        height: 300,
                        marginVertical: 10,
                    }}
                    region={region}
                    onRegionChangeComplete={onRegionChangeComplete}
                    showsUserLocation={true}  // Handle map press event to set coordinates
                >
                    <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                </MapView>
                {errors.coordinates && <Text style={styles.error}>Invalid coordinates</Text>}

                <Button title="Submit" onPress={handleSubmit(onSubmit)} />
            </View>
        </ScrollView>
    );
}