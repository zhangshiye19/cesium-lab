import CPoint from "@/CesiumMap/entity/CPoint";
import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";


export default class Pennant extends CPoint {

    constructor(options: CEntityOption) {
        super(options);

        this.plotType = PlotType.PENNANT
    }
}
