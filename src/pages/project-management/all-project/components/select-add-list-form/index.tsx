import React, { FC, useState } from 'react'
import CyFormItem from '@/components/cy-form-item'
import { Button, Dropdown, Input, message } from 'antd'

import {
  queryOuterAuditUserByPhoneAndUsername,
  UserInfo,
} from '@/services/project-management/select-add-list-form'
import styles from './index.less'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useBoolean, useRequest } from 'ahooks'
const { Search } = Input
export interface SelectAddListFormProps {
  initPeople?: UserInfo[] | undefined[]
  projectName?: string
  onChange?: (userInfoList: UserInfo[]) => void
  notArrangeShow?: boolean //checkbox的标志用来是否显示不安排外审的内容
  onSetPassArrangeStatus?: (flag: boolean) => void //获取外审通不通过状态的callback
  isAdd?: boolean
}

const SelectAddListForm: FC<SelectAddListFormProps> = (props) => {
  const {
    // initPeople = [],
    // notArrangeShow = false,
    // onSetPassArrangeStatus,
    projectName,
    isAdd,
    onChange,
  } = props

  // const debounceTimeout = 800;
  // const [fetching, setFetching] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>()
  const [people, setPeople] = useState<UserInfo[]>([])
  const [visible, { setTrue, setFalse }] = useBoolean(false)

  /**
   * 获取外审人员
   */
  const { data, run, loading } = useRequest(() => queryOuterAuditUserByPhoneAndUsername(keyword), {
    manual: true,
    onSuccess: () => {
      if (data) {
        setTrue()
        setOptions([data])
      } else {
        message.warn('账号不存在！请重新输入')
      }
    },
  })

  // useEffect(() => {
  //   setPeople(initPeople);
  //   onChange?.(initPeople);
  // }, [JSON.stringify(initPeople)]);

  const onPepleAdd = (p: UserInfo) => {
    setFalse()
    setPeople([...people.filter((v) => v?.value !== p?.value), p])
    onChange?.([...people.filter((v) => v?.value !== p?.value), p])
  }

  const onPeopleDelete = (p: UserInfo) => {
    setPeople([...people.filter((v) => v?.value !== p?.value)])
    onChange?.([...people.filter((v) => v?.value !== p?.value)])
  }
  const [options, setOptions] = useState<
    {
      text: string
      value: string
    }[]
  >([])

  const OptionList = () => {
    return (
      <div className={styles.optionList}>
        {options.length ? (
          options.map((option) => {
            return (
              <div className={styles.optionItem} key={option?.value}>
                <div className={styles.itemText} style={{ paddingTop: '5px' }}>
                  {option?.text}
                </div>

                <div className={styles.icon}>
                  <Button
                    type="link"
                    onClick={() => onPepleAdd(option)}
                    shape="circle"
                    icon={<PlusCircleOutlined style={{ color: '#0076FF' }} />}
                  >
                    <span style={{ color: '#0076FF' }}>添加</span>
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div>无内容，请先搜索</div>
        )}
      </div>
    )
  }

  const AddPeople = () => {
    return (
      <div className={styles.people}>
        {people.map((p, idx) => (
          <div className={styles.person} key={p?.value}>
            <div className={styles.itemText} style={{ paddingTop: '5px' }}>
              {p?.text}
            </div>
            <div className={styles.icon}>
              <Button
                type="link"
                onClick={() => onPeopleDelete(p)}
                shape="circle"
                icon={<DeleteOutlined style={{ color: 'red' }} />}
              >
                <span style={{ color: 'red' }}>删除</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // const onSetNotArrangePeopleStatus = (notArrangeStatus: boolean) => {
  //   onSetPassArrangeStatus?.(notArrangeStatus);
  //   setNotArrangePeopleStatus(notArrangeStatus);
  // };

  return (
    <div className={styles.selectForm}>
      <CyFormItem
        label={isAdd ? '添加人员' : '账号'}
        className={styles.account}
        name="outerAuditUsers"
      >
        <Dropdown overlay={<OptionList />} visible={visible}>
          <Search
            id="hover-div"
            placeholder="请输入账号/手机号"
            enterButton
            loading={loading}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => run()}
          />
        </Dropdown>
      </CyFormItem>
      {isAdd ? (
        ''
      ) : (
        <>
          <div className={styles.title}>外审人员列表</div>
          <AddPeople />
        </>
      )}

      {/* {notArrangeShow && projectName ? (
        <>
          <Divider />
          <div className={styles.notArrange}>
            <p style={{ textAlign: 'center' }}>请确认项目：{projectName}是否通过外审</p>
            <Radio.Group
              onChange={(e) => onSetNotArrangePeopleStatus(e.target.value)}
              value={notArrangePeopleStatus}
            >
              <Radio value={false}>外审不通过</Radio>
              <Radio value={true}>外审通过</Radio>
            </Radio.Group>
          </div>
        </>
      ) : null} */}
    </div>
  )
}

export default SelectAddListForm
