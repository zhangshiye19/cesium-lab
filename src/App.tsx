import React, { useEffect } from 'react';
import './App.css';
import CesiumMap from './CesiumMap/CesiumMap';
import 'cesium/Source/Widgets/widgets.css';
import Toolbar from './pages/Toolbar';
import {loadEntityFromJsonObj, saveEntityToJsonObj} from "@/plot/core/PlotFactory";
import PlotDraw from "@/plot/core/PlotDraw";
import CEntity from "@/CesiumMap/entity/CEntity";

function App() {

  useEffect(()=>{
    CesiumMap.getInstance()

    doSomething()
  },[])

  const doSomething = () => {

    PlotDraw.getInstance().eventDrawEnd.addEventListener((entity: CEntity) => {
      console.log(entity)
      const obj = saveEntityToJsonObj(entity)
      localStorage.setItem('plotdrawtest',JSON.stringify([obj]))
    })

    const items = localStorage.getItem('plotdrawtest')
    if(items) {
      JSON.parse(items).forEach((obj: any) => {
        const entity = loadEntityFromJsonObj(obj);
        if(entity) {
          CesiumMap.getViewer().entities.add(entity)
        }
      })
    }

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
    <div id="cesium-container">
      <Toolbar />
    </div>
  );
}

export default App;
