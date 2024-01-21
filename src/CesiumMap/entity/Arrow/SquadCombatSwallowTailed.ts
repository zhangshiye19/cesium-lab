import ArrowAttack from "@/CesiumMap/entity/Arrow/ArrowAttack";
import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import { Point} from "@/CesiumMap/entity/core/algorithm";
import * as pointconvert from '@/CesiumMap/entity/marsutils/pointconvert'
import * as algorithm from '../core/algorithm'


export default class SquadCombatSwallowTailed extends ArrowAttack {
    headHeightFactor = 0.18;
    headWidthFactor = 0.3;
    neckHeightFactor = 0.85;
    neckWidthFactor = 0.15;
    tailWidthFactor = 0.1;
    swallowTailFactor = 1;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.TAILED_SQUAD_COMBAT;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        if (positions.length < 2) return []

        //@ts-ignore
        const pnts: Point[] = pointconvert.cartesians2mercators(positions);
        const tailPnts = this.getTailPoints(pnts);
        const headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[2]);
        if (headPnts && headPnts.length > 4) {
            const neckLeft = headPnts[0];
            const neckRight = headPnts[4];
            const bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const count = bodyPnts.length;
            let leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2));
            leftPnts.push(neckLeft);
            let rightPnts = [tailPnts[2]].concat(bodyPnts.slice(count / 2, count));
            rightPnts.push(neckRight);
            leftPnts = algorithm.getQBSplinePoints(leftPnts);
            rightPnts = algorithm.getQBSplinePoints(rightPnts);
            const pList = leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]]);
            return pointconvert.mercators2cartesians(pList)
        }

        return []
    }

    getTailPoints(points: Point[]) {
        const allLen = algorithm.getBaseLength(points);
        const tailWidth = allLen * this.tailWidthFactor;
        const tailLeft = algorithm.getThirdPoint(points[1], points[0], Math.PI / 2, tailWidth, false);
        const tailRight = algorithm.getThirdPoint(points[1], points[0], Math.PI / 2, tailWidth, true);
        const len = tailWidth * this.swallowTailFactor;
        const swallowTailPnt = algorithm.getThirdPoint(points[1], points[0], 0, len, true);
        return [tailLeft, swallowTailPnt, tailRight];
    }
}
