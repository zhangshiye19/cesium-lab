import React, { useEffect } from 'react';
import './App.css';
import CesiumMap from './CesiumMap/CesiumMap';
import 'cesium/Source/Widgets/widgets.css';
import Toolbar from './pages/Toolbar/toolbar';
import {loadEntityFromJsonObj, saveEntityToJsonObj} from "@/CesiumMap/plot/PlotFactory";
import PlotDraw from "@/CesiumMap/plot/PlotDraw";
import CEntity from "@/CesiumMap/entity/CEntity";

function App() {

  useEffect(()=>{
    // CesiumMap.getInstance()

    doSomething()
  },[])

  const doSomething = () => {

    const items = localStorage.getItem('plotdrawtest') ?? '[]'
    const objArray = JSON.parse(items)
    objArray.forEach((obj: any) => {
      const entity = loadEntityFromJsonObj(obj);
      if(entity) {
        CesiumMap.viewer.entities.add(entity)
      }
    })

    PlotDraw.getInstance().eventDrawEnd.addEventListener((entity: CEntity) => {
      const obj = saveEntityToJsonObj(entity)
      objArray.push(obj)
      localStorage.setItem('plotdrawtest',JSON.stringify(objArray))
    })


    // const viewer = CesiumMap.getViewer();
    // const attackArrowAnchorPoint:Point[] = [[114,21],[115,21],[114.6,25]]
    // const entity = new ArrowAttack({
    //   coordinates: Cesium.Cartesian3.fromDegreesArray(attackArrowAnchorPoint.flat())
    // });
    // viewer.entities.add(entity)
    // const resultPoints =
    // const resultPoints = DoubleArrow(attackArrowAnchorPoint)

    // viewer.entities.add({
    //   polygon: {
    //     hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(resultPoints.flat()))
    //   }
    // })
    //
    // resultPoints.forEach((value,index) => {
    //   const viewer = CesiumMap.getViewer()
    //   viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(...value),
    //     point: {
    //       pixelSize: 20,
    //       disableDepthTestDistance: Number.MAX_VALUE,
    //       color: Cesium.Color.RED
    //     },
    //     label: {
    //       text: `${index}`,
    //       pixelOffset: new Cesium.Cartesian2(50,0),
    //       disableDepthTestDistance: Number.MAX_VALUE
    //     }
    //   })
    // })

  }

  return (
    <div id="app-container">
      <Toolbar />
    </div>
  );
}

export default App;
