import CEntity from './CEntity'
import {CEntityOption} from './CEntity'
import * as Cesium from 'cesium'
import PositionType from './PositionType'
import PlotType from "./PlotType";
import CPoint from "@/CesiumMap/entity/CPoint";

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
        this.requirePointCount = Infinity;
    }

    get geometryType() {
        return 'Polyline'
    }

    active(): void {
        super.active()
        this.children.forEach(child => child.show = true)
    }

    deactive(): void {
        super.deactive()
        this.children.forEach(child => child.show = false)
    }

    get coordinatesReal() {
        return this._coordinatesReal;
    }

    protected set coordinatesReal(positions: Cesium.Cartesian3[]) {
        if (positions.length < 2) return
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

    updateChildren() {    // 更新 children
        this.coordinatesVirtual.forEach((position,index) => {
            if(this.children[index]) {  // 没有child创建child 有child更新位置就行
                this.children[index].coordinatesVirtual = [position]
            }else { //
                const entity = new CPoint({
                    coordinates: [position],
                    parent: this,
                    positionType: this.positionType
                    // makeCallback: (this.polygon?.hierarchy instanceof Cesium.CallbackProperty)
                })
                this.children.push(entity)
                // this.entityCollection.add(entity)
            }
            if(this.entityCollection && !this.entityCollection.getById(this.children[index].id)) {
                this.entityCollection.add(this.children[index])
            }
        })
    }
}
