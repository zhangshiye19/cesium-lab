import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as PlotUtils from "@/CesiumMap/entity/utils/utils";
import {Point} from "@/CesiumMap/entity/utils/utils";
import * as Constants from "@/CesiumMap/entity/utils/constant";
import * as Cesium from "cesium";
import CPolygon from "./CPolygon";
import PlotType from "@/CesiumMap/entity/PlotType";
// import PositionType from "./PositionType";


export default class ArrowFine extends CPolygon {
    tailWidthFactor = 0.1;
    neckWidthFactor = 0.2;
    headWidthFactor = 0.25;
    headAngle = Math.PI / 8.5;
    neckAngle = Math.PI / 13;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.FINE_ARROW;
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
        const cont = anchor_points.length;
        if(cont === 0) {
            return []
        }
        if (cont === 1) {
            return new Array(2).fill(anchor_points[0]);
        }
        const pnts = anchor_points;
        const [pnt1, pnt2] = [pnts[0], pnts[1]];
        const len = PlotUtils.getBaseLength(pnts);
        const tailWidth = len * this.tailWidthFactor;
        const neckWidth = len * this.neckWidthFactor;
        const headWidth = len * this.headWidthFactor;
        const tailLeft = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, true);
        const tailRight = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, false);
        const headLeft = PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false);
        const headRight = PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true);
        const neckLeft = PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false);
        const neckRight = PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true);
        return [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight]
    }
}
