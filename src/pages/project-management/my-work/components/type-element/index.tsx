import CommonTitle from '@/components/common-title'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'
import TypeTab from '../type-tab'
import styles from './index.less'

interface TypeElementProps {
  typeArray: any[]
}

const TypeElement: React.FC<TypeElementProps> = (props) => {
  const { typeArray } = props
  return (
    <div className={styles.typeElement}>
      {typeArray && typeArray.length === 1 && (
        <CommonTitle>
          {typeArray[0].label}({typeArray[0].number})
          {typeArray[0].id === 'agent' && (
            <Tooltip
              title="在当前列表中可以查看所属公司被其他单位委托的项目，并且可以将该项目获取至当前个人账号项目列表"
              placement="right"
            >
              <QuestionCircleOutlined style={{ paddingLeft: 7, fontSize: 13 }} />
            </Tooltip>
          )}
        </CommonTitle>
      )}
      {typeArray && typeArray.length > 1 && <TypeTab typeArray={typeArray} />}
    </div>
  )
}

export default TypeElement
