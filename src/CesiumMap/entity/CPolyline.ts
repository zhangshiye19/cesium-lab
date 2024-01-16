import CEntity from './CEntity'
import { CEntityOption } from './CEntity'
import * as Cesium from 'cesium'
import PositionType from './PositionType'
import PlotType from "@/plot/core/PlotType";

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
        this.coordinatesVirtual = options.coordinates;
        this.plotType = PlotType.POLYLINE;
        this.requirePointCount = Infinity;
    }

    get geometryType() {
        return 'Polyline'
    }

    active(): void {
        this.children.forEach(child => child.show = true)
    }

    deactive(): void {
        this.children.forEach(child => child.show = false)
    }

    makeCallback() {
        super.makeCallback()
        this.polyline!.positions = new Cesium.CallbackProperty(time => {
            return this._coordinatesReal
        }, false)
    }

    makeConstant(): void {
        super.makeConstant()
        this.polyline!.positions = new Cesium.ConstantProperty(this._coordinatesReal)
    }

    updateChildren(positions: Cesium.Cartesian3[]) {    // 更新 children
        // super.updateChildren(positions);
        if (Cesium.defined(this.entityCollection)) { // 需要更新
            positions.forEach((position,index) => {
                if(this.children[index]) {  // 没有child创建child 有child更新位置就行
                    this.children[index].coordinatesVirtual = [position]
                }else { //
                    const entity = new CEntity({
                        coordinates: [position],
                        parent: this,
                        point: {
                            disableDepthTestDistance: Number.MAX_VALUE,
                            pixelSize: 10
                        },
                        positionType: this.positionType
                        // makeCallback: (this.polygon?.hierarchy instanceof Cesium.CallbackProperty)
                    })
                    this.children.push(entity)
                    this.entityCollection.add(entity)
                }
            })
        }
    }

    updatePosition(positions: Cesium.Cartesian3[]) {
        super.updatePosition(positions);

        this._coordinatesReal = positions;
        if (this.positionType === PositionType.Constant) {
            this.polyline!.positions = new Cesium.ConstantProperty(this._coordinatesReal)
        }
    }
}