import { gapi } from 'gapi-script';
import { initDarkMode } from './dark-mode.js';

// Types for events (you can expand this based on your needs)
interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

// Google API configuration
const CLIENT_ID = '<TON_CLIENT_ID>'; // Remplace avec ton Client ID
const API_KEY = '<TA_CLE_API>'; // Remplace avec ta clé API
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'; // Scopes pour accéder au calendrier

/**
 * Initialise la bibliothèque Google API.
 */
export const initGoogleAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: SCOPES,
        });
        resolve();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'API Google', error);
        reject(error);
      }
    });
  });
};

/**
 * Vérifie si l'utilisateur est connecté à Google.
 */
export const isSignedIn = (): boolean => {
  const authInstance = gapi.auth2.getAuthInstance();
  return authInstance.isSignedIn.get();
};

/**
 * Connecte l'utilisateur à Google.
 */
export const signIn = async (): Promise<void> => {
  try {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    console.log('Connecté avec succès à Google');
  } catch (error) {
    console.error('Erreur lors de la connexion à Google', error);
  }
};

/**
 * Déconnecte l'utilisateur de Google.
 */
export const signOut = (): void => {
  const authInstance = gapi.auth2.getAuthInstance();
  authInstance.signOut();
  console.log('Déconnecté de Google');
};

initDarkMode();