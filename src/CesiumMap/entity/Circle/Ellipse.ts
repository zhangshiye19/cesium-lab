import CPolygon from "@/CesiumMap/entity/CPolygon";
import CEntity, {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import Cesium from "cesium";
import {cartesians2mercators, mercators2cartesians} from "@/CesiumMap/entity/marsutils/pointconvert";
import {Constants, MathDistance, Mid, Point} from "@/CesiumMap/entity/core/algorithm";


export default class Ellipse extends CPolygon {

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.ELLIPSE
        this.requirePointCount = 2
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]) {
        if (positions.length < 2) return []
        //@ts-ignore
        const points: Point[] = cartesians2mercators(positions);
        const [pnt1, pnt2] = [points[0], points[1]];
        const center = Mid(pnt1, pnt2);
        // const center = pnt1;
        const majorRadius = Math.abs((pnt1[0] - pnt2[0]) / 2);
        const minorRadius = Math.abs((pnt1[1] - pnt2[1]) / 2);

        let [x, y, angle] = [0, 0, 0];
        const pointsEllipse: Point[] = [];
        for (let i = 0; i <= Constants.FITTING_COUNT; i++) {
            angle = (Math.PI * 2 * i) / Constants.FITTING_COUNT;
            x = center[0] + majorRadius * Math.cos(angle);
            y = center[1] + minorRadius * Math.sin(angle);
            pointsEllipse.push([x, y]);
        }
        return mercators2cartesians(pointsEllipse)
    }
}
