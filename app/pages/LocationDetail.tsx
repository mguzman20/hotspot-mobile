import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Reviews from './Reviews';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { CampusEvent, CampusLocation } from '../helpers/backend';
import { capitalize } from '../helpers/util';

interface Review {
    title: string;
    description: string;
    user: string;
    rating: number;
    comment: string;
    criteria: string[];
}

export default function LocationDetail({ route }: { route?: { params: { location: CampusLocation } } }) {
    if (route == null) return <></>
    const { location } = route.params;

    // HACK: expo 52 qlo
    const [showMap, setShowMap] = useState(false)
    useEffect(() => {
        console.log(location)
        setTimeout(() => setShowMap(true), 1000)
    }, [])

    const [index, setIndex] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [routes] = useState([
        { key: 'overview', title: 'Overview' },
        { key: 'reviews', title: 'Reviews' },
        { key: 'about', title: 'About' },
    ]);
    

    // Fetch reviews
    useEffect(() => {
        console.log('fetching reviews')
        fetch(process.env.EXPO_PUBLIC_API_URL + `/locationreviews/${location._id}`)
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error(error));
        console.log(reviews)
    }, []);

    const Overview = () => (
        <ScrollView style={styles.tabContainer}>
            <Image
                style={styles.imagePlaceholder}
                source={{
                    uri: location.img ? location.img : 'https://www.dondeir.com/wp-content/uploads/2016/07/helados1.jpg',
                }}
                resizeMode="cover"
            />
            <Text style={styles.eventName}>{location.title}</Text>
            <Text style={styles.eventCategory}>Category: {capitalize(location.category)}</Text>

            <View style={styles.mapContainer}>
                {showMap && (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.coordinates.latitude,
                            longitude: location.coordinates.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.coordinates.latitude,
                                longitude: location.coordinates.longitude,
                            }}
                            title={location.title}
                            description={location.description}
                        />
                    </MapView>
                )}
            </View>
        </ScrollView>
    );

    
    const ReviewsTab = () => (
        <Reviews reviews={reviews}/>
    );

    const About = () => (
        <ScrollView style={styles.tabContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.eventDescription}>{location.description}</Text>
        </ScrollView>
    );

    const renderScene = SceneMap({
        overview: Overview,
        reviews: ReviewsTab,
        about: About,
    });


    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={styles.indicator}
                    style={styles.tabBar}
                    labelStyle={styles.tabLabel}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    imagePlaceholder: {
        height: 200,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    eventCategory: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#757575',
        marginBottom: 16,
    },
    mapContainer: {
        height: 200,
        width: '100%',
        marginBottom: 16,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    eventDescription: {
        fontSize: 16,
        color: '#424242',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    tabBar: {
        backgroundColor: '#DC1B1B',
    },
    indicator: {
        backgroundColor: '#000',
    },
    tabLabel: {
        color: 'Black',
        fontWeight: 'bold',
    },
    tabContainer: {
        flex: 1,
        padding: 16,
    },
});
