import { useOutlet } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import React from 'react';

export const AuthLayout = () => {
    const outlet = useOutlet();

    return <AuthProvider>{outlet}</AuthProvider>;
};
