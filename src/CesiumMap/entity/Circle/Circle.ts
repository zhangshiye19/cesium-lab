import CPolygon from "@/CesiumMap/entity/CPolygon";
import  {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import Cesium from "cesium";
import {cartesians2mercators, mercators2cartesians} from "@/CesiumMap/entity/marsutils/pointconvert";
import {MathDistance, Point} from "@/CesiumMap/entity/core/algorithm";


export default class Circle extends CPolygon {

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.CIRCLE
        this.maxRequiredPointCount = 2
        this.minRequiredPointCount = 2;

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]) {
        if (positions.length < this.minRequiredPointCount) return []
        //@ts-ignore
        const points: Point[] = cartesians2mercators(positions);
        const center = points[0];
        const radius = MathDistance(center as Point, points[1]);

        let [x, y, angle] = [0, 0, 0];
        const pointsCircle: Point[] = [];
        for (let i = 0; i <= 100; i++) {
            angle = (Math.PI * 2 * i) / 100;
            x = center[0] + radius * Math.cos(angle);
            y = center[1] + radius * Math.sin(angle);
            pointsCircle.push([x, y]);
        }
        return mercators2cartesians(pointsCircle)
    }
}
