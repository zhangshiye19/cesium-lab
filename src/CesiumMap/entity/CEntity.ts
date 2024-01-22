import * as Cesium from "cesium";
import PositionType from "./PositionType";
import PlotType from "./PlotType";
import CPoint from "@/CesiumMap/entity/CPoint";


export type CEntityOption = Cesium.Entity.ConstructorOptions & {
    positionType?: PositionType
    coordinates: Cesium.Cartesian3[]
    coordinatesActual?: Cesium.Cartesian3[]
}

export type CEntityUpdateCallbackType = (child: CEntity[], vCoordinates: Cesium.Cartesian3[], rCoordinates: Cesium.Cartesian3[]) => CEntity[]

export default class CEntity extends Cesium.Entity {

    plotType: PlotType;
    requirePointCount: number;
    children: Map<string, { entities: CEntity[], updateCallback: CEntityUpdateCallbackType }>;
    protected _coordinatesReal: Cesium.Cartesian3[]; // 不能和options里面名字重名字，real可以，没有设置set属性
    protected _coordinatesVirtual: Cesium.Cartesian3[];
    protected positionType: PositionType;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.ENTITY;
        this.requirePointCount = Infinity;
        this.children = new Map();
        this._coordinatesVirtual = [];
        this._coordinatesReal = options.coordinatesActual ?? options.coordinates;
        this.positionType = options.positionType ?? PositionType.Constant;

        this.makePositionType(this.positionType);
        this.coordinatesVirtual = Cesium.defaultValue(options.coordinates, []);
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }

    get geometryType() {
        return 'Point'
    }

    makePositionType(positionType: PositionType) {
        this.positionType = positionType;   // 再次赋值
        switch (positionType) {
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
        this.updateChildren()
    }

    deactive() {
        this.updateChildren()
    }

    protected updateChildren() {
        this.children.forEach(({entities, updateCallback}, key) => {
            const updatedEntities = updateCallback(entities, this.coordinatesVirtual, this.coordinatesReal)
            const removedEntities: CEntity[] = [];
            const mergedEntities: CEntity[] = []

            // entity 比较
            let i = 0, j = 0;
            while (i < entities.length && j < updatedEntities.length) {  // 遍历共同部分
                if (entities[i].id !== updatedEntities[j].id) {  // 同一个entity，不做任何修改
                    removedEntities.push(entities[i])
                }
                mergedEntities.push(updatedEntities[j])
            }
            while (i < entities.length) {    // 锚点变少
                removedEntities.push(entities[i])
            }
            while(j < updatedEntities.length) { // 锚点变多
                entities.push(updatedEntities[j])
            }

            removedEntities.forEach(entity => {
                if(this.entityCollection && this.entityCollection.getById(entity.id)) {
                    this.entityCollection.removeById(entity.id)
                }
            })
            mergedEntities.forEach(entity => {
                if(this.entityCollection && !this.entityCollection.getById(entity.id)) {    // 没有就加入
                    this.entityCollection.add(entity)
                }
            })
            this.children.get(key)
        })
    }

    set coordinatesVirtual(coordinates: Cesium.Cartesian3[]) {
        this._coordinatesVirtual = coordinates
        this.coordinatesReal = this.mapToCoordinates(coordinates)
        this.updateChildren()
    }

    get coordinatesVirtual() {
        return this._coordinatesVirtual;
    }

    get coordinatesReal() {
        return this._coordinatesReal;
    }

    protected set coordinatesReal(positions: Cesium.Cartesian3[]) {
        this._coordinatesReal = positions;
        switch (this.positionType) {
            case PositionType.Callback: {
                if (!(this.position instanceof Cesium.CallbackProperty)) {
                    // @ts-ignore
                    this.position = new Cesium.CallbackProperty(time => {
                        return this._coordinatesReal[0]
                    }, false)
                }
                break;
            }
            case PositionType.Sampled: {
                if (!(this.position instanceof Cesium.SampledPositionProperty)) {   // 样本位置
                    this.position = new Cesium.SampledPositionProperty()
                }
                //@ts-ignore
                this.position.addSample(Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 1, new Cesium.JulianDate()), positions[0])
                break;
            }
            default: {
                this.position = new Cesium.ConstantPositionProperty(this._coordinatesReal[0])
            }
        }
    }

    /**
     * 更新位置
     */
    protected mapToCoordinates(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        // this.coordinatesReal = positions;
        return positions;
    }

    setChildrenUpdateCallback(childGroup: string, callback: CEntityUpdateCallbackType) {
        let children = this.children.get(childGroup)
        if (!children) {
            children = {entities: [], updateCallback: callback}
        } else {
            children.updateCallback = callback
        }
        this.children.set(childGroup, children)
    }

    updateChildOfAnchor(entities: CEntity[], vCoordinates: Cesium.Cartesian3[], rCoordinates: Cesium.Cartesian3[]): CEntity[] {
        vCoordinates.forEach((position, index) => {
            if (entities[index]) {  // 没有child创建child 有child更新位置就行
                entities[index].coordinatesVirtual = [position]
            } else { //
                const entity = new CPoint({
                    coordinates: [position],
                    parent: this,
                    positionType: this.positionType
                    // makeCallback: (this.polygon?.hierarchy instanceof Cesium.CallbackProperty)
                })
                entities.push(entity)
                // this.entityCollection.add(entity)
            }
            if (this.entityCollection && !this.entityCollection.getById(entities[index].id)) {
                this.entityCollection.add(entities[index])
            }
        })

        return entities
    }

    makeCallback() {
        this.positionType = PositionType.Callback;
        this.children.forEach(({entities}) => entities.forEach(entity => entity.makeCallback()))
    }

    makeConstant() {
        this.positionType = PositionType.Constant;
        this.children.forEach(({entities}) => entities.forEach(entity => entity.makeConstant()))
    }

    makeSampled() {
        this.positionType = PositionType.Sampled
        this.children.forEach(({entities}) => entities.forEach(entity => entity.makeSampled()))
    }
}
