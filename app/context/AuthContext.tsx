import { createContext, useContext, useEffect, useState} from 'react';

interface AuthProps {
    authState: {token: string | null; authenticated: boolean };
    setAuthState: React.Dispatch<React.SetStateAction<{
        token: string | null;
        authenticated: boolean;
      }>>;
}

const AuthContext = createContext<AuthProps>({
    authState: {
        token: null,
        authenticated: false
    },
    setAuthState: () => {}
});


export const useAuth = () => {
    return useContext(AuthContext)
};

import { ReactNode } from 'react';


export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean;
    }>({
        token: null,
        authenticated: false
    });

    return (
        <AuthContext.Provider value={ { authState, setAuthState }}>
          {children}
        </AuthContext.Provider>
      );
}

export default AuthProvider;