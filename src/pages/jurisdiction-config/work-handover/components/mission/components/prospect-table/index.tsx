import React, { Dispatch, SetStateAction, useState } from 'react'
import { Checkbox } from 'antd'
import Recevier from '../../../recevier/index'
import EngineerTableList from '../../../engineer-table-list/index'

interface ProsepectTableParams {
  userId: string
  recevierId: string | undefined
  setReceiverName?: Dispatch<SetStateAction<string>>
  getReceiverId?: Dispatch<SetStateAction<string | undefined>>
  isFresh?: boolean
  doneFlag?: boolean
  setIsFresh?: Dispatch<SetStateAction<boolean>>
  getEngineerData?: Dispatch<SetStateAction<any[]>>
  getProjectIds?: Dispatch<SetStateAction<string[]>>
}

const ProspectTable: React.FC<ProsepectTableParams> = (props) => {
  const {
    userId,
    recevierId,
    getReceiverId,
    setReceiverName,
    getEngineerData,
    isFresh,
    doneFlag,
    setIsFresh,
    getProjectIds,
  } = props
  const [checkAllisChecked, setCheckAllisChecked] = useState<boolean>(false)
  const [checkAllisIndeterminate, setCheckAllisIndeterminate] = useState<boolean>(false)
  /**
   * @flag
   * 事件触发标识
   * @state
   *  0 表示无任何操作
   *  1 表示取消全选
   *  2 表示全选
   */
  const [emitAll, setEmitAll] = useState<{ flag: boolean; state: number }>({
    flag: false,
    state: 0,
  })

  const onAllChange = () => {
    setEmitAll({
      flag: !emitAll?.flag,
      state: !checkAllisChecked || checkAllisIndeterminate ? 2 : 1,
    })
  }

  return (
    <>
      <div style={{ padding: '20px' }}>
        <Checkbox
          checked={checkAllisChecked}
          indeterminate={checkAllisIndeterminate}
          onChange={onAllChange}
        >
          全选
        </Checkbox>
        <Recevier
          userId={userId}
          clientCategory={4}
          isCompanyGroupIdentity={false}
          receiverId={recevierId}
          changeVal={getReceiverId}
          setReceiverName={setReceiverName}
        />
      </div>
      {/* <div> */}
      <EngineerTableList
        doneFlag={doneFlag}
        fieldFlag={false}
        checkboxSet={true}
        getEngineerData={getEngineerData}
        userId={userId}
        category={2}
        isFresh={isFresh}
        setIsFresh={setIsFresh}
        getProjectIds={getProjectIds}
        emitAll={emitAll}
        setCheckAllisChecked={setCheckAllisChecked}
        setCheckAllisIndeterminate={setCheckAllisIndeterminate}
      />
      {/* </div> */}
    </>
  )
}

export default ProspectTable
