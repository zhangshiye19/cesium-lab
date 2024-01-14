import * as PlotUtils from "@/plot/utils/utils";
import {Point} from "@/plot/utils/utils";
import * as Constants from '@/plot/utils/constant'


let tailWidthFactor = 0.1;
let neckWidthFactor = 0.2;
let headWidthFactor = 0.25;
let headAngle = Math.PI / 8.5;
let neckAngle = Math.PI / 13;
/**
 * @desc 粗单尖头箭头
 * @Inherits ol.geom.Polygon
 */
export default function FineArrow(anchor_points: Point[]) {
    const cont = anchor_points.length;
    if (cont < 2) {
        return false;
    }
    const pnts = anchor_points;
    const [pnt1, pnt2] = [pnts[0], pnts[1]];
    const len = PlotUtils.getBaseLength(pnts);
    const tailWidth = len * tailWidthFactor;
    const neckWidth = len * neckWidthFactor;
    const headWidth = len * headWidthFactor;
    const tailLeft = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, true);
    const tailRight = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, false);
    const headLeft = PlotUtils.getThirdPoint(pnt1, pnt2, headAngle, headWidth, false);
    const headRight = PlotUtils.getThirdPoint(pnt1, pnt2, headAngle, headWidth, true);
    const neckLeft = PlotUtils.getThirdPoint(pnt1, pnt2, neckAngle, neckWidth, false);
    const neckRight = PlotUtils.getThirdPoint(pnt1, pnt2, neckAngle, neckWidth, true);
    return [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight]
}

