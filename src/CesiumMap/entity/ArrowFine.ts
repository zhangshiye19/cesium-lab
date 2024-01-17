import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as pointconvert from './util/pointconvert'
import * as Cesium from "cesium";
import CPolygon from "./CPolygon";
import PlotType from "@/CesiumMap/entity/PlotType";
import {plotUtil, Point} from "@/CesiumMap/entity/core/PlotUtil";


export default class ArrowFine extends CPolygon {
    tailWidthFactor = 0.1;
    neckWidthFactor = 0.2;
    headWidthFactor = 0.25;
    neckHeightFactor = 0.85;
    headAngle = Math.PI / 8.5;
    neckAngle = Math.PI / 13;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.FINE_ARROW;
        this.requirePointCount = 2;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }


    getGeometry(positions: Cesium.Cartesian3[]) {
        if(positions.length === 0) {
            return []
        }
        if(positions.length < 2) {
            return positions.concat(new Array(2 - positions.length).fill(positions[positions.length - 1]))
        }
        //@ts-ignore
        let pnts:Point[] = pointconvert.cartesians2mercators(positions);

        let _ref = [pnts[0], pnts[1]],
            pnt1 = _ref[0],
            pnt2 = _ref[1];
        let len = plotUtil.getBaseLength(pnts);
        let tailWidth = len * this.tailWidthFactor;
        let neckWidth = len * this.neckWidthFactor;
        let headWidth = len * this.headWidthFactor;
        let tailLeft = plotUtil.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, true);
        let tailRight = plotUtil.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, false);
        let headLeft = plotUtil.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false);
        let headRight = plotUtil.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true);
        let neckLeft = plotUtil.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false);
        let neckRight = plotUtil.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true);
        let pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight];

        return pointconvert.mercators2cartesians(pList);
    }
}
