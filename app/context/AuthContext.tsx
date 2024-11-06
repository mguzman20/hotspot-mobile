import { createContext, useContext, useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { CampusEvent, CampusLocation, fetchEvents, fetchLocations } from '../helpers/backend';

interface AuthState {
    authenticated: boolean;
    token: string | null;
    eventList: CampusEvent[];
    locationList: CampusLocation[];
}

interface AuthProps {
    authState: AuthState;
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
    reloadSpots: () => Promise<void>;
}

const AuthContext = createContext<AuthProps>({
    authState: {
        token: null,
        authenticated: false,
        eventList: [],
        locationList: [],
    },
    setAuthState: () => { },
    reloadSpots: async () => { },
});


export const useAuth = () => {
    return useContext(AuthContext)
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        authenticated: false,
        eventList: [],
        locationList: [],
    });

    const reloadSpots = async () => {
        const [evs, locs] = await Promise.all([fetchEvents(authState.token), fetchLocations(authState.token)])
        setAuthState(authState => {
            return { ...authState, eventList: evs, locationList: locs }
        })
    }

    return (
        <AuthContext.Provider value={{ authState, setAuthState, reloadSpots }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;