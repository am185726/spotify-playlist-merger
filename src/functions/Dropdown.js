import React, {useEffect, useState} from "react";
import axios from "axios";

/* Dropdown Creator!  */
const Dropdown = (props, newID) => {

//VARIABLES
    const PLAYLIST_ITEMS_ENDPOINT = "https://api.spotify.com/v1/playlists/"; 

    const [token, setToken] = useState("");

    // vars for dropdown hardcoded values + selections from dropdown
    const [selectedValue1, setSelectedValue1] = useState(''); //ID of first chosen playlist
    const [selectedValue2, setSelectedValue2] = useState(''); //ID of second chosen playlist 
    //const data1 = [
    //    {value: "2E7tWT6VlXQYo8TxS6CQ0d", name: 'June'},
    //    {value: "4EdSGQPhuEd9Nz54iCkfli", name: 'New York'},
    //    {value: "5ZKL8LQPVo3p7nFLGbd5Ws", name: 'Sweet California 72'}
    //]
    const data1 = []; //array values to fill first dropdown 
    const data2 = []; //array for values to fill second dropdown

    // vars for arrays of all songs in each selected playlist
    const [playlistItemsOne, setPlaylistItemsOne] = useState([]); 
    const [playlistItemsTwo, setPlaylistItemsTwo] = useState([]); 

    // this useEffect grabs the token from local storage to use to make API calls
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }, []); 

    // this useEffect makes a GET call to retrieve all songs on playlist 1 & adds array to local storage
    useEffect(() => {
        handleGetSongs1(selectedValue1);
        window.localStorage.setItem("playlistItemsOne", JSON.stringify(playlistItemsOne));
    }, [selectedValue1]);
    
    // this useEffect makes a GET call to retrieve all songs on playlist 2 & adds array to local storage
    useEffect(() => {
        handleGetSongs2(selectedValue2);
        window.localStorage.setItem("playlistItemsTwo", playlistItemsTwo);
    }, [selectedValue2]);
    
//FUNCTIONS
    /* This function removes the selected value on the first dropdown from the second dropdown. */
    const setData2 = () => {

        //for(let i = 0; i < props.options; i++){
            //data1.push(props.options[i]);
            //data2.push(props.options[i]);
        //}

        for(var i = 0; i < props.options.length; ++i)
            data2[i] = props.options[i];
        
        //console.log(props.options);
        //console.log(data2);

        //console.log(data2.indexOf(selectedValue1));
        //data2.splice(0, 1);

        for(let j = 0; j<data2; j++){
            console.log("doing for loop");
            if(data2[i].value === selectedValue1)
                console.log(j);
        }
    }

    /* Making the GET request for all the songs in playlist 1, adds to playlistItemsOne */
    const handleGetSongs1 = (ID) => {
        axios
        .get (`${PLAYLIST_ITEMS_ENDPOINT}${ID}/tracks?fields=items(track(id))`, {
          headers: {
              'Authorization': 'Bearer ' + token,
          },
          data: {
            fields: "items(track(id))",
            limit: 5
          }
        })
        .then ((res) => {
            setPlaylistItemsOne(JSON.stringify(res.data.items)); 
        })
        .catch((error) => {
          console.log(error);
        });

        props.changeWordOne(playlistItemsOne)
    }

    /* Making the GET request for all the songs in playlist 2, adds to playlistItemsTwo */
    const handleGetSongs2 = (ID) => {
        axios
        .get (`${PLAYLIST_ITEMS_ENDPOINT}${ID}/tracks?fields=items(track(id))`, {
          headers: {
              'Authorization': 'Bearer ' + token,
          }
        })
        .then ((res) => {
            setPlaylistItemsTwo(JSON.stringify(res.data.items)); 
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const handleNextStep = () => {
        props.changeWordOne(playlistItemsOne);
        props.changeWordTwo(playlistItemsTwo);
        props.changeBoolean(true);
    }

    setData2();

    return (
        <div >  
            <select onLoad={() => props.changeWordOne(playlistItemsOne)} value={selectedValue1} onChange={e => setSelectedValue1(e.target.value)}>
                {props.options.map((item, idx) => <option key={idx+1} value={item.value}> {item.name} </option>)}
            </select> 

            <select value={selectedValue2} onChange={e => setSelectedValue2(e.target.value)}>
                {data2.map((item, idx) => <option key={idx+1} value={item.value}> {item.name} </option>)}
            </select> 
            <button onClick={handleNextStep}>Next</button>
        </div>
    );
  }

  export default Dropdown; 
