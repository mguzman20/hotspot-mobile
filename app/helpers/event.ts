
export type CampusSpot = {
    coordinates: {
        latitude: number;
        longitude: number;
    }
    title: string;
    description: string;
    tags: string[];
    img?: string;
}

export type CampusEvent = CampusSpot & {
    date: Date;
};

export type CampusLocation = CampusSpot & {
    score: Number;
}
