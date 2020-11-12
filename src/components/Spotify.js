import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

export { spotifyApi };

export const getAccessToken = () => fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: [
    `${encodeURIComponent('grant_type')}=${encodeURIComponent('client_credentials')}`
  ]
});