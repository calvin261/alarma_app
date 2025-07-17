import { UserInterface } from './UserInterface';
import { UserCredentials } from './UserCredentials';

import { UserSessionData } from './UserSessionData';

export interface UserContextValue {
  user: UserSessionData | null;
  loading: boolean;
  registrationLoading: boolean;
  error: string | null;
  registerUser: (userData: UserInterface) => Promise<{ success: boolean; message: string }>;
  loginUser: (credentials: UserCredentials) => Promise<{ success: boolean; message: string }>;
  updateUser: (newData: Partial<UserInterface>) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
  clearUser: () => Promise<void>;
  isUserRegistered: () => boolean;
  checkUserData: () => Promise<void>;
  checkLocalExists: (nombreLocal: string) => Promise<boolean>;
  clearError: () => void;
}
