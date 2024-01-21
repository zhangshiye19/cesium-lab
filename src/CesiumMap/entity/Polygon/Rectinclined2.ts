import {CEntityOption} from "../CEntity";
import * as Cesium from "cesium";
import PlotType from "../PlotType";
import {Point} from "../core/algorithm";
import {cartesians2mercators, mercators2cartesians} from '@/CesiumMap/entity/marsutils/pointconvert'
import CPolygon from "../CPolygon";

export default class Rectinclined2 extends CPolygon {

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.RECTINCLINED2;
        this.requirePointCount = 3;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]) {
        if (positions.length < 2) {
            return [];
        }
        if (positions.length === 2) {
            return positions
        }
        //@ts-ignore
        const pnts: Point[] = cartesians2mercators(positions);
        const [pnt1, pnt2, mouse] = [pnts[0], pnts[1], pnts[2]];
        const intersect = this.calculateIntersectionPoint(pnt1, pnt2, mouse);
        const pnt4 = this.calculateFourthPoint(pnt1, intersect, mouse);
        const pList: Point[] = [];
        pList.push(pnt1, intersect, mouse, pnt4, pnt1);
        return mercators2cartesians(pList)
    }

    /**
     * 已知p1，p2，p3点求矩形的p4点
     * @param {*} p1
     * @param {*} p2
     * @param {*} p3
     */
    calculateFourthPoint(p1: Point, p2: Point, p3: Point): Point {
        const x = p1[0] + p3[0] - p2[0];
        const y = p1[1] + p3[1] - p2[1];
        return [x, y];
    }

    /**
     * 已知p1点和p2点，求p3点到p1p2垂线的交点
     * @param {*} p1
     * @param {*} p2
     * @param {*} p3
     */
    calculateIntersectionPoint(p1: Point, p2: Point, p3: Point): Point {
        const v = {
            x: p2[0] - p1[0],
            y: p2[1] - p1[1],
        };
        const u = {
            x: p3[0] - p1[0],
            y: p3[1] - p1[1],
        };
        const projectionLength = (u.x * v.x + u.y * v.y) / (v.x * v.x + v.y * v.y);
        const intersectionPoint: { x: number; y: number } = {
            x: p1[0] + v.x * projectionLength,
            y: p1[1] + v.y * projectionLength,
        };
        return [intersectionPoint.x, intersectionPoint.y];
    }

}
