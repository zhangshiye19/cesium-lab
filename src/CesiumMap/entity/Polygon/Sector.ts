


import {CEntityOption} from "../CEntity";
import * as Cesium from "cesium";
import PlotType from "../PlotType";
import { Point} from "../core/algorithm";
import * as pointconvert from '@/CesiumMap/entity/marsutils/pointconvert'
import CPolygon from "../CPolygon";
import * as algorithm from '../core/algorithm'

export default class Sector extends CPolygon {

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.SECTOR;
        this.requirePointCount = 3;

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]) {
        if(positions.length < 3) {
            return []
        }

        //@ts-ignore
        let pnts:Point[] = pointconvert.cartesians2mercators(positions);
        let center = pnts[0],
            pnt2 = pnts[1],
            pnt3 = pnts[2];
        let radius = algorithm.MathDistance(pnt2, center);
        let startAngle = algorithm.getAzimuth(pnt2, center);
        let endAngle = algorithm.getAzimuth(pnt3, center);
        let pList = algorithm.getArcPoints(center, radius, startAngle, endAngle);
        pList.push(center, pList[0]);

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }

}
