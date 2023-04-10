import { useControllableValue } from 'ahooks'
import { Modal } from 'antd'
import { Tabs } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'

const { TabPane } = Tabs

interface StandingBookProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
}

const StandingBook: React.FC<StandingBookProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })

  return (
    <Modal
      maskClosable={false}
      bodyStyle={{ padding: '24px 24px 0' }}
      title="网架台账"
      width="60%"
      visible={state as boolean}
      destroyOnClose
      okText="确定"
      footer=""
      cancelText="取消"
      onCancel={() => setState(false)}
      //   onOk={() => sureEditPassword()}
    >
      <Tabs tabPosition="bottom">
        <TabPane tab="变电器" key="1">
          Content of Tab 1
        </TabPane>
        <TabPane tab="电源" key="2">
          Content of Tab 2
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab 3
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default StandingBook
