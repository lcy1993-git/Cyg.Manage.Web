import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
// import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, message } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'
import CommonTitle from '@/components/common-title'
import UrlSelect from '@/components/url-select'
import CableDesignTab from './components/cableDesign-tab'
import { ImportOutlined } from '@ant-design/icons'
import ImportCableModal from './components/import-form'

import { useGetButtonJurisdictionArray } from '@/utils/hooks'

interface libParams {
  libId: string
}

const CableDesign: React.FC<libParams> = (props) => {
  const { libId } = props
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [importCableVisible, setImportCableVisible] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  //选择资源库传libId
  const searchByLib = (value: any) => {
    setResourceLibId(value)
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        libId: value,
      })
    }
  }

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const uploadFinishEvent = () => {
    refresh()
  }

  const importCableDesignEvent = () => {
    // if (!resourceLibId) {
    //   message.error('请先选择资源库');
    //   return;
    // }
    setImportCableVisible(true)
  }

  return (
    // <PageCommonWrap noPadding={true}>
    <>
      <div className={styles.cableDesign}>
        <div className={styles.cableTable}>
          <div className="flex">
            <div className="flex1 flex">
              <CommonTitle>电缆设计</CommonTitle>
            </div>
            <div>
              {buttonJurisdictionArray?.includes('cable-design-import') && (
                <Button className="mr7" onClick={() => importCableDesignEvent()}>
                  <ImportOutlined />
                  导入(电缆井+电缆通道)
                </Button>
              )}
            </div>
          </div>
          <CableDesignTab libId={libId} />
        </div>
      </div>
      <ImportCableModal
        libId={libId}
        requestSource="resource"
        visible={importCableVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportCableVisible}
      />
      {/* </PageCommonWrap> */}
    </>
  )
}

export default CableDesign
