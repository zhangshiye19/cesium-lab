import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import CPolyline from "@/CesiumMap/entity/CPolyline";


export default class FreeHandLine extends CPolyline{

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.FREEHANDLINE
        this.requirePointCount = Infinity
    }
}
