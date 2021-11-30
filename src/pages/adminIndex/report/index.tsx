import React, { Key, useEffect, useRef, useState } from 'react'
import WrapperComponent from '@/components/page-common-wrap'
import styles from './index.less'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import Tree from 'antd/lib/tree'
import { CarryOutOutlined } from '@ant-design/icons'
import ReportDetail from '@/pages/adminIndex/report/child/reportDetail'
import { useMount } from 'ahooks'
// import {optionConfig} from "@/pages/adminIndex/report/child/reportDetail/optionCofig";

const AdminIndex: React.FC = () => {
  const [options, setOptions] = useState<Key>('allAll')
  const [title, setTitle] = useState<string>('所有事件报表')
  const treeData = [
    {
      title: '所有事件',
      key: 'all-parent',
      children: [
        {
          title: '所有事件报表',
          key: 'allAll',
          children: [],
        },
        {
          title: '系统事件报表',
          key: 'allSystem',
        },
        {
          title: '业务事件报表事件',
          key: 'allBusiness',
        },
      ],
    },
    {
      title: '系统事件',
      key: 'sys-parent',
      children: [
        {
          title: '登录报表',
          key: 'sysLogin',
        },
        {
          title: '退出登录报表',
          key: 'sysExitLogin',
        },
        {
          title: '账号状态修改报表',
          key: 'sysChangingAccountStatus',
        },
        {
          title: '账号密码修改报表',
          key: 'sysChangingPasswordStatus',
        },
        {
          title: '文件传输报表',
          key: 'sysFileTransfer',
        },
        {
          title: '连接超时报表',
          key: 'sysConnectionTimeout',
        },
      ],
    },
    {
      title: '业务事件',
      key: 'business-parent',
      children: [
        {
          title: '项目数据修改报表',
          key: 'businessProjectDataChange',
        },
        {
          title: '项目流程变化报表',
          key: 'businessProjectFlowChange',
        },
      ],
    },
  ]
  const onSelect = (
    key: Key[],
    e: {
      node: {
        children: { title: React.SetStateAction<string> }[]
        title: React.SetStateAction<string>
      }
    }
  ) => {
    if (key[0]?.includes('parent')) {
      setOptions(e.node.children[0]?.key)
      setTitle(e.node.children[0]?.title)
    } else {
      setOptions(key[0])
      setTitle(e.node.title)
    }
  }
  return (
    <WrapperComponent noColor={true} noPadding={true}>
      <div className={styles.reportBox}>
        <div className={styles.leftSide}>
          <div className={styles.leftSideTitle}>所有事件</div>
          <div className={styles.leftSideTree}>
            <Tree
              showLine={{ showLeafIcon: false }}
              showLeafIcon={false}
              showIcon={false}
              defaultExpandedKeys={['0-0-0']}
              onSelect={onSelect}
              defaultSelectedKeys={['allAll']}
              defaultExpandAll={true}
              treeData={treeData}
            />
          </div>
        </div>
        <div className={styles.rightSide}>
          {options !== '' && <ReportDetail title={title} options={options} />}
        </div>
      </div>
    </WrapperComponent>
  )
}

export default AdminIndex
