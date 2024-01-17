import * as Cesium from 'cesium'
import CEntity from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import ArrowAttack from "@/CesiumMap/entity/ArrowAttack";
import PositionType from "@/CesiumMap/entity/PositionType";
import ArrowDouble from "@/CesiumMap/entity/ArrowDouble";
import ArrowFine from "@/CesiumMap/entity/ArrowFine";
import SquadCombat from "@/CesiumMap/entity/SquadCombat";
import StraightArrow from "@/CesiumMap/entity/StraightArrow";
import CPolyline from "@/CesiumMap/entity/CPolyline";
import GatheringPlace from "@/CesiumMap/entity/GatheringPlace";
import CloseCurve from "@/CesiumMap/entity/CloseCurve";
import {cartesians2lonlats} from "@/CesiumMap/entity/util/pointconvert";
import {type Point} from "@/CesiumMap/entity/core/PlotUtil";

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

export function getEntityFromType(plotType: PlotType, positions: Cesium.Cartesian3[],positionType?: PositionType,positionsReal?: Cesium.Cartesian3[]) {
    let plottingEntity: CEntity | undefined;
    // console.log(plotType)
    const options = {
        coordinates: positions,
        positionType: positionType ?? PositionType.Constant,
        coordinatesR: positionsReal
        // makeCallback: true
    }
    if (plotType === PlotType.AttackArrow) {
        plottingEntity = new ArrowAttack(options)
        // this.plottingEntity = this.createPolygon(Cesium.Cartesian3.fromDegreesArray(positions.flat()))
    } else if (plotType === PlotType.DOUBLE_ARROW) {
        plottingEntity = new ArrowDouble(options)
    } else if (plotType === PlotType.FINE_ARROW) {
        plottingEntity = new ArrowFine({
            coordinates: positions,
            positionType: positionType ?? PositionType.Constant,
            coordinatesR: positionsReal
        })
    } else if (plotType === PlotType.SQUAD_COMBAT) {
        plottingEntity = new SquadCombat(options)
    } else if (plotType === PlotType.STRAIGHT_ARROW) {
        plottingEntity = new StraightArrow({
            coordinates: positions,
            positionType: positionType ?? PositionType.Constant,
            coordinatesR: positionsReal
        })
    } else if (plotType === PlotType.POLYLINE) {
        plottingEntity = new CPolyline(options)
    }else if (plotType === PlotType.GATHERING_PLACE) {
        plottingEntity = new GatheringPlace(options)
    }else if(plotType === PlotType.CLOSED_CURVE) {
        plottingEntity = new CloseCurve(options)
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
    const pointsR: Point[] = obj['geometry']['coordinates'];
    return getEntityFromType(obj['properties']['type'],
        Cesium.Cartesian3.fromDegreesArray(points.flat()),
        PositionType.Callback,
        Cesium.Cartesian3.fromDegreesArray(pointsR.flat()));
}

export function saveEntityToJsonObj(entity: CEntity) {
    const obj: any = {};
    obj['type'] = 'Feature';

    obj['geometry'] = {
        "type": entity.geometryType,
        "coordinates": cartesians2lonlats(entity.coordinatesReal)
    }
    obj['properties'] = {
        "type": entity.plotType,
        "points": cartesians2lonlats(entity.coordinatesVirtual)
    }

    return obj
}
