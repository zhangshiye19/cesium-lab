import {Flex} from "antd";
import SvgAttackArrow from '@/static/svg/攻击箭头.svg'
import SvgRightArrow from '@/static/svg/细直箭头.svg'
import PlotItem from "@/pages/Toolbar/component/PlotComponent/PlotItem";
import PlotType from "@/plot/core/PlotType";

export default function PlotMilitary() {

    return (
        <div>
            <Flex wrap={'wrap'} gap={'large'}>
                <PlotItem icon={<SvgAttackArrow/>} plotType={PlotType.AttackArrow} title={'攻击箭头'}/>
                <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.DoubleArrow} title={'钳击箭头'}/>
                <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.FineArrow} title={'FineArrow'}/>
                <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SquadCombat} title={'SquadCombat'}/>
                <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SwallowArrow} title={'SwallowArrow'}/>
            </Flex>
        </div>
    )
}
