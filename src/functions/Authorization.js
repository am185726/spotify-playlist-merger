import React, { useEffect, useState} from "react";
import PlaylistMaker from "./PlaylistMaker";
import axios from "axios";

const qs = require("qs");

/* This function is for OAuth 2.0 --
 * Authorization function 
 */ 
function Authorization () {

    const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const CLIENT_ID = "dffca2bee35a4ad0ba14c81893beeb2e";
    const CLIENT_SECRET = "821f6a53fa194b789fdb592c32739ba9";
    const REDIRECT_URL = "http://localhost:3000/callback"; //this is where we are redirected after login from Spotify page
    const RESPONSE_TYPE = "token";
    const SCOPES = ["playlist-read-collaborative", "playlist-modify-public", "playlist-modify-private", "playlist-read-private"];
    const SCOPES_URL_PARAM = SCOPES.join("%20"); //joining all scopes together, separated by %20


    const [token, setToken] = useState(""); 

    useEffect(() => {
        const hash = window.location.hash; 
        let token = window.localStorage.getItem("token");

        if(!token && hash) { //only parsing URL if we do not have a token AND have a hash 
            const hashOG = hash; 
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

            window.location.hash = ""; //setting hash back to empty string
            window.localStorage.setItem("token", token); //saving token in local storage 
        }
        setToken(token); //updating token state (local) 

        //this call gets a token that I will not use; just for attempting OAuth 
        getAuthToken(); 
    }, [])

// REDO-AUTH ATTEMPT CODE //

    /* GET REQUEST -- RETREIVE AUTH CODE */
    const getAuthCode = () => {
        axios
        .get ('https://accounts.spotify.com/login', {
            //headers: {"Access-Control-Allow-Origin": "*"}, 
            params: {
                client_id: CLIENT_ID,
                response_type: "code",
                redirect_uri: REDIRECT_URL
            }
        })
        .then ((res) => res)
        .catch((error) => {
          console.log(error);
        });

    }

    // CLIENT CREDENTIALS AUTH ATTEMPT: 

    /* POST REQUEST -- EXCHANGE AUTH CODE FOR ACCESS TOKEN */
    const getAuthToken = async () => {

        const headers = {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
              username: CLIENT_ID,
              password: CLIENT_SECRET,
            },
        };

        const data = {
            grant_type: "client_credentials",
          };

        try {
            const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            qs.stringify(data),
            headers
            );
        return response.data.access_token;
        } catch (err) {
            console.log(err);
        }
    };

 // END REDO-AUTH ATTEMPT CODE //


    /* Logout Function */
    const logout = () => {
        setToken(""); //clear token state
        window.localStorage.removeItem("token"); //removing token from local storage
    }

    return(
        <div className="Authorization">
            {!token ? 
                //<button onClick={getAuthToken}>Log in with Spotify</button>
                <a href={ `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES_URL_PARAM}&response_type=${RESPONSE_TYPE}&show_dialog=true`}>Login with Spotify</a>
                : <button onClick={logout}>Logout</button> 
            }
            {token ?
                    <PlaylistMaker />
                : ""
            }
        </div>
        
    );
};

export default Authorization; 

        /*
        return axios({
            method: 'POST', 
            url: `https://accounts.spotify.com/api/token`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET,
              },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        })
        .then((res) => {
            setToken(res.access_token);
        })  
        */