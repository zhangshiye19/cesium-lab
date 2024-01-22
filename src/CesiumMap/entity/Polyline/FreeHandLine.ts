import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import CPolyline from "@/CesiumMap/entity/CPolyline";


export default class FreeHandLine extends CPolyline{

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.FREEHANDLINE;
        this.maxRequiredPointCount = Infinity;
        this.minRequiredPointCount = 2;

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }
}
