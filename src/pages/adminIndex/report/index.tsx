import React, { Key, useState } from 'react'
import WrapperComponent from '@/components/page-common-wrap'
import styles from './index.less'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import Tree from 'antd/lib/tree'
import ReportDetail from '@/pages/adminIndex/report/child/reportDetail'
import { history } from 'umi'
import useMount from 'ahooks/lib/useMount'

const AdminIndex: React.FC = () => {
  const [options, setOptions] = useState<Key>('')
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('所有事件报表')
  const [value, setValue] = useState<string[]>([])
  const treeData = [
    {
      title: '所有事件',
      key: 'all-parent',
      children: [
        {
          title: '所有事件报表',
          key: 'allAll',
          children: [],
          id: '11',
        },
        {
          title: '系统事件报表',
          key: 'allSystem',
          id: '12',
        },
        {
          title: '业务事件报表',
          key: 'allBusiness',
          id: '13',
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
          id: '1',
        },
        {
          title: '退出登录报表',
          key: 'sysExitLogin',
          id: '2',
        },
        {
          title: '账号状态修改报表',
          key: 'sysChangingAccountStatus',
          id: '3',
        },
        {
          title: '账号密码修改报表',
          key: 'sysChangingPasswordStatus',
          id: '4',
        },
        {
          title: '文件传输报表',
          key: 'sysFileTransfer',
          id: '5',
        },
        {
          title: '连接超时报表',
          key: 'sysConnectionTimeout',
          id: '6',
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
          id: '7',
        },
        {
          title: '项目流程变化报表',
          key: 'projectProcessChanges',
          id: '8',
        },
        {
          title: '项目变动报表',
          key: 'projectChangeReport',
          id: '9',
        },
        {
          title: '资源库变动报表',
          key: 'resourceLibraryChange',
          id: '10',
        },
      ],
    },
  ]
  const onSelect = (
    key: Key[],
    e: {
      node: {
        id: string
        children: {
          id: string
          title: React.SetStateAction<string>
        }[]
        title: React.SetStateAction<string>
      }
    }
  ) => {
    // @ts-ignore
    if (key[0]?.includes('parent')) {
      history.push(`/admin-index/report/${e.node.children[0]?.id}`)
      // setId(e.node.children[0]?.id)
      // updateChart(e.node.children[0]?.id)
      // setValue([e.node.children[0]?.key])
    } else {
      history.push(`/admin-index/report/${e.node.id}`)
      // setId(e.node.id)
      // updateChart(e.node.id)
      // setValue([e.node.key])
    }
  }
  const updateChart = (eventType: string) => {
    let val = {
      key: '',
      title: '',
      id: '',
    }
    if (['13', '11', '12'].includes(eventType)) {
      // 所有事件
      treeData[0].children.map((item) => {
        if (item.id === eventType) {
          val = item
        }
        return null
      })
    } else {
      // 其他事件
      treeData.map((item) => {
        item.children.map((child) => {
          if (child.id === eventType) {
            val = child
          }
          return null
        })
        return null
      })
    }
    setOptions(val?.key || 'allAll')
    setTitle(val?.title || '所有事件')
    setId(val?.id || '所有事件')
    setValue([val?.key || 'allAll'])
  }
  useMount(() => {
    let str = window.location.pathname.split('/')[3]
    if (str) {
      updateChart(str)
    } else {
      updateChart('11')
    }
  })
  return (
    <WrapperComponent noColor={true} noPadding={true}>
      <div className={styles.reportBox}>
        <div className={styles.leftSide}>
          <div className={styles.leftSideTitle}>所有事件</div>
          <div className={styles.leftSideTree}>
            {options !== '' && (
              <Tree
                showLine={{ showLeafIcon: false }}
                showLeafIcon={false}
                showIcon={false}
                // @ts-ignore
                onSelect={onSelect}
                selectedKeys={value}
                defaultSelectedKeys={[options]}
                defaultExpandAll={true}
                treeData={treeData}
              />
            )}
          </div>
        </div>
        <div className={styles.rightSide}>
          {options !== '' && <ReportDetail title={title} options={options} id={id} />}
        </div>
      </div>
    </WrapperComponent>
  )
}

export default AdminIndex
