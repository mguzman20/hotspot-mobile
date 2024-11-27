import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Reviews from './Reviews';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { CampusEvent, CampusLocation } from '../helpers/backend';
import { capitalize } from '../helpers/util';
import { backendFetch } from '../helpers/backend';
import { useAuth } from '../context/AuthContext';
import { set } from 'react-hook-form';

interface Review {
    _id: string;
    title: string;
    description: string;
    user: string;
    rating: number;
    comment: string;
    criteria: string[];
}

export default function LocationDetail({ route }: { route?: { params: { locationId: string } } }) {
    if (route == null) return <></>
    const { authState, reloadSpots } = useAuth()
    const { locationId } = route.params;
    const location = authState.locationList.find((loc) => loc._id === locationId)
    if (location == null) return <></>


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


    // Fetch reviews asynchonously
    useEffect(() => {
        fetchReviews()
    }, []);
    

    const fetchReviews = async () => {
        console.log('fetching reviews')
        const response = await backendFetch({
            route: `/locationreviews/${location._id}`,
            method: 'GET',
            token: authState.token,
        })
        console.log(response)
        setReviews(response)
        reloadSpots()
    }
    

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
            <Text style={styles.eventCategory}>Rating: {String(Math.round(location.score*100)/100)}</Text>
            <Text style={styles.eventCategory}>Category: {capitalize(location.category)}</Text>

            <View style={styles.mapContainer}>
            {showMap && (
                    <MapView
                        provider={PROVIDER_GOOGLE}
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


    // Make a callbak to fetch reviews
    const ReviewsTab = () => (
        <Reviews
            reviews={reviews}
            locationID={location._id} 
            fetchReviews={fetchReviews}/>
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
