import PageCommonWrap from '@/components/page-common-wrap'
import React, { useEffect, useState } from 'react'
import FileDocxView from '@/components/api-file-view/componnents/file-docx-view'
import { downLoadFileItem } from '@/services/operation-config/company-file'
import { Modal } from 'antd'
// import { testGet } from '@/services/backstage-config/visual-config'
const Test = () => {
  const [data, setData] = useState(null)
  const [visible, setVisible] = useState<boolean>(true)
  // useEffect(() => {
  //   downLoadFileItem({ fileId: '1522494038355251200' }).then((res) => {
  //     setData(res)
  //   })
  // }, [])

  // useEffect(() => {
  //   testGet()
  // })

  return (
    <PageCommonWrap noPadding>
      {/* <Modal
        maskClosable={false}
        title="项目成果"
        width="90%"
        destroyOnClose
        onCancel={() => setVisible(false)}
        visible={visible}
        bodyStyle={{ padding: '60px', overflowY: 'auto', height: '750px' }}
        footer={null}
      >
        <FileDocxView data={data} />
      </Modal> */}
    </PageCommonWrap>
  )
}

export default Test
