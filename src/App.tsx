import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import CesiumMap from './CesiumMap/CesiumMap';
// import 'cesium/Build/Cesium/Widgets/'
import 'cesium/Source/Widgets/widgets.css'

function App() {

  useEffect(()=>{
    CesiumMap.getInstance()
  },[])

  return (
    <div id="cesium-container">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
