import React, {useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "./Dropdown";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=50";
const PLAYLIST_ITEMS_ENDPOINT = "https://api.spotify.com/v1/playlists/"; 

//const MAKE_PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/users/nikington/playlists';
let amMakingNewPlaylist = false; 
let hasMadeNewPlaylist = false; 


//vars for testing add songs to new playlist 
const TRACKS = ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M", "spotify:track:7EEefVBNBS3ckwouEl62oB"];

var obj = [{
    "track": {"id": "4iV5W9uYEdYUVa79Axb7Rh"}
  }, {
    "track": {"id": "1301WleyT98MSxVHPZCA6M"}
  }]

const wordArr = []; 
const formattedTracks = [];
const formattedPlaylistArr = []; 
 

/* This function renders the "Make a Merged Playlist" button and
 * makes a GET request to access all user's playlist. 
 * (also will fill 2 dropdowns with all user's playists and allow them to select 2)
 */
const PlaylistMaker = () => {

    //const token = window.localStorage.getItem("token");
    const [token, setToken] = useState("");
    const [playlist, setPlaylists] = useState([]); //used for capturing all playlists
    const [playlistIDs, setPlaylistIDs] = useState([]); 
    const [playlistName, setPlaylistName] = useState('');
    const [newPlaylistID, setNewPlaylistID] = useState(""); //ID of new merge playlist created 

    //info from dropdown file 
    const [selectedValue1, setSelectedValue1] = useState('');
    const [selectedValue2, setSelectedValue2] = useState('');

    //info retrieved from dropdown file -- lists of songs
    const [word, setWord] = useState("word"); //testing retrieving var from child component 
    const [wordTwo, setWordTwo] = useState("word two"); 
    const [playlistItemsOne, setPlaylistItemsOne] = useState([]); 
    const [playlistItemsTwo, setPlaylistItemsTwo] = useState([]);
    const [hasChosenPlaylists, setHasChosenPlaylists] = useState(false); 

    let uniqTracks = [];


    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }, []); 

    /* Making the POST request to create a new playlist 
    *   https://api.spotify.com/v1/users/{user_id}/playlists
    */
    const handleMakePlaylist = async (e) => {   
        
        hasMadeNewPlaylist = !hasMadeNewPlaylist; 
        e.preventDefault(); 

        return axios({
            method: 'POST', 
            url: `https://api.spotify.com/v1/me/playlists`,
            data: {
                "name": playlistName, 
                "description": "New description", 
                "public": true
            },
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((res) => {
            setNewPlaylistID(res.data.id);
            window.localStorage.setItem("newPlaylistID", newPlaylistID); //saving token in local storage 
        })   
        .catch((error) => {
            console.log(error);
          });
        
    }

    /* Making the GET request for all user's playlists */
    const handleGetPlaylists = () => {

        //e.preventDefault(); 

        axios
        .get (PLAYLISTS_ENDPOINT, {
          headers: {
              'Authorization': 'Bearer ' + token
          },
        })
        .then (playlistResponse => {

            //building final playlist arr -- makes array with key=id and value=name of each playlist
            for(let i = 0; i<playlistResponse.data.items.length; i++){
                const playlistObj = {value: playlistResponse.data.items[i].id, name: playlistResponse.data.items[i].name}
                formattedPlaylistArr.push(playlistObj); 
            }
            setPlaylists(playlistResponse.data.items);
        })
        .catch((error) => {
          console.log(error);
        });
        amMakingNewPlaylist = !amMakingNewPlaylist;
    };

    //TESTING --- ADD ONE SONG TO A PLAYLIST

    const addSongs = () => {

        return axios({
            method: 'POST', 
            url: `${PLAYLIST_ITEMS_ENDPOINT}${newPlaylistID}/tracks`,
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            data: {
                "uris": uniqTracks
            }
        })
        .then((res) => res)   
        .catch((error) => {
            console.log(error);
        });
    }

    //REFORMATTING TRACKS ARRAYS
    const formatSongs = () => {

        //turning list of tracks from string -> obj -> arr
        var trackObj = JSON.parse(word); 
        for(var i in trackObj)
            wordArr.push(trackObj[i]); 

        var trackObj2 = JSON.parse(wordTwo); 
        for(var j in trackObj2)
            wordArr.push(trackObj2[j]); 
        
        wordArr.forEach(function(item) {
            Object.keys(item).forEach(function(key) {
              formattedTracks.push("spotify:track:"+item[key].id);
            });
        });

    //removing duplicates from final array of tracks
    uniqTracks = [...formattedTracks.reduce((map, obj) => map.set(obj, obj), new Map()).values()];
    }    

    const createFinalPlaylist = () => {
        // format the songs 
        formatSongs(); 
        // add songs to new playlist 
        addSongs();
    }

    return(
        <div>
            {token ? 
                <button onClick={handleGetPlaylists}>Make a Merged Playlist</button>
                : ""
            }

            {amMakingNewPlaylist ?
                <>
                    <p>1. Choose two playlists you would like to merge: </p>
                    <Dropdown 
                        changeWordOne={word => setWord(word)}
                        changeWordTwo={wordTwo => setWordTwo(wordTwo)}
                        changeBoolean={hasChosenPlaylists => setHasChosenPlaylists(hasChosenPlaylists)}
                        options={formattedPlaylistArr} 
                        newID={newPlaylistID}/> 
                </>
                : ""
            }  

            {hasChosenPlaylists ?
                <>
                    <p>2. Create a name for your new playlist: </p>
                    <form>
                        <input 
                            type="text" 
                            required
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                        />
                        <button onClick={handleMakePlaylist}>Next</button>
                    </form>

                </>
                : ""
            }

            {hasMadeNewPlaylist ?
                <button onClick={createFinalPlaylist}>Create playlist!</button>
                : ""
            }
        </div>
    );
};

export default PlaylistMaker;

