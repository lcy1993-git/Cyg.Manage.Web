import { SearchOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Space } from 'antd'
import { useState } from 'react'
import { useMyContext } from '../Context'
import { FEATUREOPTIONS, POWERSUPPLY, TRANSFORMERSUBSTATION } from '../DrawToolbar/GridUtils'
import { LEFTMENUWIDTH } from '../tools'
import styles from './index.less'

const Toolbar = (props: any) => {
  const { leftMenuVisible } = props
  const {
    setdrawToolbarVisible,
    setImportModalVisible,
    setzIndex,
    drawToolbarVisible,
    pageDrawState,
  } = useMyContext()
  // const { , setdrawToolbarVisible, mapRef, isRefresh, zIndex, setzIndex } =
  useMyContext()
  // 设备筛选列表是否显示
  const [toolbalHasShow, setToolbalHasShow] = useState(false)
  /** 搜索设备 **/
  const searchEquipmentType = () => {}

  return (
    <>
      <div
        className={styles.toolbar}
        style={{
          left: leftMenuVisible ? `${LEFTMENUWIDTH + 20}px` : 20,
        }}
      >
        <Space>
          <Button type="primary" onClick={() => setImportModalVisible(true)}>
            数据导入
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setzIndex('create')
              setdrawToolbarVisible(true)
            }}
          >
            手动绘制
          </Button>
          <Button type="primary">一键查重</Button>
        </Space>
      </div>
      <div
        className={styles.searchWrap}
        style={{
          right: toolbalHasShow ? `${drawToolbarVisible || pageDrawState ? 398 : 20}px` : -200,
        }}
      >
        <Form>
          <Form.Item name="featureType">
            <Checkbox.Group
              className="EditFeature"
              options={FEATUREOPTIONS.filter(
                (item) => item.value !== POWERSUPPLY && item.value !== TRANSFORMERSUBSTATION
              )}
              onChange={searchEquipmentType}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<SearchOutlined />}
        className={styles.toolbarBtn}
        style={{
          right: drawToolbarVisible || pageDrawState ? '398px' : '20px',
        }}
        onClick={() => setToolbalHasShow(!toolbalHasShow)}
      />
    </>
  )
}
export default Toolbar
