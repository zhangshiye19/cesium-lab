


import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as Cesium from "cesium";
import PlotType from "@/CesiumMap/entity/PlotType";
import {plotUtil, Point} from "@/CesiumMap/entity/core/PlotUtil";
import * as pointconvert from './util/pointconvert'
import CPolygon from "@/CesiumMap/entity/CPolygon";


export default class Sector extends CPolygon {

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.SECTOR;
        this.requirePointCount = 3;
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
        let center = pnts[0],
            pnt2 = pnts[1],
            pnt3 = pnts[2];
        let radius = plotUtil.MathDistance(pnt2, center);
        let startAngle = plotUtil.getAzimuth(pnt2, center);
        let endAngle = plotUtil.getAzimuth(pnt3, center);
        let pList = plotUtil.getArcPoints(center, radius, startAngle, endAngle);
        pList.push(center, pList[0]);

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }

}
