import styles from './index.module.css'
import {Button} from "antd";
import React, {useEffect} from "react";
import PlotType from "@/plot/core/PlotType";
import PlotDraw from "@/plot/core/PlotDraw";

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
