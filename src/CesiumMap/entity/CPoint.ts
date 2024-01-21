import CEntity, {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";


export default class CPoint extends CEntity {

    constructor(options: CEntityOption) {
        super({
            point: {
                color: Cesium.Color.GREEN,
                pixelSize: 10,
                disableDepthTestDistance: Number.MAX_VALUE,
            },
            ...options
        });

        this.plotType = PlotType.POINT
        this.requirePointCount = 1
    }

    get geometryType() {
        return 'Point'
    }
}
