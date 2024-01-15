import {Col, Flex, Row} from "antd";
import SvgAttackArrow from '@/static/svg/攻击箭头.svg'
import SvgRightArrow from '@/static/svg/细直箭头.svg'
import PlotItem from "@/pages/Toolbar/component/PlotComponent/PlotItem";
import PlotType from "@/plot/core/PlotType";

export default function PlotMilitary() {

    return (
        <div>
            <Row justify={'space-between'}>
                <Col>
                    <PlotItem icon={<SvgAttackArrow/>} plotType={PlotType.AttackArrow} title={'攻击箭头'}/>
                </Col>
                <Col>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.DoubleArrow} title={'钳击箭头'}/>
                </Col>
                <Col>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.FineArrow} title={'细直箭头'}/>
                </Col>
                <Col>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SquadCombat} title={'分队行动'}/>
                </Col>
                <Col>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SwallowArrow} title={'燕尾箭头'}/>
                </Col>
                <Col>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SwallowArrow} title={'燕尾箭头'}/>
                </Col>
                <Col>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SwallowArrow} title={'燕尾箭头'}/>
                </Col>
                <Col>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SwallowArrow} title={'燕尾箭头'}/>
                </Col>
            </Row>
        </div>
    )
}
