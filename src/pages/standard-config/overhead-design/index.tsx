import CommonTitle from '@/components/common-title'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import React, { useState } from 'react'
import ImportOverheadModal from './components/import-form'
import OverHeadDesignTab from './components/overHeadDesign-tab'
import { OverHeadProvider } from './context'
import styles from './index.less'

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
              {/* {buttonJurisdictionArray?.includes('category-and-pole-import') && (
                <Button className="mr7" onClick={() => importOverheadDesignEvent()}>
                  <ImportOutlined />
                  导入(分类+杆型)
                </Button>
              )} */}
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
