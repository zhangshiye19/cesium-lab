import CEntity, {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as PlotUtils from "@/plot/utils/utils";
import {Point} from "@/plot/utils/utils";
import * as Constants from "@/plot/utils/constant";
import * as Cesium from "cesium";
// import PositionType from "./PositionType";


export default class ArrowAttack extends CEntity {
    headHeightFactor = 0.18;
    headWidthFactor = 0.3;
    neckHeightFactor = 0.85;
    neckWidthFactor = 0.15;
    headTailFactor = 0.8;

    constructor(options: CEntityOption) {
        options = {
            polygon: {
                // hierarchy: new Cesium.PolygonHierarchy(options.coordinates),
                material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#91caff').withAlpha(0.8)),
                // outline: true,
                // outlineColor: Cesium.Color.fromCssColorString('#91caff'),
                // outlineWidth: 10,
                // height: 0,
                // classificationType: ClassificationType.CESIUM_3D_TILE
            },
            ...options
        }
        super(options);
        // this.updatePosition(options.coordinates)
        this.coordinatesVirtual = options.coordinates;
    }

    makeCallback() {
        super.makeCallback()
        this.polygon!.hierarchy = new Cesium.CallbackProperty(time => {
            return new Cesium.PolygonHierarchy(this.coordinatesReal)
        }, false)
        // this.children.forEach(child => child.makeCallback())

        // super.makeCallback();
    }

    updateChildren(positions: Cesium.Cartesian3[]) {    // 更新 children
        // super.updateChildren(positions);
        if (Cesium.defined(this.entityCollection)) { // 需要更新
            positions.forEach((position,index) => {
                if(this.children[index]) {  // 没有child创建child 有child更新位置就行
                    this.children[index].coordinatesVirtual = [position]
                }else { //
                    const entity = new CEntity({
                        coordinates: [position],
                        parent: this,
                        point: {
                            disableDepthTestDistance: Number.MAX_VALUE,
                            pixelSize: 10
                        },
                        positionType: this.positionType
                        // makeCallback: (this.polygon?.hierarchy instanceof Cesium.CallbackProperty)
                    })
                    this.children.push(entity)
                    this.entityCollection.add(entity)
                }
            })
        }
    }

    updatePosition(positions: Cesium.Cartesian3[]) {
        // super.updatePosition(position);

        const anchorPoints = positions.map(value => {
            return PlotUtils.cartesian2point(value)
        })
        const geometry = this.getGeometry(anchorPoints).flat();
        if (geometry.some(value => isNaN(value))) {
            return
        }
        this.coordinatesReal = Cesium.Cartesian3.fromDegreesArray(geometry)
        if (this.polygon!.hierarchy instanceof Cesium.ConstantProperty) {
            this.polygon!.hierarchy = new Cesium.ConstantProperty(new Cesium.PolygonHierarchy(this.coordinatesReal))
        }
    }

    getGeometry(anchor_points: Point[]) {
        if (anchor_points.length < 2) {
            return [];
        }
        if (anchor_points.length === 2) {   // 只有两个点，无法形成攻击箭头，直接返回
            return anchor_points;
        } else {
            // 攻击箭头最底下两个点
            let [tailLeft, tailRight] = [anchor_points[0], anchor_points[1]];
            if (PlotUtils.isClockWise(anchor_points[0], anchor_points[1], anchor_points[2])) {  // 判断左右
                tailLeft = anchor_points[1];
                tailRight = anchor_points[0];
            }
            const midTail = PlotUtils.Mid(tailLeft, tailRight); // 底部中间的点
            const bonePnts = [midTail].concat(anchor_points.slice(2));
            const headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
            if (headPnts && headPnts.length > 4) {
                const [neckLeft, neckRight] = [headPnts[0], headPnts[4]];
                const tailWidthFactor = PlotUtils.MathDistance(tailLeft, tailRight) / PlotUtils.getBaseLength(bonePnts);
                const bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, tailWidthFactor);
                const count = bodyPnts.length;
                let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2));
                leftPnts.push(neckLeft);
                let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count));
                rightPnts.push(neckRight);
                leftPnts = PlotUtils.getQBSplinePoints(leftPnts);
                rightPnts = PlotUtils.getQBSplinePoints(rightPnts);
                return leftPnts.concat(headPnts, rightPnts.reverse())
                // setCoordinates([leftPnts.concat(headPnts, rightPnts.reverse())]);
            }
        }
        return []
    }


    getArrowPoints(pnt1: Point, pnt2: Point, pnt3: Point, clockWise: boolean) {
        const midPnt = PlotUtils.Mid(pnt1, pnt2);
        const len = PlotUtils.MathDistance(midPnt, pnt3);
        let midPnt1 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
        let midPnt2 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
        midPnt1 = PlotUtils.getThirdPoint(midPnt, midPnt1, Constants.HALF_PI, len / 5, clockWise);
        midPnt2 = PlotUtils.getThirdPoint(midPnt, midPnt2, Constants.HALF_PI, len / 4, clockWise);
        const points = [midPnt, midPnt1, midPnt2, pnt3];
        const arrowPnts = this.getArrowHeadPoints(points);
        if (arrowPnts && Array.isArray(arrowPnts) && arrowPnts.length > 0) {
            const [neckLeftPoint, neckRightPoint] = [arrowPnts[0], arrowPnts[4]];
            const tailWidthFactor = PlotUtils.MathDistance(pnt1, pnt2) / PlotUtils.getBaseLength(points) / 2;
            const bodyPnts = this.getArrowBodyPoints(points, neckLeftPoint, neckRightPoint, tailWidthFactor);
            if (bodyPnts) {
                const n = bodyPnts.length;
                let lPoints = bodyPnts.slice(0, n / 2);
                let rPoints = bodyPnts.slice(n / 2, n);
                lPoints.push(neckLeftPoint);
                rPoints.push(neckRightPoint);
                lPoints = lPoints.reverse();
                lPoints.push(pnt2);
                rPoints = rPoints.reverse();
                rPoints.push(pnt1);
                return lPoints.reverse().concat(arrowPnts, rPoints);
            }
        } else {
            // return []
            throw new Error('插值出错');
        }
        return []
    }


    getArrowHeadPoints(points: Point[], tailLeft?: Point, tailRight?: Point) {
        let len = PlotUtils.getBaseLength(points);
        let headHeight = len * this.headHeightFactor;
        const headPnt = points[points.length - 1];
        len = PlotUtils.MathDistance(headPnt, points[points.length - 2]);
        let tailWidth = 0;
        if (tailLeft && tailRight) {
            tailWidth = PlotUtils.MathDistance(tailLeft, tailRight);
        }
        if (headHeight > tailWidth * this.headTailFactor) {
            headHeight = tailWidth * this.headTailFactor;
        }
        const headWidth = headHeight * this.headWidthFactor;
        const neckWidth = headHeight * this.neckWidthFactor;
        headHeight = headHeight > len ? len : headHeight;
        const neckHeight = headHeight * this.neckHeightFactor;
        const headEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
        const neckEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
        const headLeft = PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, false);
        const headRight = PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, true);
        const neckLeft = PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, false);
        const neckRight = PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, true);
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
    }


    getArrowBodyPoints(points: Point[], neckLeft: Point, neckRight: Point, tailWidthFactor: number): Array<Point> {
        const allLen = PlotUtils.wholeDistance(points);
        const len = PlotUtils.getBaseLength(points);
        const tailWidth = len * tailWidthFactor;
        const neckWidth = PlotUtils.MathDistance(neckLeft, neckRight);
        const widthDif = (tailWidth - neckWidth) / 2;
        // eslint-disable-next-line
        let tempLen = 0;
        const leftBodyPnts: Point[] = [];
        const rightBodyPnts: Point[] = [];
        for (let i = 1; i < points.length - 1; i++) {
            const angle = PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
            tempLen += PlotUtils.MathDistance(points[i - 1], points[i]);
            const w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
            const left = PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
            const right = PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false);
            leftBodyPnts.push(left);
            rightBodyPnts.push(right);
        }
        return leftBodyPnts.concat(rightBodyPnts);
    }
}
