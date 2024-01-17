import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as pointconvert from './util/pointconvert'
import * as Cesium from "cesium";
import CPolygon from "./CPolygon";
import PlotType from "@/CesiumMap/entity/PlotType";
import {plotUtil, Point} from "@/CesiumMap/entity/core/PlotUtil";


export default class CloseCurve extends CPolygon {
    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.CLOSED_CURVE;
        this.requirePointCount = Infinity;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }


    getGeometry(positions: Cesium.Cartesian3[]) {
        if(positions.length === 0) {
            return []
        }
        if(positions.length < 3) {
            return positions.concat(new Array(3 - positions.length).fill(positions[positions.length - 1]))
        }
        //@ts-ignore
        let pnts:Point[] = pointconvert.cartesians2mercators(positions);
        pnts.push(pnts[0], pnts[1]);

        let normals:any[] = [];
        let pList = [];
        for (let i = 0; i < pnts.length - 2; i++) {
            let normalPoints = plotUtil.getBisectorNormals(0.3, pnts[i], pnts[i + 1], pnts[i + 2]);
            normals = normals.concat(normalPoints);
        }
        let count = normals.length;
        normals = [normals[count - 1]].concat(normals.slice(0, count - 1));
        for (let _i = 0; _i < pnts.length - 2; _i++) {
            let pnt1 = pnts[_i];
            let pnt2 = pnts[_i + 1];
            pList.push(pnt1);
            for (let t = 0; t <= 100; t++) {
                let pnt = plotUtil.getCubicValue(
                    t / 100,
                    pnt1,
                    normals[_i * 2],
                    normals[_i * 2 + 1],
                    pnt2
                );
                pList.push(pnt);
            }
            pList.push(pnt2);
        }

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }
}
