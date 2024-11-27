import { Alert } from "react-native";

export type CampusBase = {
    _id: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
    title: string;
    description: string;
    category: string;
    img?: string;
}

export type CampusEvent = CampusBase & {
    date: Date;
    points: string[];
    negpoints: string[];
    subscribers: string[];
};

export type CampusLocation = CampusBase & {
    score: Number;
}

export type CampusSpot = CampusEvent | CampusLocation;

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

export interface FetchArgs {
    token: string | null;
    route: string;
    method: string;
    body?: any;
    handleErr?: { alertTitle: string, alertDesc?: string };
    rawResponse?: boolean,
}

export async function backendFetch(params: FetchArgs): Promise<any> {
    const headers: any = {
        'Content-Type': 'application/json',
    }
    if (params.token != null) {
        headers['Authorization'] = 'Bearer ' + params.token
    }
    const args: any = {
        method: params.method || 'GET',
        headers: headers,
    }
    if (params.body !== undefined) {
        args.body = JSON.stringify(params.body)
    }
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + params.route, args);
        if (!response.ok) throw new Error(`Error ${response.status} ${response.statusText} ${await response.text()} en ruta ${params.route}`);
        if (params.rawResponse) {
            return await response.text();
        } else {
            return await response.json();
        }
    } catch (error: any) {
        const err = params.handleErr
        if (err === undefined) {
            throw error;
        } else {
            Alert.alert(err.alertTitle, err.alertDesc || `${error}`)
        }
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