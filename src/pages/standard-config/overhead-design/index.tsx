import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { Button, message } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'
import CommonTitle from '@/components/common-title'
import UrlSelect from '@/components/url-select'
import OverHeadDesignTab from './components/overHeadDesign-tab'
import { ImportOutlined } from '@ant-design/icons'
import ImportOverheadModal from './components/import-form'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'

interface libParams {
  libId: string
}

const OverheadDesign: React.FC<libParams> = (props) => {
  const { libId } = props
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [importOverheadVisible, setImportOverheadVisible] = useState<boolean>(false)
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

  const importOverheadDesignEvent = () => {
    // if (!resourceLibId) {
    //   message.error('请先选择资源库');
    //   return;
    // }
    setImportOverheadVisible(true)
  }

  return (
    // <PageCommonWrap noPadding={true}>
    <>
      <div className={styles.overHeadDesign}>
        <div className={styles.overHeadTable}>
          <div className="flex">
            <div className="flex1 flex">
              <CommonTitle>架空设计</CommonTitle>
            </div>
            <div>
              {buttonJurisdictionArray?.includes('modules-import') && (
                <Button className="mr7" onClick={() => importOverheadDesignEvent()}>
                  <ImportOutlined />
                  导入(杆型+模块)
                </Button>
              )}
            </div>
          </div>
          <OverHeadDesignTab libId={libId} />
        </div>
      </div>
      <ImportOverheadModal
        libId={libId}
        requestSource="resource"
        visible={importOverheadVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportOverheadVisible}
      />
      {/* </PageCommonWrap> */}
    </>
  )
}

export default OverheadDesign
