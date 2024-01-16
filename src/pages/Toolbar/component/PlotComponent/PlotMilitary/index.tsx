import {Col, Row} from "antd";
import SvgAttackArrow from '@/static/svg/攻击箭头.svg'
import SvgRightArrow from '@/static/svg/细直箭头.svg'
import PlotItem from "@/pages/Toolbar/component/PlotComponent/PlotItem";
import PlotType from "@/CesiumMap/entity/PlotType";

export default function PlotMilitary() {

    return (
        <div>
            <Row justify={'space-between'} gutter={[16,16]} >
                <Col span={24/4}>
                    <PlotItem icon={<SvgAttackArrow/>} plotType={PlotType.AttackArrow} title={'攻击箭头'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.DOUBLE_ARROW} title={'钳击箭头'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.FINE_ARROW} title={'细直箭头'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SQUAD_COMBAT} title={'分队行动'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.POLYLINE} title={'燕尾箭头'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.STRAIGHT_ARROW} title={'箭头'}/>
                </Col>
            </Row>
        </div>
    )
}
