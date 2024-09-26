import React, {useRef, useState, useEffect} from 'react';
import MapView, {Region, Camera, PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function Page() {
	const mapRef = useRef<MapView | null>(null); // Referencia al MapView

	const [region, setRegion] = useState<Region>({
		latitude: -33.498434,  // Coordenadas para centrar el mapa
        longitude: -70.610979,
		latitudeDelta: 0.006191950261857926,
		longitudeDelta: 0.013603887457861674,
		//Rotate map

	  });
	
	
	  const LATITUDE_BOUNDARIES = [-33.499430, -33.494997]; // Límites de latitud para Santiago
	  const LONGITUDE_BOUNDARIES = [-70.619969, -70.606093]; // Límites de longitud para Santiago
	
	  const MIN_LATITUDE_DELTA = 0;  // Valor mínimo de zoom (más cercano)
	  const MAX_LATITUDE_DELTA = 0.02;   // Valor máximo de zoom (más alejado)


	  // Función para restringir el movimiento del mapa y el zoom
	  const restrictMap = (newRegion: Region) => {
		let { latitude, longitude, latitudeDelta, longitudeDelta } = newRegion;
		console.log(latitude, longitude);
	
		// Limitar dentro de los límites geográficos
		if (latitude < LATITUDE_BOUNDARIES[0]) {latitude = LATITUDE_BOUNDARIES[0]; console.log('a')};
		if (latitude > LATITUDE_BOUNDARIES[1]) {latitude = LATITUDE_BOUNDARIES[1]; console.log('b')};
		if (longitude < LONGITUDE_BOUNDARIES[0]) {longitude = LONGITUDE_BOUNDARIES[0]; console.log('c')};
		if (longitude > LONGITUDE_BOUNDARIES[1]) {longitude = LONGITUDE_BOUNDARIES[1]; console.log('d')};
	
		// Limitar el zoom (latitudeDelta controla el zoom)
		if (latitudeDelta < MIN_LATITUDE_DELTA) latitudeDelta = MIN_LATITUDE_DELTA;
		if (latitudeDelta > MAX_LATITUDE_DELTA) latitudeDelta = MAX_LATITUDE_DELTA;
	
		// Ajustar longitudeDelta proporcionalmente
		longitudeDelta = latitudeDelta * (newRegion.longitudeDelta / newRegion.latitudeDelta);
		
		

		setRegion({
		  latitude,
		  longitude,
		  latitudeDelta,
		  longitudeDelta,
		});

	  };
	
	  useEffect(() => {
		const rotateMap = () => {
		  const camera: Camera = {
			center: {
				latitude: -33.498434,  // Coordenadas para centrar el mapa
				longitude: -70.610979,
			},
			heading: 0, // Cambia de Norte (0) a Este (90)
			pitch: 0,
			//zoom: 100,
			altitude: 2700,
		  };
		  mapRef.current?.animateCamera(camera, { duration: 1000 });
		};
	
		rotateMap();
	  }, []);

	  
	return (
		<View style={{ flex: 1 }}>
			<MapView style={StyleSheet.absoluteFill} 
			ref={mapRef}
			region={region}
			rotateEnabled={true}
        	onRegionChangeComplete={restrictMap}  // Restricción de movimientos y zoom
			provider={PROVIDER_GOOGLE}
			/>
		</View>
	);
}

