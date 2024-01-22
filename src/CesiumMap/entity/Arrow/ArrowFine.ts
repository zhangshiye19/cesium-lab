import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import {Point} from "@/CesiumMap/entity/core/algorithm";
import * as pointconvert from '@/CesiumMap/entity/marsutils/pointconvert'
import CPolygon from "@/CesiumMap/entity/CPolygon";
import * as algorithm from '../core/algorithm'


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
        this.maxRequiredPointCount = 2;
        this.minRequiredPointCount = 2;

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }


    getGeometry(positions: Cesium.Cartesian3[]) {
        if(positions.length < this.minRequiredPointCount) {
            return []
        }
        //@ts-ignore
        let pnts:Point[] = pointconvert.cartesians2mercators(positions);

        let _ref = [pnts[0], pnts[1]],
            pnt1 = _ref[0],
            pnt2 = _ref[1];
        let len = algorithm.getBaseLength(pnts);
        let tailWidth = len * this.tailWidthFactor;
        let neckWidth = len * this.neckWidthFactor;
        let headWidth = len * this.headWidthFactor;
        let tailLeft = algorithm.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, true);
        let tailRight = algorithm.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, false);
        let headLeft = algorithm.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false);
        let headRight = algorithm.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true);
        let neckLeft = algorithm.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false);
        let neckRight = algorithm.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true);
        let pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight];

        return pointconvert.mercators2cartesians(pList);
    }
}
