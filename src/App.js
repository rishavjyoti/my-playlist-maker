import React, {useState, useEffect} from 'react'
import {Credentials} from './Credentials'
import Dropdown from './Dropdown'
import axios from 'axios'
import Drag from './Dnd'

//Material ui
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
//Theme 
import {MuiThemeProvider,createMuiTheme} from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
   "fontFamily": `"Montserrat", "Roboto", sans-serif`,
  }
});

const App = () => {

  const spotify = Credentials();

  console.log('REDIRECTING APP')

  const [token, setToken] = useState('');  
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});

  useEffect(() => {
    
    axios('https://accounts.spotify.com/api/token', {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
    },
    data: 'grant_type=client_credentials',
    method: 'POST',
    })
    .then(tokenResponse => {
      console.log(tokenResponse.data.access_token);
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreResponse.data.categories.items
        })
      });

    })

  }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]);

  const genreChanged = val => {
    setGenres({
      selectedGenre: val, 
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then(playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
    });
  }

  const playlistChanged = val => {
    console.log(val);
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });
  }

  return (
    <MuiThemeProvider theme={theme}>
    <React.Fragment>
    <CssBaseline />
      <Container maxWidth="sm" style={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Personalized Playlists for spotify
        </Typography>
        <Dropdown label="Genre :" options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged}/>  
        <Drag list={playlist.listOfPlaylistFromAPI}/>
      </Container>
    </React.Fragment>
    </MuiThemeProvider>
  );
}

export default App;
