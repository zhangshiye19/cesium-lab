import CPoint from "@/CesiumMap/entity/CPoint";
import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import Cesium from "cesium";


export default class Pennant extends CPoint {

    constructor(options: CEntityOption) {
        super(options);

        this.plotType = PlotType.PENNANT

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }
}
