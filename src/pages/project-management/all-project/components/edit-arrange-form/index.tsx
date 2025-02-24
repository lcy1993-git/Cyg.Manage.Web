import CyFormItem from '@/components/cy-form-item'
import { getGroupInfo } from '@/services/project-management/all-project'
// import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { TreeSelect } from 'antd'
import uuid from 'node-uuid'
import React from 'react'
// import styles from './index.less'

interface EditArrangeFormProps {
  allotCompanyId?: string | undefined
  canEdit?: any
  dataSourceType?: number
}

const EditArrangeForm: React.FC<EditArrangeFormProps> = (props) => {
  const { allotCompanyId = '', canEdit, dataSourceType } = props
  const {
    canEditDesign,
    canEditSurvey,
    // canEditCost,
    // canEditDesignAssessUser1,
    // canEditDesignAssessUser2,
    // canEditDesignAssessUser3,
    // canEditDesignAssessUser4,
    // canEditCostAuditUser1,
    // canEditCostAuditUser2,
    // canEditCostAuditUser3,
  } = canEdit
  // const [isInternalAudit, setIsInternalAudit] = useState<boolean>(false)
  const isOpenReview = localStorage.getItem('isOpenReview')
  const notEdit = (function notChangeData() {
    return [
      {
        value: 'not_modify',
        title: '无需修改',
        children: null ?? [],
      },
    ]
  })()

  const { data: surveyData = [], loading: surveyLoading } = useRequest(
    () => getGroupInfo('68', allotCompanyId),
    {
      refreshDeps: [allotCompanyId],
    }
  )

  const { data: designData = [], loading: designLoading } = useRequest(
    () => getGroupInfo('8', allotCompanyId),
    {
      refreshDeps: [allotCompanyId],
    }
  )

  // const { data: auditData = [], loading: auditLoading } = useRequest(
  //   () => getGroupInfo('16', allotCompanyId),
  //   {
  //     refreshDeps: [allotCompanyId],
  //   }
  // )

  // const { data: costUserData = [], loading: costLoading } = useRequest(
  //   () => getGroupInfo('32', allotCompanyId),
  //   {
  //     refreshDeps: [allotCompanyId],
  //   }
  // )

  const mapTreeData = (data: any) => {
    if (data.children && data.children.length > 0) {
      return {
        title: data.text,
        value: data.id,
        key: uuid.v1(),
        disabled: true,
        children: data.children ? data.children.map(mapTreeData) : [],
      }
    }
    return {
      title: data.text,
      value: data.id,
      key: uuid.v1(),
      children: data.children ? data.children.map(mapTreeData) : [],
    }
  }

  return (
    <>
      {canEditSurvey && dataSourceType === 0 ? (
        <CyFormItem label="勘察" name="surveyUser" required>
          <TreeSelect
            key="editSurveyUser"
            style={{ width: '100%' }}
            loading={surveyLoading}
            treeData={notEdit.concat(surveyData.map(mapTreeData))}
            placeholder="请选择"
            treeDefaultExpandAll
            allowClear
            showSearch
            treeNodeFilterProp="title"
          />
        </CyFormItem>
      ) : dataSourceType === 2 ? (
        <CyFormItem label="勘察" name="surveyUser" required>
          <TreeSelect
            loading={surveyLoading}
            key="editSurveyUser"
            style={{ width: '100%' }}
            treeData={surveyData.map(mapTreeData)}
            placeholder="“免勘察”项目，免安排勘察人员"
            treeDefaultExpandAll
            disabled
          />
        </CyFormItem>
      ) : dataSourceType === -1 ? (
        <CyFormItem label="勘察" name="surveyUser" required>
          <TreeSelect
            disabled
            loading={surveyLoading}
            key="editSurveyUser"
            style={{ width: '100%' }}
            treeData={surveyData.map(mapTreeData)}
            placeholder="免安排勘察人员"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
      ) : (
        <CyFormItem label="勘察" name="surveyUser" required>
          <TreeSelect
            disabled
            loading={surveyLoading}
            key="editSurveyUser"
            style={{ width: '100%' }}
            treeData={surveyData.map(mapTreeData)}
            placeholder="“导入”项目，免安排勘察人员"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
      )}

      {canEditDesign ? (
        <CyFormItem label="设计" name="designUser" required>
          <TreeSelect
            key="editDesignUser"
            loading={designLoading}
            style={{ width: '100%' }}
            treeData={notEdit.concat(designData.map(mapTreeData))}
            placeholder="请选择"
            treeDefaultExpandAll
            allowClear
            showSearch
            treeNodeFilterProp="title"
          />
        </CyFormItem>
      ) : (
        <CyFormItem label="设计" name="designUser" required>
          <TreeSelect
            disabled
            key="editDesignUser"
            loading={designLoading}
            style={{ width: '100%' }}
            treeData={designData.map(mapTreeData)}
            placeholder="请选择"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
      )}
      {/* {Number(isOpenReview) === 1 && (
        <>
          {canEditCost ? (
            <CyFormItem label="造价" name="costUser">
              <TreeSelect
                key="editCostUser"
                loading={costLoading}
                style={{ width: '100%' }}
                treeData={notEdit.concat(costUserData.map(mapTreeData))}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
                showSearch
                treeNodeFilterProp="title"
              />
            </CyFormItem>
          ) : (
            <CyFormItem label="造价" name="costUser">
              <TreeSelect
                disabled
                loading={costLoading}
                key="editCostUser"
                style={{ width: '100%' }}
                treeData={costUserData.map(mapTreeData)}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
              />
            </CyFormItem>
          )}
        </>
      )} */}

      {/* 继续安排审核 */}
      {Number(isOpenReview) === 1 && (
        <>
          {/* <div className={styles.continueAudit}>
            <div
              className={styles.internalTitle}
              onClick={() => setIsInternalAudit(!isInternalAudit)}
            >
              继续修改审核人员
            </div>
            <div>{isInternalAudit ? <UpOutlined /> : <DownOutlined />}</div>
          </div> */}
          {/* <div style={{ display: isInternalAudit ? 'block' : 'none' }}> */}
          {/* 设计内审 */}
          {/* <Divider>
              <span className={styles.divider}>设计校审</span>
            </Divider> */}
          {/* {canEditDesignAssessUser1 ? (
            <CyFormItem label="校对" name="designAssessUser1">
              <TreeSelect
                key="editDesignAssessUser1"
                style={{ width: '100%' }}
                loading={auditLoading}
                treeData={notEdit.concat(auditData.map(mapTreeData))}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
                showSearch
                treeNodeFilterProp="title"
              />
            </CyFormItem>
          ) : (
            <CyFormItem label="校对" name="designAssessUser1">
              <TreeSelect
                disabled
                key="editDesignAssessUser1"
                style={{ width: '100%' }}
                loading={auditLoading}
                treeData={auditData.map(mapTreeData)}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
              />
            </CyFormItem>
          )} */}

          {/* {canEditDesignAssessUser2 ? (
            <CyFormItem label="校核" name="designAssessUser2">
              <TreeSelect
                key="editDesignAssessUser2"
                style={{ width: '100%' }}
                loading={auditLoading}
                treeData={notEdit.concat(auditData.map(mapTreeData))}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
                showSearch
                treeNodeFilterProp="title"
              />
            </CyFormItem>
          ) : (
            <CyFormItem label="校核" name="designAssessUser2">
              <TreeSelect
                disabled
                key="editDesignAssessUser2"
                loading={auditLoading}
                style={{ width: '100%' }}
                treeData={auditData.map(mapTreeData)}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
              />
            </CyFormItem>
          )}
          {canEditDesignAssessUser3 ? (
            <CyFormItem label="审核" name="designAssessUser3">
              <TreeSelect
                key="editDesignAssessUser3"
                loading={auditLoading}
                style={{ width: '100%' }}
                treeData={notEdit.concat(auditData.map(mapTreeData))}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
                showSearch
                treeNodeFilterProp="title"
              />
            </CyFormItem>
          ) : (
            <CyFormItem label="审核" name="designAssessUser3">
              <TreeSelect
                disabled
                loading={auditLoading}
                key="editDesignAssessUser3"
                style={{ width: '100%' }}
                treeData={auditData.map(mapTreeData)}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
              />
            </CyFormItem>
          )}

          {canEditDesignAssessUser4 ? (
            <CyFormItem label="审定" name="designAssessUser4">
              <TreeSelect
                key="editDesignAssessUser4"
                loading={auditLoading}
                style={{ width: '100%' }}
                treeData={notEdit.concat(auditData.map(mapTreeData))}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
                showSearch
                treeNodeFilterProp="title"
              />
            </CyFormItem>
          ) : (
            <CyFormItem label="审定" name="designAssessUser4">
              <TreeSelect
                disabled
                key="editDesignAssessUser4"
                loading={auditLoading}
                style={{ width: '100%' }}
                treeData={auditData.map(mapTreeData)}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
              />
            </CyFormItem>
          )} */}
          {/* 造价内审 */}
          {/* <Divider>
          <span className={styles.divider}>造价校审</span>
        </Divider>
        {canEditCostAuditUser1 ? (
          <CyFormItem label="校核" name="costAuditUser1">
            <TreeSelect
              key="editCostAuditUser1"
              style={{ width: '100%' }}
              treeData={notEdit.concat(auditData.map(mapTreeData))}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        ) : (
          <CyFormItem label="校核" name="costAuditUser1">
            <TreeSelect
              disabled
              key="editCostAuditUser1"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        )}

        {canEditCostAuditUser2 ? (
          <CyFormItem label="审核" name="costAuditUser2">
            <TreeSelect
              key="editCostAuditUser2"
              style={{ width: '100%' }}
              treeData={notEdit.concat(auditData.map(mapTreeData))}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        ) : (
          <CyFormItem label="审核" name="costAuditUser2">
            <TreeSelect
              disabled
              key="editCostAuditUser2"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        )}
        {canEditCostAuditUser3 ? (
          <CyFormItem label="批准" name="costAuditUser3">
            <TreeSelect
              key="editCostAuditUser3"
              style={{ width: '100%' }}
              treeData={notEdit.concat(auditData.map(mapTreeData))}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        ) : (
          <CyFormItem label="批准" name="costAuditUser3">
            <TreeSelect
              disabled
              key="editCostAuditUser3"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        )} */}
          {/* </div> */}
        </>
      )}
    </>
  )
}

export default EditArrangeForm
