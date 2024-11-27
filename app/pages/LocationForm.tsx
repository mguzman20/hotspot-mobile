
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import MapView, { Camera, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { zodResolver } from '@hookform/resolvers/zod';
import { styles } from '../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { CATEGORIES } from '../helpers/backend';
import { capitalize } from '../helpers/util';
import { FontAwesome } from '@expo/vector-icons';

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


export interface LocationFormParams {
    initialRegion?: Camera;
}


export default function LocationForm({ route }: { route?: { params: LocationFormParams } }) {
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

    const defaultRegion: Region = {
        latitude: (boundaries.southWest.latitude + boundaries.northEast.latitude) / 2,
        longitude: (boundaries.southWest.longitude + boundaries.northEast.longitude) / 2,
        latitudeDelta: boundaries.northEast.latitude - boundaries.southWest.latitude,
        longitudeDelta: boundaries.northEast.longitude - boundaries.southWest.longitude
    };

    const [region, setRegion] = useState(defaultRegion);

    const onSubmit = async (data: any) => {
        console.log(data);

        // Send the data to the API

        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Redirect to the event page
                Alert.alert('Ubicación creada exitosamente');
                console.log('created location', data);
                navigation.goBack();
                reloadSpots();
            } else {
                // Display an error message
                console.error('Failed to create location');
                const error = await response.json();
                console.error(error);
            };
        } catch (error) {
            console.error('Failed to create location');
            console.error(error);
        }

    };

    // Handle the map press to set coordinates
    const onRegionChange = (newRegion: { latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }) => {
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
                <Button title="Seleccionar imagen" onPress={async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    // if (!result.canceled) {
                    //     console.log(result.uri);
                    //     setValue('image', result.uri);
                    // }
                }
                } />
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
                <View style={{
                    padding: 0,
                    marginVertical: 10,
                }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{
                            width: '100%',
                            height: 300,
                        }}
                        initialRegion={route?.params?.initialRegion ? undefined : defaultRegion}
                        initialCamera={route?.params?.initialRegion}
                        onRegionChange={onRegionChange}
                        showsUserLocation={true}
                    >
                    </MapView>
                    <View style={styles.centerMarker}>
                        <FontAwesome name="map-marker" size={40} color="red" />
                    </View>
                </View>
                {errors.coordinates && <Text style={styles.error}>Invalid coordinates</Text>}

                <Button title="Submit" onPress={handleSubmit(onSubmit)} />
            </View>
        </ScrollView>
    );
}