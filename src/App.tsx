import React, { useEffect } from 'react';
import './App.css';
import CesiumMap from './CesiumMap/CesiumMap';
// import 'cesium/Build/Cesium/Widgets/'
import 'cesium/Source/Widgets/widgets.css';
import Toolbar from './pages/Toolbar';

function App() {

  useEffect(()=>{
    CesiumMap.getInstance()
  },[])

  return (
    <div id="cesium-container">
      <Toolbar />
    </div>
  );
}

export default App;
