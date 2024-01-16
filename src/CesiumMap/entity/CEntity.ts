import * as Cesium from "cesium";
import PositionType from "./PositionType";
import PlotType from "@/plot/core/PlotType";


export type CEntityOption = Cesium.Entity.ConstructorOptions & {
    positionType?: PositionType
    coordinates: Cesium.Cartesian3[]
    coordinatesR?: Cesium.Cartesian3[]
}

export default class CEntity extends Cesium.Entity {

    plotType: PlotType;
    requirePointCount: number;
    children: CEntity[];
    protected _coordinatesReal: Cesium.Cartesian3[]; // 不能和options里面名字重名字，real可以，没有设置set属性
    protected _coordinatesVirtual: Cesium.Cartesian3[];
    protected positionType: PositionType;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.ENTITY;
        this.requirePointCount = Infinity;
        this.children = [];
        this._coordinatesVirtual = [];
        this._coordinatesReal = options.coordinatesR ?? options.coordinates;
        this.positionType = options.positionType ?? PositionType.Constant;

        // options.makeCallback && this.makeCallback()
        this.makePositionType(this.positionType);
        this.coordinatesVirtual = Cesium.defaultValue(options.coordinates, []);
    }

    get geometryType() {
        return 'Point'
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

    active() {
        this.updateChildren(this.coordinatesVirtual)
    }

    deactive() {
        this.updateChildren(this.coordinatesVirtual)
    }

    protected updateChildren(positions: Cesium.Cartesian3[]) {
    }

    set coordinatesVirtual(coordinates: Cesium.Cartesian3[]) {
        this.updateChildren(coordinates)
        this.updatePosition(coordinates)
        this._coordinatesVirtual = coordinates
    }

    get coordinatesVirtual() {
        return this._coordinatesVirtual;
    }

    get coordinatesReal() { // 获取真实 cartesian
        return this._coordinatesReal;
    }


    protected set coordinateReal(positions: Cesium.Cartesian3[]) {
        if (!Cesium.defined(this.position)) {    // 未定义，直接赋予ConstantPositionProperty
            this.position = new Cesium.ConstantPositionProperty(positions[0])
            return;
        }

        switch(this.positionType) {
            case PositionType.Callback: {
                this._coordinatesReal = positions;
                break;
            }
            case PositionType.Sampled: {
                if(this.position instanceof Cesium.SampledPositionProperty) {   // 样本位置
                    this.position.addSample(Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 1, new Cesium.JulianDate()), positions[0])
                }
                break;
            }
            default: {
                this.position = new Cesium.ConstantPositionProperty(positions[0])
            }
        }
    }

    /**
     * 更新位置
     */
    protected updatePosition(positions: Cesium.Cartesian3[]) {
        this.coordinateReal = positions;
    }


    makeCallback() {
        // @ts-ignore
        this.position = new Cesium.CallbackProperty(time => {
            return this._coordinatesReal[0]
        }, false)
        this.children.forEach(child => child.makeCallback())
    }

    makeConstant() {

        this.position = new Cesium.ConstantPositionProperty(this._coordinatesReal[0])
        this.children.forEach(child => child.makeConstant())
    }

    makeSampled() {
        this.position = new Cesium.SampledPositionProperty()
    }
}
