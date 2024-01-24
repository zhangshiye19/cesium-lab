import CEntity, {CEntityOption} from "@/CesiumMap/entity/CEntity";
import ArrowAttack from "@/CesiumMap/entity/Arrow/ArrowAttack";
import ArrowDouble from "@/CesiumMap/entity/Arrow/ArrowDouble";
import ArrowFine from "@/CesiumMap/entity/Arrow/ArrowFine";
import SquadCombat from "@/CesiumMap/entity/Arrow/SquadCombat";
import StraightArrow from "@/CesiumMap/entity/Arrow/StraightArrow";
import CPolyline from "@/CesiumMap/entity/CPolyline";
import GatheringPlace from "@/CesiumMap/entity/Polygon/GatheringPlace";
import CloseCurve from "@/CesiumMap/entity/Polygon/CloseCurve";
import Lune from "@/CesiumMap/entity/Polygon/Lune";
import Sector from "@/CesiumMap/entity/Polygon/Sector";
import SquadCombatSwallowTailed from "@/CesiumMap/entity/Arrow/SquadCombatSwallowTailed";
import ArrowAttackSwallowTailed from "@/CesiumMap/entity/Arrow/ArrowAttackSwallowTailed";
import AssaultDirection from "@/CesiumMap/entity/Arrow/AssaultDirection";
import {Arc} from "@/CesiumMap/entity/Arc/Arc";
import Circle from "@/CesiumMap/entity/Circle/Circle";
import Ellipse from "@/CesiumMap/entity/Circle/Ellipse";
import Curve from "@/CesiumMap/entity/Polyline/Curve";
import FreeHandLine from "@/CesiumMap/entity/Polyline/FreeHandLine";
import Rectinclined1 from "@/CesiumMap/entity/Polygon/Rectinclined";
import Rectinclined2 from "@/CesiumMap/entity/Polygon/Rectinclined2";
import Rectangle from "@/CesiumMap/entity/Polygon/Rectangle";
import CPoint from "@/CesiumMap/entity/CPoint";
import RectFlag from "@/CesiumMap/entity/Flag/RectFlag";
import CPolygon from "@/CesiumMap/entity/CPolygon";

enum PlotType {
    AttackArrow = "AttackArrow",
    TEXTAREA = 'TextArea', // 文本标绘（特殊）
    RECTINCLINED1 = 'RectInclined1',
    RECTINCLINED2 = 'RectInclined2',
    ARC = 'Arc',
    CURVE = 'Curve',
    GATHERING_PLACE = 'GatheringPlace',
    POLYLINE = 'Polyline',
    FREEHANDLINE = 'FreeHandLine',
    POINT = 'Point',
    PENNANT = 'Pennant',
    RECTANGLE = 'RectAngle',
    CIRCLE = 'Circle',
    ELLIPSE = 'Ellipse',
    LUNE = 'Lune',
    SECTOR = 'Sector',
    CLOSED_CURVE = 'ClosedCurve',
    POLYGON = 'Polygon',
    FREE_POLYGON = 'FreePolygon',
    DOUBLE_ARROW = 'DoubleArrow',
    STRAIGHT_ARROW = 'StraightArrow',
    FINE_ARROW = 'FineArrow',
    ASSAULT_DIRECTION = 'AssaultDirection',
    TAILED_ATTACK_ARROW = 'TailedAttackArrow',
    SQUAD_COMBAT = 'SquadCombat',
    TAILED_SQUAD_COMBAT = 'TailedSquadCombat',
    RECTFLAG = 'RectFlag',
    TRIANGLEFLAG = 'TriangleFlag',
    CURVEFLAG = 'CurveFlag',
    LOCATION = 'Location',
    TEXTLABEL = 'TextLabel',
    ENTITY = 'Entity'
}

export function getDescription(plotType: PlotType): string {
    switch (plotType) {
        case PlotType.ARC:
            return '弧线'
        case PlotType.ASSAULT_DIRECTION:
            return '粗直箭头'
        case PlotType.POLYGON:
            return '普通面'
        case PlotType.AttackArrow:
            return '进攻箭头'
        case PlotType.CIRCLE:
            return '圆'
        case PlotType.CLOSED_CURVE:
            return '闭合曲线'
        case PlotType.CURVE:
            return '曲线'
        case PlotType.CURVEFLAG:
            return '曲线旗帜'
        case PlotType.DOUBLE_ARROW:
            return '双箭头'
        case PlotType.ELLIPSE:
            return '椭圆'
        case PlotType.ENTITY:
            return '简单实体（无意义）'
        case PlotType.FINE_ARROW:
            return '两点？箭头'
        case PlotType.FREE_POLYGON:
            return '自由面（未实现）'
        case PlotType.FREEHANDLINE:
            return '自由线（未实现）'
        case PlotType.GATHERING_PLACE:
            return '集结地'
        case PlotType.LOCATION:
            return 'location'
        case PlotType.LUNE:
            return '弧面'
        case PlotType.PENNANT:
            return '??'
        case PlotType.POINT:
            return '点'
        case PlotType.POLYLINE:
            return '线'
        case PlotType.RECTANGLE:
            return '矩形'
        case PlotType.RECTFLAG:
            return '矩形旗帜'
        case PlotType.RECTINCLINED1:
            return '矩形-类1'
        case PlotType.RECTINCLINED2:
            return '矩形-类2'
        case PlotType.SECTOR:
            return '扇形'
        case PlotType.SQUAD_COMBAT:
            return '分组行动'
        case PlotType.STRAIGHT_ARROW:
            return '细直箭头'
        case PlotType.TAILED_ATTACK_ARROW:
            return '进攻箭头（燕尾）'
        case PlotType.TAILED_SQUAD_COMBAT:
            return '分组行动（燕尾）'
        case PlotType.TEXTAREA:
            return '文本域'
        case PlotType.TEXTLABEL:
            return '文本'
        case PlotType.TRIANGLEFLAG:
            return '三角旗帜'
    }
    return '未知类型'
}

export function getEntityFromType(plotType: PlotType, options: CEntityOption) {
    let plottingEntity: CEntity | undefined;
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
    } else if (plotType === PlotType.GATHERING_PLACE) {
        plottingEntity = new GatheringPlace(options)
    } else if (plotType === PlotType.CLOSED_CURVE) {
        plottingEntity = new CloseCurve(options)
    } else if (plotType === PlotType.LUNE) {
        plottingEntity = new Lune(options)
    } else if (plotType === PlotType.SECTOR) {
        plottingEntity = new Sector(options)
    } else if (plotType === PlotType.TAILED_SQUAD_COMBAT) {
        plottingEntity = new SquadCombatSwallowTailed(options)
    } else if (plotType === PlotType.TAILED_ATTACK_ARROW) {
        plottingEntity = new ArrowAttackSwallowTailed(options)
    } else if (plotType === PlotType.ASSAULT_DIRECTION) {
        plottingEntity = new AssaultDirection(options)
    } else if (plotType === PlotType.ARC) {
        plottingEntity = new Arc(options)
    } else if (plotType === PlotType.CIRCLE) {
        plottingEntity = new Circle(options)
    } else if (plotType === PlotType.ELLIPSE) {
        plottingEntity = new Ellipse(options)
    } else if (plotType === PlotType.CURVE) {
        plottingEntity = new Curve(options)
    } else if (plotType === PlotType.FREEHANDLINE) {
        plottingEntity = new FreeHandLine(options)
    } else if (plotType === PlotType.RECTINCLINED1) {
        plottingEntity = new Rectinclined1(options)
    } else if (plotType === PlotType.RECTINCLINED2) {
        plottingEntity = new Rectinclined2(options)
    } else if (plotType === PlotType.RECTANGLE) {
        plottingEntity = new Rectangle(options)
    } else if (plotType === PlotType.POINT) {
        plottingEntity = new CPoint(options)
    } else if (plotType === PlotType.RECTFLAG) {
        plottingEntity = new RectFlag(options)
    } else if (plotType === PlotType.POLYGON) {
        plottingEntity = new CPolygon(options)
    }
    return plottingEntity;
}

export default PlotType;
