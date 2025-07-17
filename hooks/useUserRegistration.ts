import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInterface } from '../interfaces/UserInterface';
import { UserCredentials } from '../interfaces/UserCredentials';
import { UserContextValue } from '../interfaces/UserContextValue';
import { UserProviderProps } from '../interfaces/UserProviderProps';
import { UserSessionData } from '../interfaces/UserSessionData';
import { AuthService as userService } from '../services/AuthService';

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserSessionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [registrationLoading, setRegistrationLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const USER_STORAGE_KEY = '@kuntur_user_data';

    useEffect(() => {
        const clearDataInDevelopment = async () => {
            if (process.env.NODE_ENV === 'development') {
                await AsyncStorage.removeItem(USER_STORAGE_KEY);
            }
        };
        const initializeUser = async () => {
            await clearDataInDevelopment();
            await checkUserData();
        };
        initializeUser();
    }, []);

    const checkUserData = async (): Promise<void> => {
        try {
            setLoading(true);
            const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
            if (userData) {
                const parsedUser: UserSessionData = JSON.parse(userData);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('Error al verificar datos de usuario:', error);
            setError('Error al cargar datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (userData: UserInterface): Promise<{ success: boolean; message: string }> => {
        try {
            setRegistrationLoading(true);
            setError(null);
            if (!userData.nombre_local || !userData.ip_camara || !userData.ubicacion || !userData.latitud || !userData.longitud) {
                throw new Error('Todos los campos son requeridos');
            }
            if (!userData.password) {
                throw new Error('La contraseña es requerida');
            }
            const result = await userService.registerUser(userData);
            if (result.success) {
                const userDataToStore: UserSessionData = {
                    nombre_local: userData.nombre_local,
                    ip_camara: userData.ip_camara,
                    ubicacion: userData.ubicacion,
                    latitud: userData.latitud,
                    longitud: userData.longitud,
                };
                await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userDataToStore));
                setUser(userDataToStore);
                return { success: true, message: 'Usuario registrado exitosamente' };
            }
            throw new Error(result.message || 'Error al registrar usuario');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            if (error instanceof Error) {
                setError(error.message);
                return { success: false, message: error.message };
            }
            setError('Error al registrar usuario');
            return { success: false, message: 'Error al registrar usuario' };
        } finally {
            setRegistrationLoading(false);
        }
    };

    const loginUser = async (credentials: UserCredentials): Promise<{ success: boolean; message: string }> => {
        try {
            setRegistrationLoading(true);
            setError(null);
            const result = await userService.loginUser(credentials);
            if (result.success) {
                const userData: UserSessionData = await userService.getUserData();
                await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
                setUser(userData);
                return { success: true, message: 'Login exitoso' };
            }
            throw new Error(result.message || 'Error al iniciar sesión');
        } catch (error) {
            console.error('Error al hacer login:', error);
            if (error instanceof Error) {
                setError(error.message);
                return { success: false, message: error.message };
            }
            setError('Error al iniciar sesión');
            return { success: false, message: 'Error al iniciar sesión' };
        } finally {
            setRegistrationLoading(false);
        }
    };

    const updateUser = async (newData: Partial<UserInterface>): Promise<{ success: boolean; message: string }> => {
        try {
            setRegistrationLoading(true);
            setError(null);
            const updatedUser: UserSessionData = { ...user!, ...newData };
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true, message: 'Usuario actualizado exitosamente' };
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            if (error instanceof Error) {
                setError(error.message);
                return { success: false, message: error.message };
            }
            setError('Error al actualizar usuario');
            return { success: false, message: 'Error al actualizar usuario' };
        } finally {
            setRegistrationLoading(false);
        }
    };

    const logout = async (): Promise<{ success: boolean; message: string }> => {
        try {
            await userService.logout();
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
            setError(null);
            return { success: true, message: 'Sesión cerrada' };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
            setError(null);
            return { success: true, message: 'Sesión cerrada localmente' };
        }
    };

    const clearUser = async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Error al limpiar datos del usuario:', error);
        }
    };

    const isUserRegistered = (): boolean => {
        return user !== null;
    };

    const checkLocalExists = async (nombreLocal: string): Promise<boolean> => {
        try {
            const result = await userService.checkUserExists(nombreLocal);
            return result.exists;
        } catch (error) {
            console.error('Error al verificar local:', error);
            return false;
        }
    };

    const value: UserContextValue = {
        user,
        loading,
        registrationLoading,
        error,
        registerUser,
        loginUser,
        updateUser,
        logout,
        clearUser,
        isUserRegistered,
        checkUserData,
        checkLocalExists,
        clearError: () => setError(null),
    };

    // JSX requires .tsx extension. If you see errors, rename this file to useUserRegistration.tsx
    return React.createElement(UserContext.Provider, { value }, children);
};

export const useUserRegistration = (): UserContextValue => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserRegistration must be used within a UserProvider');
    }
    return context;
};