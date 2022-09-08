import type { InputRef } from 'antd'
import { Form, Input, Table } from 'antd'
import type { FormInstance } from 'antd/es/form'
import React, {
  forwardRef,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import styles from './index.less'

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface Item {
  key: string
  name: string
  age: string
  address: string
}

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof Item
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {}
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

type EditableTableProps = Parameters<typeof Table>[0]

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>
interface TableCanEditCellProps {
  defaultColumns: any[]
  defaultResource: any[]
  rowKey?: string
}

const TableCanEditCell = (props: TableCanEditCellProps, ref: Ref<any>) => {
  const { defaultColumns, defaultResource, rowKey = 'id' } = props
  const [dataSource, setDataSource] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  useImperativeHandle(ref, () => ({
    getSelectedData: () => {
      return selectedRows
    },
    clearSelectedRows: () => {
      setSelectedRowKeys([])
      setSelectedRows([])
    },
  }))

  useEffect(() => {
    setDataSource(defaultResource)
  }, [defaultResource])

  const handleSave = (row: any) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row[rowKey] === item[rowKey])
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })
  const rowSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setSelectedRowKeys(
        selectedRows.map((item) => {
          return item[rowKey]
        })
      )
      setSelectedRows(selectedRows)
    },
  }

  return (
    <div className={styles.wrap}>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        rowSelection={{
          type: 'checkbox',
          columnWidth: '38px',
          selectedRowKeys,
          ...rowSelection,
        }}
        rowKey={rowKey}
        pagination={false}
      />
    </div>
  )
}

export default forwardRef(TableCanEditCell)
