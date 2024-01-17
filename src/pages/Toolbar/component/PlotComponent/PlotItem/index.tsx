import styles from './index.module.css'
import {Button} from "antd";
import React, {useEffect} from "react";
import PlotType from "@/CesiumMap/entity/PlotType";
import PlotDraw from "@/CesiumMap/plot/PlotDraw";

type PlotItemProps = {
    icon: React.ReactNode,
    plotType: PlotType,
    title: string
}

export default function PlotItem({icon, plotType, title}: PlotItemProps) {

    useEffect(() => {

    }, []);

    return (
        <div className={styles['plot-item-container']}>
            <Button size={'large'} title={title} icon={icon} onClick={e => {
                PlotDraw.getInstance().startPlot(plotType);
            }}/>
            <div>{title}</div>
        </div>
    )
}
