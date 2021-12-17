import React from 'react'
import styles from './index.less'

interface CheckMergeTableProps {
  formName?: string
  columns?: any[]
}

const CheckMergeTable: React.FC<CheckMergeTableProps> = () => {
  //   const { formName, columns } = props

  //   const mergeColumns = [
  //     {
  //       dataIndex: 'engineerName',
  //       index: 'engineerName',
  //       title: '目标项目',
  //       width: 300,
  //       //   onCell: () => {
  //       //     return {
  //       //       style: {
  //       //         overflow: 'hidden',
  //       //         whiteSpace: 'nowrap' as 'nowrap',
  //       //         textOverflow: 'ellipsis',
  //       //       },
  //       //     }
  //       //   },
  //     },
  //     {
  //       dataIndex: 'project',
  //       index: 'project',
  //       title: '当前项目',
  //       width: 300,
  //     },
  //     {
  //       dataIndex: 'project',
  //       index: 'project',
  //       title: '结果',
  //     },
  //   ]

  return (
    <div className={styles.editFormTable}>
      <table>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>校验条目</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>区域</td>
          </tr>
          <tr>
            <td>所属公司</td>
          </tr>
          <tr>
            <td>资源库</td>
          </tr>
          <tr>
            <td>协议库</td>
          </tr>
          <tr>
            <td>利旧库存协议</td>
          </tr>
          <tr>
            <td>现场数据来源</td>
          </tr>
          <tr>
            <td>交底范围（米）</td>
          </tr>
          <tr>
            <td>桩位范围（米）</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th style={{ width: '200px' }}>目标项目</th>
            <th style={{ width: '200px' }}>当前项目</th>
            <th style={{ width: '150px' }}>结果</th>
          </tr>
          <tr></tr>
          <tr></tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  )
}

export default CheckMergeTable
