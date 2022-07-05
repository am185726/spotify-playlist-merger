//import { useEffect, useState } from 'react';
import './App.css';
import Authorization from './functions/Authorization';

const App = () => {  

  const token = window.localStorage.getItem("token");

  return (
    <div className="App">
      <>
        <h1>Spotify Playlist Merger</h1>
        <Authorization />
      </>
    </div>
  );
}

export default App;
