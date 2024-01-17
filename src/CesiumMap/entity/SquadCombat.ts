import {CEntityOption} from "./CEntity";
import * as Cesium from "cesium";
import ArrowAttack from "./ArrowAttack";
import PlotType from "./PlotType";
// import PositionType from "./PositionType";


export default class SquadCombat extends ArrowAttack {
    headHeightFactor = 0.18;
    headWidthFactor = 0.3;
    neckHeightFactor = 0.85;
    neckWidthFactor = 0.15;
    tailWidthFactor = 0.1;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.SQUAD_COMBAT;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        //
        // const anchorPoints = positions.map(value => {
        //     return PlotUtils.cartesian2point(value)
        // })
        // const geometry = this.getGeometry(anchorPoints).flat();
        // if (geometry.some(value => isNaN(value))) {
        //     return
        // }
        // this.coordinatesReal = Cesium.Cartesian3.fromDegreesArray(geometry)
    }


    // getGeometry(anchor_points: Point[]) {
    //     const count = anchor_points.length;
    //
    //     if(count === 0) {
    //         return []
    //     }
    //
    //     if (count === 1) {
    //         return new Array(2).fill(anchor_points[0]);
    //     //   return false;
    //       // eslint-disable-next-line no-else-return
    //     } else {
    //       const pnts = anchor_points;
    //       const tailPnts = this.getTailPoints(pnts);
    //       const headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[1]);
    //       if (headPnts && headPnts.length > 4) {
    //         const neckLeft = headPnts[0];
    //         const neckRight = headPnts[4];
    //         const bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor);
    //         // eslint-disable-next-line @typescript-eslint/no-shadow
    //         const count = bodyPnts.length;
    //         let leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2));
    //         leftPnts.push(neckLeft);
    //         let rightPnts = [tailPnts[1]].concat(bodyPnts.slice(count / 2, count));
    //         rightPnts.push(neckRight);
    //         leftPnts = PlotUtils.getQBSplinePoints(leftPnts);
    //         rightPnts = PlotUtils.getQBSplinePoints(rightPnts);
    //
    //         return leftPnts.concat(headPnts, rightPnts.reverse())
    //         // this.setCoordinates([leftPnts.concat(headPnts, rightPnts.reverse())]);
    //       }
    //     }
    //     return [];
    // }
    //
    // getTailPoints(points: Point[]) {
    //     const allLen = PlotUtils.getBaseLength(points);
    //     const tailWidth = allLen * this.tailWidthFactor;
    //     const tailLeft = PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, false);
    //     const tailRight = PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, true);
    //     return [tailLeft, tailRight];
    //   }
}
