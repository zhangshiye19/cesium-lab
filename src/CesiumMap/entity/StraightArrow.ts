import CEntity, {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as PlotUtils from "@/CesiumMap/entity/utils/utils";
import {Point} from "@/CesiumMap/entity/utils/utils";
import * as Cesium from "cesium";
import CPolyline from './CPolyline';
import PlotType from "@/CesiumMap/entity/PlotType";
// import PositionType from "./PositionType";


export default class StraightArrow extends CPolyline {
    fixPointCount = 2;
    maxArrowLength = 3000000;
    arrowLengthScale = 5;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.STRAIGHT_ARROW;
        this.requirePointCount = 2;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);

        const anchorPoints = positions.map(value => {
            return PlotUtils.cartesian2point(value)
        })
        const geometry = this.getGeometry(anchorPoints).flat();
        if (geometry.some(value => isNaN(value))) {
            return
        }
        this.coordinatesReal = Cesium.Cartesian3.fromDegreesArray(geometry)
    }


    getGeometry(anchor_points: Point[]) {
        const count = anchor_points.length;
        if(count === 0) {
            return []
        }
        if(count === 1) {
            return new Array(2).fill(anchor_points[0])
        }
        const pnts = anchor_points;
        const [pnt1, pnt2] = [pnts[0], pnts[1]];
        const distance = PlotUtils.MathDistance(pnt1, pnt2);
        let len = distance / this.arrowLengthScale;
        len = len > this.maxArrowLength ? this.maxArrowLength : len;
        const leftPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false);
        const rightPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true);
        // this.setCoordinates([pnt1, pnt2, leftPnt, pnt2, rightPnt]);
        return [pnt1, pnt2, leftPnt, pnt2, rightPnt];
    }
}
