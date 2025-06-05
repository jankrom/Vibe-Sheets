import { SERVER_URL } from './web-app';

export function getAuthToken() {
  const token = PropertiesService.getUserProperties().getProperty(
    'VIBE_SHEETS_AUTH_TOKEN_KEY'
  );
  if (!token) {
    throw new Error(
      'Authentication token is missing. Please authenticate first.'
    );
  }
  return token;
}

export function isValidAuthToken(token: string): boolean {
  try {
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const response = UrlFetchApp.fetch(SERVER_URL + '/api/validate-token', {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.getResponseCode() !== 200) {
      throw new Error('Invalid authentication token.');
    }
  } catch (error) {
    return false;
  }

  return true;
}

export function updateAuthToken(token: string) {
  if (!token) {
    throw new Error('Missing auth token.');
  }
  PropertiesService.getUserProperties().setProperty(
    'VIBE_SHEETS_AUTH_TOKEN_KEY',
    token
  );
  return 'Auth token updated successfully.';
}
