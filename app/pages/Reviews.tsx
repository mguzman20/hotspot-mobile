import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useAuth } from '../context/AuthContext';


interface Review {
    title: string;
    description: string;
    user: string;
    rating: number;
    criteria: string[];
    _id: string;
}

interface ReviewsProps {
    reviews: Review[];
    locationID: string;
    fetchReviews: () => void;
}

export default function Reviews({ reviews, locationID, fetchReviews }: ReviewsProps) {

    const [isModalVisible, setModalVisible] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, description: '' });
    const { authState, reloadSpots } = useAuth();

    const reviewsData = reviews.reduce<{ score: number, count: number }[]>((acc, review) => {
        const index = acc.findIndex((item) => item.score === review.rating);
        if (index === -1) {
            acc.push({ score: review.rating, count: 1 });
        } else {
            acc[index].count += 1;
        }
        return acc;
    }, []);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleSubmitReview = async () => {
        try {
            console.log(JSON.stringify(newReview))
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/locationreviews/${locationID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.token}`,
                },
                body: JSON.stringify(newReview),
            });
            console.log(response)
            setModalVisible(false);
            fetchReviews()
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return(
    <ScrollView style={styles.tabContainer}>
        {/* Review Summary */}
        <Text style={styles.sectionTitle}>Reviews Summary </Text>
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
        <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                swipeDirection="down"
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Write a Review</Text>

                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <TouchableOpacity key={rating} onPress={() => setNewReview({ ...newReview, rating })}>
                                <Text style={newReview.rating >= rating ? styles.selectedStar : styles.star}>
                                    ★
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Write your comment..."
                        multiline
                        onChangeText={(text) => setNewReview({ ...newReview, description: text })}
                    />

                    <Button title="Submit Review" onPress={handleSubmitReview} />
                </View>
            </Modal>

        {/* Button to add a review */}
        <View style={styles.buttonContainer}>
            <Button title="Write a Review" onPress={toggleModal} />
        </View>

        {/* Individual Reviews */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.length > 0 ? (
            reviews.map((review) => (
                <View key={review._id} style={styles.reviewCard}>
                    <Text style={styles.reviewUser}>{review.user}</Text>
                    <Text style={styles.reviewRating}>{'★'.repeat(review.rating)}</Text>
                    <Text style={styles.reviewComment}>{review.description}</Text>
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
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    star: {
        fontSize: 32,
        color: '#e0e0e0',
    },
    selectedStar: {
        fontSize: 32,
        color: '#ffd700',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    }
});

