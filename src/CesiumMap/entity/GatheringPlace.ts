import {CEntityOption} from "./CEntity";
import * as pointconvert from './util/pointconvert'
import * as Cesium from "cesium";
import CPolygon from "./CPolygon";
import PlotType from "./PlotType";
import {Point} from "./core/PlotUtils";
import * as plotUtil from './core/PlotUtils'


export default class GatheringPlace extends CPolygon {
    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.GATHERING_PLACE;
        this.requirePointCount = 3;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]) {
        if (positions.length < 3) {
            return []
        }
        //@ts-ignore
        let pnts: Point[] = pointconvert.cartesians2mercators(positions);

        let mid = plotUtil.Mid(pnts[0], pnts[2]);
        pnts.push(mid, pnts[0], pnts[1]);
        let normals: any[] = [],
            pnt1 = undefined,
            pnt2 = undefined,
            pnt3 = undefined,
            pList = [];
        for (let i = 0; i < pnts.length - 2; i++) {
            pnt1 = pnts[i];
            pnt2 = pnts[i + 1];
            pnt3 = pnts[i + 2];
            let normalPoints = plotUtil.getBisectorNormals(0.4, pnt1, pnt2, pnt3);
            normals = normals.concat(normalPoints);
        }
        let count = normals.length;
        normals = [normals[count - 1]].concat(normals.slice(0, count - 1));
        for (let _i = 0; _i < pnts.length - 2; _i++) {
            pnt1 = pnts[_i];
            pnt2 = pnts[_i + 1];
            pList.push(pnt1);
            for (let t = 0; t <= 100; t++) {
                let _pnt = plotUtil.getCubicValue(
                    t / 100,
                    pnt1,
                    normals[_i * 2],
                    normals[_i * 2 + 1],
                    pnt2
                );
                pList.push(_pnt);
            }
            pList.push(pnt2);
        }

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }
}
