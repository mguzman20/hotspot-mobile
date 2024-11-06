
import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import MapView, { Marker } from 'react-native-maps';
import { zodResolver } from '@hookform/resolvers/zod';
import { styles } from '../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';

const formSchema = z.object({
    coordinates: z.object({
        latitude: z.number().min(-90).max(90, { message: 'La latitud debe estar entre -90 y 90' }),
        longitude: z.number().min(-180).max(180, { message: 'La longitud debe estar entre -180 y 180' }),
    }),
    title: z.string().min(0, { message: 'El título debe tener al menos 6 caracteres' }).max(255, { message: 'El título debe tener 255 caracteres o menos' }),
    description: z.string().min(0, { message: 'La descripción debe tener al menos 6 caracteres' }).max(1024, { message: 'La descripción debe tener 1024 caracteres o menos' }),
    category: z.enum(['Entretenimiento', 'Politica', 'Deporte', 'Tecnologia', 'Salud'], {
        errorMap: () => ({ message: 'La categoría debe ser una de las opciones permitidas: entretenimiento, política, deportes, tecnología, salud.' }),
    }),
});


export default function EventForm() {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(formSchema),
    });
    const [open, setOpen] = useState(false);

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

    const onSubmit = (data: any) => {
        console.log(data);
    };

    // Handle the map press to set coordinates
    const onMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setRegion((prevState) => ({
            ...prevState,
            latitude,
            longitude,
        }));
        // Update the coordinates in the form
        setValue('coordinates', { latitude, longitude });
    };

    return (
        <ScrollView >
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
                        items={[
                            { label: 'Entretenimiento', value: 'Entretenimiento' },
                            { label: 'Politica', value: 'Politica' },
                            { label: 'Deporte', value: 'Deporte' },
                            { label: 'Tecnologia', value: 'Tecnologia' },
                            { label: 'Salud', value: 'Salud' },
                        ]}
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
                onRegionChangeComplete={setRegion}
                onPress={onMapPress}
                showsUserLocation={true}  // Handle map press event to set coordinates
            >
                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
            </MapView>

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
        </ScrollView>
    );
}