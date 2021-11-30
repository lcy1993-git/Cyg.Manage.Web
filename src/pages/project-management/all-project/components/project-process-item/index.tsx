import CyTag from '@/components/cy-tag'
import moment from 'moment'
import uuid from 'node-uuid'
import React from 'react'
import { OperateLog } from '@/services/project-management/all-project'
import styles from './index.less'
import { useMemo } from 'react'

interface JSONData {
  Key: string
  Value: any
}

const getValueByName = (name: string, data: JSONData[]) => {
  return data?.find((item) => item.Key === name)?.Value || ''
}

const getCompanyName = (data: JSONData[], category: number) => {
  if (category === 2) {
    // 项目委托情况
    return getValueByName('user_company_name', data)
  } else if (category === 51 || category === 50) {
    // 项目工作交接 作业任务 项目管理

    return getValueByName('company', data)?.Text
  }
  return (
    data?.find((item) => item.Key === 'company_name')?.Value ||
    data?.find((item) => item.Key === 'source_company_name')?.Value ||
    ''
  )
}

const getAllotUsers = (data: JSONData[]) => {
  return data?.find((item) => item.Key === 'allot_users')?.Value
}

const getHandover = (data: JSONData[]) => {
  return data?.find((item) => item.Key === 'identitys')?.Value
}

const getCompanyNameByShare = (data: JSONData[]) => {
  return data?.find((item) => item.Key === 'target_company_name')?.Value
}

const getCompanyGroupName = (data: JSONData[]) => {
  return data?.find((item) => item.Key === 'company_group_admin_name')?.Value
}

const ProjectProcessItem: React.FC<OperateLog> = ({
  date,
  category,
  operationCategory,
  createdByName,
  content,
  operator,
}) => {
  const usersElement = (allotUsers: any[]) =>
    allotUsers?.map(({ Value, Text }, index) => {
      return (
        <>
          {(index & 1) === 0 && <div className={styles.nextRow} />}
          <div className={styles.userItem} key={uuid.v1()}>
            <div className={styles.userItemLabel}>{Value}</div>
            <div className={styles.userItemContent}>
              <CyTag className="mr7" key={uuid.v1()}>
                {Text}
              </CyTag>
            </div>
          </div>
        </>
      )
    })

  const handoverElement = (handover: any[]) => {
    return handover.map((item) => {
      return (
        <>
          <div className={styles.userItem} key={uuid.v1()}>
            <div className={styles.userItemLabel}>{item.Key}</div>
            <div className={styles.userItemContent}>
              <CyTag className="mr7" key={uuid.v1()}>
                {item?.Value?.Handover?.Text}
              </CyTag>
              <span className={styles.gtRight}>&gt;&gt;</span>

              <CyTag className="mr7" key={uuid.v1()}>
                {item?.Value?.Receive?.Text}
              </CyTag>
            </div>
          </div>
          <div />
        </>
      )
    })
  }

  const jsonData: JSONData[] = JSON.parse(content)

  const allotUsers = getAllotUsers(jsonData)

  const handover = getHandover(jsonData)

  getCompanyGroupName(jsonData)

  const targetName = useMemo(() => {
    if (category === 3) {
      return getValueByName('company_group_name', jsonData)
    } else if (category === 2) {
      return getValueByName('company_name', jsonData)
    } else if (category === 51 || category === 50) {
      return false // 工作交接 作业任务 也应该为空
    } else if (category === 4) {
      // 安排部组成员这里应该为空
      return false
    } else if (category === 70) {
      return getValueByName('approve_user_name', jsonData)
    } else if (category === 71) {
      return getValueByName('receiver_user_name', jsonData)
    }
    return getCompanyNameByShare(jsonData) || getCompanyGroupName(jsonData)
  }, [content])

  const getOperator = (data: JSONData[], category: number) => {
    return operator
  }

  const remarkInfo = useMemo(() => {
    if (category === 70 || category === 72) {
      return getValueByName('remark', jsonData)
    }
    return
  }, [content])

  return (
    <div className={styles.projectProcessItem}>
      <div className={styles.projectProcessItemTime}>
        <div className={styles.time}>{date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ''}</div>

        <div className={styles.titleRightWrap}>{`${getCompanyName(
          jsonData,
          category
        )}-${getOperator(jsonData, category)}`}</div>
      </div>
      <div className={styles.projectProcessItemTitle}>
        <span className={styles.title}>{operationCategory}</span>
        {targetName && (
          <span>
            <b>&nbsp;&gt;&gt;&nbsp;{targetName}</b>
          </span>
        )}
      </div>
      <div className={styles.remarkInfo}>{remarkInfo && <span>{remarkInfo}</span>}</div>
      {Array.isArray(allotUsers) && (
        <div className={styles.usersInfo}>{usersElement(allotUsers)}</div>
      )}
      {category === 8 ? (
        <>
          <div className={styles.usersInfo}>
            <CyTag className="mr7">{createdByName}</CyTag>
          </div>
        </>
      ) : (
        ''
      )}
      {Array.isArray(handover) && (
        <div className={styles.usersInfo}>{handoverElement(handover)}</div>
      )}

      {
        // 工作交接-作业任务
        category === 51 && (
          <div className={styles.usersInfo}>
            {
              // @ts-ignore
              handoverElement(jsonData?.find((item) => item.Key === 'task')?.Value)
            }
          </div>
        )
      }
    </div>
  )
}

export default ProjectProcessItem
