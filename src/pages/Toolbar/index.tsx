import styles from './index.module.css'
import DrawComponent from './component/DrawComponent';
import { Button, Space } from 'antd';
import Icon,{IeOutlined} from '@ant-design/icons';


export default function Toolbar() {

    return (
        <div className={styles['toolbar-container']}>
            <Space direction='vertical'>
                <DrawComponent />
                <Button title='归心' type='default' size='large' icon={<IeOutlined />}></Button>
            </Space>
        </div>
    )
}