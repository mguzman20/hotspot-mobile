import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useAuth } from '../context/AuthContext';


// Dummy data for reviews
const reviewsData = [
    { score: 5, count: 10 },
    { score: 4, count: 8 },
    { score: 3, count: 5 },
    { score: 2, count: 2 },
    { score: 1, count: 1 },
];

interface Review {
    title: string;
    description: string;
    user: string;
    rating: number;
    comment: string;
    criteria: string[];
}

interface ReviewsProps {
    reviews: Review[];
    locationID: string;
}

export default function Reviews({ reviews, locationID }: ReviewsProps) {

    const [isModalVisible, setModalVisible] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const { authState, reloadSpots } = useAuth();


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() => {
        console.log(reviews)
        console.log(locationID)
    }
    , []);


    const handleSubmitReview = async (data: any) => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/locationreviews/${locationID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.token}`,
                },
                body: JSON.stringify(data),
            });
            console.log(response)
            // fetchReviews(); // Refresh reviews after submission
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return(
    <ScrollView style={styles.tabContainer}>
        {/* Review Summary */}
        <Text style={styles.sectionTitle}>Reviews Summary</Text>
        <View style={styles.reviewSummaryContainer}>
            {reviewsData.map((item) => (
                <View key={item.score} style={styles.reviewRow}>
                    <Text style={styles.reviewScore}>{item.score}★</Text>
                    <View style={styles.reviewBarContainer}>
                        <View
                            style={[
                                styles.reviewBar,
                                { width: `${item.count * 10}%` }, // Scale width dynamically
                            ]}
                        />
                    </View>
                    <Text style={styles.reviewCount}>{item.count}</Text>
                </View>
            ))}
        </View>

        {/* Button to add a review */}
        <View style={styles.buttonContainer}>
            <Button title="Write a Review" onPress={() => console.log('Navigate to review form')} />
        </View>

        {/* Individual Reviews */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.length > 0 ? (
            reviews.map((review) => (
                <View key={review.title} style={styles.reviewCard}>
                    <Text style={styles.reviewUser}>{review.user}</Text>
                    <Text style={styles.reviewRating}>{'★'.repeat(review.rating)}</Text>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
            ))
        ) : (
            <Text style={styles.eventDescription}>No reviews yet.</Text>
        )}
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    tabContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    reviewSummaryContainer: {
        marginBottom: 16,
    },
    reviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewScore: {
        width: 30,
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewBarContainer: {
        flex: 1,
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginHorizontal: 8,
    },
    reviewBar: {
        height: '100%',
        backgroundColor: '#4caf50',
        borderRadius: 5,
    },
    reviewCount: {
        width: 30,
        textAlign: 'center',
        fontSize: 16,
    },
    buttonContainer: {
        marginBottom: 16,
    },
    reviewCard: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    reviewUser: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewRating: {
        color: '#ffd700',
        marginBottom: 4,
    },
    reviewComment: {
        fontSize: 14,
        color: '#424242',
    },
    eventDescription: {
        fontSize: 16,
        color: '#757575',
    },
});

