import CEntity from './CEntity'
import {CEntityOption} from './CEntity'
import * as Cesium from 'cesium'
import PositionType from './PositionType'
import PlotType from "./PlotType";

export default class CPolyline extends CEntity {
    constructor(options: CEntityOption) {
        options = {
            polyline: {
                material: new Cesium.ColorMaterialProperty(Cesium.Color.AQUA),
                clampToGround: true
            },
            ...options
        }
        super(options)
        this.plotType = PlotType.POLYLINE;
        this.maxRequiredPointCount = Infinity;
        this.minRequiredPointCount = 2;
        this.setChildrenUpdateCallback('anchor',this.updateChildOfAnchor)
    }

    get geometryType() {
        return 'Polyline'
    }

    active(): void {
        super.active()
        this.children.forEach(({entities}) => entities.forEach(entity => (entity.show = true)))
    }

    deactive(): void {
        super.deactive()
        this.children.forEach(({entities}) => entities.forEach(entity => (entity.show = false)))
    }

    get coordinatesReal() {
        return this._coordinatesReal;
    }

    protected set coordinatesReal(positions: Cesium.Cartesian3[]) {
        if (positions.length < this.minRequiredPointCount) return
        this._coordinatesReal = positions;
        switch (this.positionType) {
            case PositionType.Callback: {
                if (!(this.polyline!.positions instanceof Cesium.CallbackProperty)) {
                    // @ts-ignore
                    this.polyline!.positions = new Cesium.CallbackProperty(time => {
                        return this._coordinatesReal
                    }, false)
                }
                break;
            }
            default: {
                this.polyline!.positions = new Cesium.ConstantProperty(this._coordinatesReal)
            }
        }
    }

}
