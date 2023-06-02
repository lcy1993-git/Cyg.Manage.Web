import FileUpload from '@/components/file-upload'
import {
  importQuotaRebarMapping,
  queryQuotaRebarMappingList,
} from '@/services/technology-economic/quota-library'
import { PlusOutlined } from '@ant-design/icons'
import { useBoolean, useRequest } from 'ahooks'
import { Button, message, Modal, Table } from 'antd'
import { useMemo, useState } from 'react'
const columns = [
  {
    dataIndex: 'quotaNo',
    key: 'quotaNo',
    title: '定额编号',
    width: 300,
  },
  {
    dataIndex: 'rebarMaterialNo',
    key: 'rebarMaterialNo',
    title: '钢筋编号',
    width: 160,
  },
]
const ReinforcementQuota = () => {
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false)
  const [triggerUploadFile] = useBoolean(false)
  const [file, setFile] = useState<any[]>([])
  const {
    data: catalogueList,
    loading,
    run: catalogueListRun,
  } = useRequest<any[]>(queryQuotaRebarMappingList)
  //添加
  const addEvent = () => {
    setUploadModalVisible(true)
  }
  const uploadFile = async () => {
    await importQuotaRebarMapping({ file: file }, {})
    message.success('上传成功')
    setUploadModalVisible(false)
    catalogueListRun()
  }
  const onChange = async (val: any) => {
    if (val.length !== 0) {
      setFile(val)
    } else {
      setFile([])
    }
  }
  const treeData = useMemo(() => {
    if (catalogueList && catalogueList.length > 0) {
      return catalogueList
    }
    return []
  }, [catalogueList])
  return (
    <div>
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '50px' }}
      >
        <Table dataSource={treeData} columns={columns} pagination={false} loading={loading} />
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          导入
        </Button>
      </div>

      <Modal
        visible={uploadModalVisible}
        title="导入-钢筋定额"
        width="30%"
        destroyOnClose={true}
        onCancel={() => setUploadModalVisible(false)}
        onOk={uploadFile}
      >
        <FileUpload
          accept=".xlsx"
          uploadFileBtn={false}
          trigger={triggerUploadFile}
          onChange={onChange}
          maxCount={1}
        />
      </Modal>
    </div>
  )
}
export default ReinforcementQuota
