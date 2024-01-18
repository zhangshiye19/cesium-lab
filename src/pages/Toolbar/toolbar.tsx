import styles from './toolbar.module.css'
import PlottingComponent from './component/PlotComponent';
import { Button, Space } from 'antd';
import Icon,{IeOutlined} from '@ant-design/icons';


export default function Toolbar() {

    return (
        <div className={styles['toolbar-container']}>
            <Space direction='vertical'>
                <PlottingComponent />
                <Button title='归心' type='default' size='large' icon={<IeOutlined />}></Button>
            </Space>
        </div>
    )
}
