import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const scope = process.env.REACT_APP_SPOTIFY_SCOPE;
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

export { spotifyApi };

const createHeaders = () => {
  return {
    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
}

export const getTokenByAuthCode = (code) => {
  const body = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
  };

  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: createHeaders(),
    body: Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&')
  });
}

export const refreshAccessByRefresh = (refreshToken) => {
  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  };
  
  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: createHeaders(),
    body: Object.keys(body).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&')
  });
}

export const redirectToLogin = () => window.location.href = 'https://accounts.spotify.com/authorize'
                                                            + '?response_type=code'
                                                            + `&client_id=${encodeURIComponent(clientId)}`
                                                            + `&scope=${encodeURIComponent(scope)}`
                                                            + `&redirect_uri=${encodeURIComponent(redirectUri)}`;