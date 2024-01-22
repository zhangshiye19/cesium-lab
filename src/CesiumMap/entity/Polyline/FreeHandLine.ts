import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import CPolyline from "@/CesiumMap/entity/CPolyline";
import Cesium from "cesium";


export default class FreeHandLine extends CPolyline{

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.FREEHANDLINE
        this.requirePointCount = Infinity

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }
}
