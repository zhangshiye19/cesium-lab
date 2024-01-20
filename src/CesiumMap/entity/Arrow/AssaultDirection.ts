import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import ArrowFine from "@/CesiumMap/entity/Arrow/ArrowFine";


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