import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import uuid from 'node-uuid'
import React from 'react'
import styles from './index.less'

interface EditFormTableProps {
  formName: string
  columns: any[]
  formData: any[]
}

const EditPropertyTable: React.FC<EditFormTableProps> = (props) => {
  const { formName, columns, formData } = props

  const theadElement = columns.map((item) => {
    return (
      <th key={uuid.v1()} style={{ width: item.width ? `${item.width}px` : '' }}>
        {item.title}
      </th>
    )
  })

  return (
    <div className={styles.editFormTable}>
      <Form.List name={formName} initialValue={formData}>
        {(fields, { remove, add, move }) => (
          <>
            <div className={styles.addBtnWrap}>
              <Button
                type="primary"
                className="mr7"
                onClick={() => {
                  add()
                }}
              >
                <PlusOutlined />
                添加
              </Button>
            </div>
            <table>
              <thead>
                <tr>{theadElement}</tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  return (
                    <tr key={field.key}>
                      {columns.map((ite) => {
                        if (ite.dataIndex === 'operation') {
                          return (
                            <div className={styles.deleteBtnWrap}>
                              <DeleteOutlined
                                onClick={() => {
                                  remove(index)
                                }}
                              />
                            </div>
                          )
                        } else {
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
                        }
                      })}
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

export default EditPropertyTable
