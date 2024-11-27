import { Alert } from "react-native";

export type CampusSpot = {
    coordinates: {
        latitude: number;
        longitude: number;
    }
    title: string;
    description: string;
    category: string;
    img?: string;
}

export type CampusEvent = CampusSpot & {
    date: Date;
};

export type CampusLocation = CampusSpot & {
    score: number;
}

export async function fetchEvents(token: string | null): Promise<CampusEvent[]> {
    try {
        const headers: any = {
            'Content-Type': 'application/json',
        }
        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token
        }
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/events",
            {
                method: 'GET',
                headers: headers,
            }
        );
        if (!response.ok) throw new Error('Error al obtener los eventos');
        const data: CampusEvent[] = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        Alert.alert('Hubo un problema al cargar los eventos');
        return []
    }
}

export async function fetchLocations(token: string | null): Promise<CampusLocation[]> {
    try {
        const headers: any = {
            'Content-Type': 'application/json',
        }
        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token
        }
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/locations",
            {
                method: 'GET',
                headers: headers,
            }
        );
        if (!response.ok) throw new Error('Error al obtener los eventos');
        const data: CampusLocation[] = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        Alert.alert('Hubo un problema al cargar las ubicaciones');
        return []
    }
}

export const CATEGORIES: readonly [string, ...string[]] = [
    'baño',
    'estudio',
    'comida',
    'sala',
    'charla',
    'concierto',
]