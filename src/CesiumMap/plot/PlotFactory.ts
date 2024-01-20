import * as Cesium from 'cesium'
import CEntity from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import ArrowAttack from "@/CesiumMap/entity/ArrowAttack";
import PositionType from "@/CesiumMap/entity/PositionType";
import ArrowDouble from "@/CesiumMap/entity/ArrowDouble";
import ArrowFine from "@/CesiumMap/entity/ArrowFine";
import SquadCombat from "@/CesiumMap/entity/SquadCombat";
import AssaultDirection from "@/CesiumMap/entity/AssaultDirection";
import CPolyline from "@/CesiumMap/entity/CPolyline";
import GatheringPlace from "@/CesiumMap/entity/GatheringPlace";
import CloseCurve from "@/CesiumMap/entity/CloseCurve";
import {cartesians2lonlats, lonlats2cartesians} from "@/CesiumMap/entity/util/pointconvert";
import {type Point} from "@/CesiumMap/entity/core/PlotUtil";
import Lune from "@/CesiumMap/entity/Lune";
import Sector from "@/CesiumMap/entity/Sector";
import ArrowAttackSwallowTailed from "@/CesiumMap/entity/ArrowAttackSwallowTailed";
import SquadCombatSwallowTailed from "@/CesiumMap/entity/SquadCombatSwallowTailed";
import StraightArrow from "@/CesiumMap/entity/StraightArrow";


export function getEntityFromType(plotType: PlotType, positions: Cesium.Cartesian3[],positionType?: PositionType,positionsReal?: Cesium.Cartesian3[]) {
    let plottingEntity: CEntity | undefined;
    // console.log(plotType)
    const options = {
        coordinates: positions,
        positionType: positionType ?? PositionType.Constant,
        coordinatesR: positionsReal
        // makeCallback: true
    }
    if (plotType === PlotType.AttackArrow) {
        plottingEntity = new ArrowAttack(options)
    } else if (plotType === PlotType.DOUBLE_ARROW) {
        plottingEntity = new ArrowDouble(options)
    } else if (plotType === PlotType.FINE_ARROW) {
        plottingEntity = new ArrowFine(options)
    } else if (plotType === PlotType.SQUAD_COMBAT) {
        plottingEntity = new SquadCombat(options)
    } else if (plotType === PlotType.STRAIGHT_ARROW) {
        plottingEntity = new StraightArrow(options)
    } else if (plotType === PlotType.POLYLINE) {
        plottingEntity = new CPolyline(options)
    }else if (plotType === PlotType.GATHERING_PLACE) {
        plottingEntity = new GatheringPlace(options)
    }else if(plotType === PlotType.CLOSED_CURVE) {
        plottingEntity = new CloseCurve(options)
    }else if(plotType === PlotType.LUNE) {
        plottingEntity = new Lune(options)
    }else if(plotType === PlotType.SECTOR) {
        plottingEntity = new Sector(options)
    }else if(plotType === PlotType.TAILED_SQUAD_COMBAT) {
        plottingEntity = new SquadCombatSwallowTailed(options)
    }else if(plotType === PlotType.TAILED_ATTACK_ARROW) {
        plottingEntity = new ArrowAttackSwallowTailed(options)
    }else if(plotType === PlotType.ASSAULT_DIRECTION) {
        plottingEntity = new AssaultDirection(options)
    }
    return plottingEntity;
}

export function loadEntityFromJsonObj(obj: any): CEntity | undefined {
    if (!obj.hasOwnProperty('properties') ||
        !obj.properties.hasOwnProperty("type") ||
        !obj.properties.hasOwnProperty('points')) {
        return;   //    没有值，无法转换
    }
    const points: Point[] = obj['properties']['points'];
    const pointsR: Point[] = obj['geometry']['coordinates'];
    return getEntityFromType(obj['properties']['type'],
        lonlats2cartesians(points),
        PositionType.Callback,
        lonlats2cartesians(pointsR));
}

export function saveEntityToJsonObj(entity: CEntity) {
    const obj: any = {};
    obj['type'] = 'Feature';

    obj['geometry'] = {
        "type": entity.geometryType,
        "coordinates": cartesians2lonlats(entity.coordinatesReal)
    }
    obj['properties'] = {
        "type": entity.plotType,
        "points": cartesians2lonlats(entity.coordinatesVirtual)
    }

    return obj
}
