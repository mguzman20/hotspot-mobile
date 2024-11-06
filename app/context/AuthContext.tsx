import { createContext, useContext, useEffect, useState } from 'react';

interface AuthState {
    authenticated: boolean;
    token: string | null;
    eventList: CampusEvent[];
}

interface AuthProps {
    authState: AuthState;
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
    reloadEvents: () => Promise<void>;
}

const AuthContext = createContext<AuthProps>({
    authState: {
        token: null,
        authenticated: false,
        eventList: [],
    },
    setAuthState: () => { },
    reloadEvents: async () => { },
});


export const useAuth = () => {
    return useContext(AuthContext)
};

import { ReactNode } from 'react';
import { CampusEvent, fetchEvents } from '../helpers/event';


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        authenticated: false,
        eventList: [],
    });

    const reloadEvents = async () => {
        const evs = await fetchEvents(authState.token);
        setAuthState(authState => {
            return { ...authState, eventList: evs }
        })
    }

    return (
        <AuthContext.Provider value={{ authState, setAuthState, reloadEvents }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;