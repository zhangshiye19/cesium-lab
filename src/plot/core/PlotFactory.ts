import * as Cesium from 'cesium'
import CEntity from "@/CesiumMap/entity/CEntity";
import PlotType from "@/plot/core/PlotType";
import ArrowAttack from "@/CesiumMap/entity/ArrowAttack";
import PositionType from "@/CesiumMap/entity/PositionType";
import ArrowDouble from "@/CesiumMap/entity/ArrowDouble";
import ArrowFine from "@/CesiumMap/entity/ArrowFine";
import SquadCombat from "@/CesiumMap/entity/SquadCombat";
import StraightArrow from "@/CesiumMap/entity/StraightArrow";
import CPolyline from "@/CesiumMap/entity/CPolyline";
import {cartesian2point, Point} from "@/plot/utils/utils";
import CPolygon from "@/CesiumMap/entity/CPolygon";


// [
//   {
//     "type": "Feature",
//     "geometry": {
//       "type": "Polygon",
//       "coordinates": [
//         [
//
//           [
//             105.94861739256925,
//             32.46661416774336
//           ],
//           [
//             105.81165152399356,
//             32.58263364413328
//           ],
//           [
//             105.6734010485882,
//             32.69711933802854
//           ],
//           [
//             105.53388314117527,
//             32.81005702689991
//           ],
//         ]
//       ]
//     },
//     "properties": {
//       "type": "Sector",
//       "points": [
//         [
//           95.47107833932773,
//           20.236295629106483
//         ],
//         [
//           111.26603256037902,
//           17.09321794574894
//         ],
//         [
//           106.05409523085464,
//           34.081748775483646
//         ]
//       ]
//     }
//   }
// ]

export function getEntityFromType(plotType: PlotType, positions: Cesium.Cartesian3[],positionType?: PositionType) {
    let plottingEntity: CEntity | undefined;
    console.log(plotType)
    if (plotType === PlotType.AttackArrow) {
        plottingEntity = new ArrowAttack({
            coordinates: positions,
            positionType: positionType ?? PositionType.Constant
            // makeCallback: true
        })
        // this.plottingEntity = this.createPolygon(Cesium.Cartesian3.fromDegreesArray(positions.flat()))
    } else if (plotType === PlotType.DOUBLE_ARROW) {
        plottingEntity = new ArrowDouble({
            coordinates: positions,
            positionType: positionType ?? PositionType.Constant
            // makeCallback: true
        })
    } else if (plotType === PlotType.FINE_ARROW) {
        plottingEntity = new ArrowFine({
            coordinates: positions,
            positionType: positionType ?? PositionType.Constant
        })
    } else if (plotType === PlotType.SQUAD_COMBAT) {
        plottingEntity = new SquadCombat({
            coordinates: positions,
            positionType: positionType ?? PositionType.Constant
        })
    } else if (plotType === PlotType.STRAIGHT_ARROW) {
        plottingEntity = new StraightArrow({
            coordinates: positions,
            positionType: positionType ?? PositionType.Constant
        })
    } else if (plotType === PlotType.POLYLINE) {
        plottingEntity = new CPolyline({
            coordinates: positions,
            positionType: positionType ?? PositionType.Constant
        })
    }
    return plottingEntity;
}

export function loadEntityFromJsonObj(obj: any): CEntity | undefined {
    if (!obj.hasOwnProperty('properties') ||
        !obj.properties.hasOwnProperty("type") ||
        !obj.properties.hasOwnProperty('points')) {
        return;   //    没有值，无法转换
    }
    const points: Point[] = obj['properties']['points'];
    console.log(obj)
    return getEntityFromType(obj['properties']['type'], Cesium.Cartesian3.fromDegreesArray(points.flat()));
}

export function saveEntityToJsonObj(entity: CEntity) {
    const obj: any = {};
    obj['type'] = 'Feature';
    obj['geometry'] = {
        "type": entity.geometryType,
        "coordinates": entity.coordinatesReal.map(cartesian => cartesian2point(cartesian))
    }
    obj['properties'] = {
        "type": entity.plotType,
        "points": entity.coordinatesVirtual.map(cartesian => cartesian2point(cartesian))
    }

    return obj
}
