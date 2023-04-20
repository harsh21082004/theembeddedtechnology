$(document).ready(function(){
    $(".kite-menu").kiteMenu();
    });
    const clientId = '599ab1fde207493aac214ed842b26fd3';
    const clientSecret ='ce8e0e204d4b495fab0297d5168b2614';
    const authUrl = 'https://accounts.spotify.com/api/token';
    const apiUrl = 'https://api.spotify.com/v1/search?type=track&q=';

    let token = null;

    async function getToken() {
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
      });
      const data = await response.json();
      return data.access_token;
    }

    async function searchSong(event) {
      event.preventDefault();

      if (!token) {
        token = await getToken();
      }

      const query = document.getElementById('search-query').value;
      const response = await fetch(apiUrl + encodeURIComponent(query), {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await response.json();

      if (!data.tracks || data.tracks.items.length === 0) {
        throw new Error('No tracks found for query ' + query);
      }

      const track = data.tracks.items[0];
      const title = document.getElementById('song-title');
      const artist = document.getElementById('song-artist');
      const image = document.getElementById('song-image');
      const player = document.getElementById('player');

      title.innerText = track.name;
      artist.innerText = track.artists[0].name;
      image.src = track.album.images[1].url;
      player.src = track.preview_url;
    }