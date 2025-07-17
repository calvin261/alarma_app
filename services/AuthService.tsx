import { UserInterface } from "../interfaces/UserInterface";
import { UserCredentials } from "../interfaces/UserCredentials";
import { UserSessionData } from "../interfaces/UserSessionData";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
export const AuthService = {
    // Registrar nuevo usuario
    async registerUser(userData: UserInterface): Promise<any> {
        try {
            console.log('Registrando usuario con datos:', userData);
            
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    nombre_local: userData.nombre_local,
                    ubicacion: userData.ubicacion,
                    ip_camara: userData.ip_camara,
                    latitud: userData.latitud,
                    longitud: userData.longitud,
                    password: userData.password
                })
            });

            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Response data:', result);

            if (!response.ok) {
                throw new Error(result.message || `Error del servidor: ${response.status}`);
            }

            return result;
        } catch (error) {
            console.error('Error en registerUser:', error);
            if (error instanceof Error) {
                throw new Error(error.message || 'Error al registrar usuario');
            }
            throw new Error('Error al registrar usuario');
        }
    },

    // Login de usuario
    async loginUser(credentials: UserCredentials): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                body: new URLSearchParams({
                    nombre_local: credentials.nombre_local,
                    password: credentials.password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Credenciales incorrectas');
            }

            return result;
        } catch (error) {
            console.error('Error en loginUser:', error);
            if (error instanceof Error) {
                throw new Error(error.message || 'Error al iniciar sesión');
            }
            throw new Error('Error al iniciar sesión');
        }
    },

    // Verificar si el usuario existe
    async checkUserExists(nombreLocal: string): Promise<{ exists: boolean }> {
        try {
            const response = await fetch(`${API_BASE_URL}/check-user/${nombreLocal}`);
            return await response.json();
        } catch (error) {
            console.error('Error en checkUserExists:', error);
            return { exists: false };
        }
    },

    // Obtener datos del usuario desde la sesión
    async getUserData(): Promise<UserSessionData> {
        try {
            const response = await fetch(`${API_BASE_URL}/user-data`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('No hay sesión activa');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getUserData:', error);
            throw new Error('Error al obtener datos del usuario');
        }
    },

    // Cerrar sesión
    async logout(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            return { success: true, message: 'Sesión cerrada' };
        } catch (error) {
            console.error('Error en logout:', error);
            throw new Error('Error al cerrar sesión');
        }
    }
};