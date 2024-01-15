import * as Cesium from "cesium";
import PositionType from "./PositionType";


export type CEntityOption = Cesium.Entity.ConstructorOptions & {
    positionType?: PositionType
    coordinates: Cesium.Cartesian3[]
}

export default class CEntity extends Cesium.Entity {

    children: CEntity[];
    protected coordinatesReal: Cesium.Cartesian3[]; // 自定义位置坐标，统一类型，不能用_coordinates，entity自己也会进行属性劫持
    protected _coordinatesVirtual: Cesium.Cartesian3[];
    protected positionType: PositionType;

    constructor(options: CEntityOption) {
        super(options);
        this.children = [];
        this._coordinatesVirtual = [];
        this.coordinatesReal = options.coordinates;
        this.positionType = options.positionType || PositionType.Constant;

        // options.makeCallback && this.makeCallback()
        this.makePositionType(this.positionType);
        this.coordinatesVirtual = Cesium.defaultValue(options.coordinates, []);
    }

    makePositionType(positionType: PositionType) {
        this.positionType = positionType;   // 再次赋值
        switch(positionType) {
            case PositionType.Callback: {
                this.makeCallback()
                break;
            }
            case PositionType.Sampled: {
                this.makeSampled()
                break;
            }
            case PositionType.Constant:
            default: {  // 默认行为 Constant
                this.makeConstant()
            }
        }
    }

    active() {}

    deactive() {}

    protected updateChildren(positions: Cesium.Cartesian3[]) {
    }

    set coordinatesVirtual(coordinates: Cesium.Cartesian3[]) {
        this.updateChildren(coordinates)
        this.updatePosition(coordinates)
        this._coordinatesVirtual = coordinates
    }

    get coordinatesVirtual() {
        return this._coordinatesVirtual
    }

    /**
     * 更新位置
     */
    protected updatePosition(positions: Cesium.Cartesian3[]) {
        if (!Cesium.defined(this.position)) {    // 未定义，直接赋予ConstantPositionProperty
            this.position = new Cesium.ConstantPositionProperty(positions[0])
            return;
        }

        if (this.position instanceof Cesium.ConstantPositionProperty) {
            this.position = new Cesium.ConstantPositionProperty(positions[0])
        } else if (this.position instanceof Cesium.CallbackProperty) {
            this.coordinatesReal = positions;
        } else if (this.position instanceof Cesium.SampledPositionProperty) {
            this.position.addSample(Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 1, new Cesium.JulianDate()), positions[0])
        }
    }

    makeCallback() {
        // @ts-ignore
        this.position = new Cesium.CallbackProperty(time => {
            return this.coordinatesReal[0]
        }, false)
        this.children.forEach(child => child.makeCallback())
    }

    makeConstant() {
        this.position = new Cesium.ConstantPositionProperty(this.coordinatesReal[0])
        this.children.forEach(child => child.makeConstant())
    }

    makeSampled() {
        this.position = new Cesium.SampledPositionProperty()
    }
}
