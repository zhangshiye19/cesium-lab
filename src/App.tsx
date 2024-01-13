import React, { useEffect } from 'react';
import './App.css';
import CesiumMap from './CesiumMap/CesiumMap';
// import 'cesium/Build/Cesium/Widgets/'
import 'cesium/Source/Widgets/widgets.css';
import Toolbar from './pages/Toolbar';
import AttackArrow from "@/plot/geometry/arrow/AttackArrow";
import DoubleArrow from "@/plot/geometry/arrow/DoubleArrow";
import {Point} from "@/plot/utils/utils";
import * as Cesium from "cesium";

function App() {

  useEffect(()=>{
    CesiumMap.getInstance()

    doSomething()
  },[])

  const doSomething = () => {
    const viewer = CesiumMap.getViewer();
    const attackArrowAnchorPoint:Point[] = [[114,21],[115,21],[114.6,25]]
    const resultPoints = DoubleArrow(attackArrowAnchorPoint)

    viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(resultPoints.flat()))
      }
    })

    resultPoints.forEach((value,index) => {
      const viewer = CesiumMap.getViewer()
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(...value),
        point: {
          pixelSize: 20,
          disableDepthTestDistance: Number.MAX_VALUE,
          color: Cesium.Color.RED
        },
        label: {
          text: `${index}`,
          pixelOffset: new Cesium.Cartesian2(50,0),
          disableDepthTestDistance: Number.MAX_VALUE
        }
      })
    })

  }

  return (
    <div id="cesium-container">
      <Toolbar />
    </div>
  );
}

export default App;
