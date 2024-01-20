import {CEntityOption} from "./CEntity";
import * as Cesium from "cesium";
import CPolyline from './CPolyline';
import PlotType from "./PlotType";
import {plotUtil, Point} from "./core/PlotUtil";
import * as pointconvert from './util/pointconvert';
import CPolygon from "./CPolygon";
import ArrowFine from "@/CesiumMap/entity/ArrowFine";
// import PositionType from "./PositionType";


export default class AssaultDirection extends ArrowFine {
    tailWidthFactor =  0.05;
    neckWidthFactor =  0.1;
    headWidthFactor =  0.15;
    headAngle = Math.PI / 4;
    neckAngle = Math.PI * 0.17741;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.ASSAULT_DIRECTION;
        this.requirePointCount = 2;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }
}
