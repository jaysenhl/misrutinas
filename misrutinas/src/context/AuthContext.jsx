import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  GetUserCommand,
  UpdateUserAttributesCommand
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from 'crypto-js';
import Swal from 'sweetalert2';

// Configuración del cliente de Cognito
const client = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

const AuthContext = createContext(null);

const calculateSecretHash = (username) => {
  const message = username + "77cmamtejg1g0jcqvshipe519u";
  const hash = crypto.HmacSHA256(message, "g8tskjnhn4j0ee3e4i37cm54ev30ibbdlmitno4hcmj8oom6eah");
  return crypto.enc.Base64.stringify(hash);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkSession();
    startSessionTimeout();
  }, []);

  const startSessionTimeout = () => {
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    setTimeout(() => {
      logout();
      Swal.fire({
        icon: 'info',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado por inactividad'
      });
    }, TWO_HOURS);
  };

  const checkSession = () => {
    const token = sessionStorage.getItem('accessToken');
    const savedUsername = sessionStorage.getItem('username');
    if (token) {
      setIsAuthenticated(true);
      if (savedUsername) {
        setUser({ username: savedUsername });
      }
      startSessionTimeout();
    }
    setIsLoading(false);
  };

  const handleNewPasswordChallenge = async (email, currentPassword, newPassword, session) => {
    try {
      const command = new RespondToAuthChallengeCommand({
        ClientId: "77cmamtejg1g0jcqvshipe519u",
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        Session: session,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: newPassword,
          SECRET_HASH: calculateSecretHash(email)
        }
      });

      const response = await client.send(command);
      
      if (response.AuthenticationResult) {
        const { AccessToken, IdToken } = response.AuthenticationResult;
        sessionStorage.setItem('accessToken', AccessToken);
        sessionStorage.setItem('idToken', IdToken);
        setIsAuthenticated(true);
        startSessionTimeout();
        return response;
      }
    } catch (error) {
      console.error('Error en cambio de contraseña:', error);
      throw error;
    }
  };

  const updateUserSessionToken = async (accessToken) => {
    try {
      const command = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: [
          {
            Name: 'custom:sessionToken',
            Value: accessToken
          }
        ]
      });

      await client.send(command);
    } catch (error) {
      console.error('Error actualizando token de sesión:', error);
      throw new Error('ACTIVE_SESSION_EXISTS');
    }
  };

  const checkActiveSession = async (accessToken) => {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken
      });

      const response = await client.send(command);
      const sessionAttribute = response.UserAttributes.find(
        attr => attr.Name === 'custom:sessionToken'
      );

      if (sessionAttribute && sessionAttribute.Value && sessionAttribute.Value !== accessToken) {
        throw new Error('ACTIVE_SESSION_EXISTS');
      }
    } catch (error) {
      console.error('Error verificando sesión activa:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: "77cmamtejg1g0jcqvshipe519u",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: calculateSecretHash(email)
        },
      });

      const response = await client.send(command);
      
      if (response.AuthenticationResult) {
        const { AccessToken, IdToken } = response.AuthenticationResult;
        
        try {
          // Verificar si hay una sesión activa
          await checkActiveSession(AccessToken);
          // Actualizar el token de sesión
          await updateUserSessionToken(AccessToken);
          
          sessionStorage.setItem('accessToken', AccessToken);
          sessionStorage.setItem('idToken', IdToken);
          const username = email.split('@')[0];
          setUser({ username });
          sessionStorage.setItem('username', username);
          setIsAuthenticated(true);
          startSessionTimeout();
          return response;
        } catch (error) {
          if (error.message === 'ACTIVE_SESSION_EXISTS') {
            Swal.fire({
              icon: 'error',
              title: 'Sesión activa',
              text: 'Ya existe una sesión activa en otro dispositivo. Cierra la sesión anterior para continuar.'
            });
            throw error;
          }
          throw error;
        }
      } else if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        // Mostrar modal para cambio de contraseña
        const { value: newPassword } = await Swal.fire({
          title: 'Cambio de contraseña requerido',
          input: 'password',
          inputLabel: 'Nueva contraseña',
          inputPlaceholder: 'Ingresa tu nueva contraseña',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Debes ingresar una contraseña';
            }
          }
        });

        if (newPassword) {
          return await handleNewPasswordChallenge(email, password, newPassword, response.Session);
        } else {
          throw new Error('Se requiere cambiar la contraseña');
        }
      } else {
        console.error('Respuesta inesperada:', response);
        throw new Error('Respuesta de autenticación inválida');
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (error.message !== 'ACTIVE_SESSION_EXISTS') {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: error.message || 'El email o la contraseña son incorrectos'
        });
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        // Limpiar el token de sesión al hacer logout
        await updateUserSessionToken('');
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('idToken');
      sessionStorage.removeItem('username');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 