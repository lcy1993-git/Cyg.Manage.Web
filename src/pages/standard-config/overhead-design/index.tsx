import { Button } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'
import CommonTitle from '@/components/common-title'
import OverHeadDesignTab from './components/overHeadDesign-tab'
import { ImportOutlined } from '@ant-design/icons'
import ImportOverheadModal from './components/import-form'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { OverHeadProvider } from './context'

interface libParams {
  libId: string
}

const OverheadDesign: React.FC<libParams> = (props) => {
  const { libId } = props
  const [importOverheadVisible, setImportOverheadVisible] = useState<boolean>(false)
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()
  const [isRefresh, setIsRefresh] = useState<boolean>(false)
  // const { refresh } = useOverHeadStore()

  const importOverheadDesignEvent = () => {
    setImportOverheadVisible(true)
  }

  return (
    // <PageCommonWrap noPadding={true}>
    <OverHeadProvider value={{ isRefresh, setIsRefresh }}>
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
        onChange={setImportOverheadVisible}
      />
      {/* </PageCommonWrap> */}
    </OverHeadProvider>
  )
}

export default OverheadDesign
