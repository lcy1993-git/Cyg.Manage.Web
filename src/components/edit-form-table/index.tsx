import { Form } from 'antd'
import React from 'react'
import styles from './index.less'
import uuid from 'node-uuid'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'

interface EditFormTableProps {
  formName: string
  columns: any[]
}

const EditFormTable: React.FC<EditFormTableProps> = (props) => {
  const { formName, columns } = props

  const theadElement = columns.map((item) => {
    return (
      <th key={uuid.v1()} style={{ width: item.width ? `${item.width}px` : '' }}>
        {item.title}
      </th>
    )
  })

  return (
    <div className={styles.editFormTable}>
      <Form.List name={formName} initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>序号</th>
                  {theadElement}
                  <th style={{ width: '60px' }}>
                    <span
                      className="mr7"
                      onClick={() => add()}
                      style={{ cursor: 'pointer', color: '#0E7B3B' }}
                    >
                      <PlusOutlined style={{ paddingRight: '8px' }} />
                      添加
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  return (
                    <tr key={field.key}>
                      <td>{index + 1}</td>
                      {columns.map((ite) => {
                        return (
                          <td key={`${field.key}_${ite.dataIndex}`}>
                            <Form.Item
                              {...field}
                              rules={ite.rules}
                              name={[field.name, ite.dataIndex]}
                              fieldKey={[field.fieldKey, ite.dataIndex]}
                            >
                              {ite.render?.(index)}
                            </Form.Item>
                          </td>
                        )
                      })}
                      <td>
                        {fields.length > 1 && (
                          <span
                            onClick={() => remove(field.name)}
                            style={{
                              color: '#FF0000',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            删除
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}
      </Form.List>
    </div>
  )
}

export default EditFormTable
