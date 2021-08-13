import React, { useMemo } from 'react';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tooltip } from 'antd';
import { useBoolean } from 'ahooks';
import { TableContext } from '../table-store';

import styles from './index.less';
import moment from 'moment';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import EmptyTip from '@/components/empty-tip';
import { useContext } from 'react';
import { useEffect } from 'react';
import { isNumber } from 'lodash';
export interface AddProjectValue {
  engineerId: string;
  areaId: string;
  company: string;
  companyName: string;
}

interface EngineerTableItemProps {
  projectInfo: any;
  columns: any[];
  onChange?: (checkedValue: TableItemCheckedInfo) => void;
  getClickProjectId: (clickProjectId: string) => void;
  addProject?: (needValue: AddProjectValue) => void;
  editEngineer?: (needValue: AddProjectValue) => void;
  // left: number;
  isOverflow: boolean;
  columnsWidth: number;
  contentWidth: number;
}
interface TableCheckedItemProjectInfo {
  id: string;
  isAllChecked: boolean;
  status?: any;
  name?: any;
  dataSourceType?: number[];
}

export interface TableItemCheckedInfo {
  projectInfo: TableCheckedItemProjectInfo;
  checkedArray: string[];
}

const EngineerTableItem: React.FC<EngineerTableItemProps> = (props) => {
  const [isFold, { toggle: foldEvent }] = useBoolean(false);

  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const { tableSelectData } = useContext(TableContext);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const {
    projectInfo = {},
    columns = [],
    onChange,
    getClickProjectId,
    addProject,
    editEngineer,
    isOverflow = false,
    columnsWidth,
    contentWidth,
  } = props;

  const valueList = useMemo(() => {
    if (projectInfo.projects) {
      return projectInfo.projects.map((item: any) => item.id);
    }
    return [];
  }, [JSON.stringify(projectInfo.projects)]);

  const checkboxChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < valueList.length);
    setCheckAll(list.length === valueList.length);

    onChange?.({
      projectInfo: {
        id: projectInfo.id,
        isAllChecked: list.length === valueList.length,
        status: projectInfo.projects
          .map((item: any) => {
            if (list.includes(item.id)) {
              return item.stateInfo;
            }
          })
          .filter(Boolean),
        name: projectInfo.projects
          .map((item: any) => {
            if (list.includes(item.id)) {
              return item.name;
            }
          })
          .filter(Boolean),
        dataSourceType: projectInfo.projects
          .map((item: any) => {
            if (list.includes(item.id)) {
              return item.dataSourceType;
            }
          })
          .filter((item: any) => isNumber(item)),
      },
      checkedArray: list as string[],
    });
  };

  const checkAllEvent = (e: any) => {
    setCheckedList(e.target.checked ? valueList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    onChange?.({
      projectInfo: {
        id: projectInfo.id,
        isAllChecked: e.target.checked,
        status: projectInfo.projects
          .map((item: any) => {
            if (valueList.includes(item.id)) {
              return item.stateInfo;
            }
          })
          .filter(Boolean),
        name: projectInfo.projects
          .map((item: any) => {
            if (valueList.includes(item.id)) {
              return item.name;
            }
          })
          .filter(Boolean),
        dataSourceType: projectInfo.projects
          .map((item: any) => {
            if (valueList.includes(item.id)) {
              return item.dataSourceType;
            }
          })
          .filter((item: any) => isNumber(item)),
      },
      checkedArray: e.target.checked ? valueList : [],
    });
  };

  const projectNameClickEvent = (projectId: string) => {
    getClickProjectId?.(projectId);
  };

  const addProjectEvent = () => {
    addProject?.({
      engineerId: projectInfo.id,
      areaId: projectInfo.province,
      company: projectInfo.company,
      companyName: projectInfo.company,
    });
  };

  const editEngineerEvent = () => {
    editEngineer?.({
      engineerId: projectInfo.id,
      areaId: projectInfo.province,
      company: projectInfo.company,
      companyName: projectInfo.company,
    });
  };

  const approvalFileEvent = () => {
    approvalEngineer?.({
      engineerId: projectInfo.id,
      areaId: projectInfo.province,
      company: projectInfo.company,
      companyName: projectInfo.company,
    });
  };

  const theadElement = useMemo(() => {
    return columns.map((item) => {
      return (
        <div
          className={`${styles.engineerTableTh} ${
            item.dataIndex === 'action' ? `${styles.actionTd} actionTdContent` : ''
          } ${item.dataIndex === 'status' ? `${styles.statusTd} statusTdContent` : ''} ${
            item.dataIndex === 'name' ? `${styles.nameTd} nameTdContent` : ''
          }`}
          key={`${item.dataIndex}`}
          style={
            isOverflow
              ? {
                  width: `${item.width}px`,
                  left: `${item.dataIndex === 'action' ? `${contentWidth - 60}px` : ''} ${
                    item.dataIndex === 'status' ? `${contentWidth - 180}px` : ''
                  } ${item.dataIndex === 'name' ? `${38}px` : ''}`,
                }
              : {
                  width: `${Math.floor((item.width / columnsWidth) * 100)}%`,
                  flex: `${item.dataIndex === 'name' ? '1' : 'none'}`,
                }
          }
        >
          {item.title}
        </div>
      );
    });
  }, [
    JSON.stringify(projectInfo),
    contentWidth,
    isOverflow,
    JSON.stringify(columns),
    columnsWidth,
  ]);

  const tbodyElement = useMemo(() => {
    return (projectInfo.projects ?? []).map((item: any) => {
      return (
        <div key={`${item.id}Td`} className={styles.engineerTableTr}>
          <div
            className={`${styles.engineerTableTd} ${styles.engineerTableThCheckbox} checkboxContent`}
            style={{ width: '38px', left: `0px` }}
          >
            <Checkbox style={{ marginLeft: '4px' }} value={item.id} />
          </div>
          {columns.map((ite) => {
            return (
              <div
                className={`${styles.engineerTableTd} ${ite.ellipsis ? styles.ellipsis : ''} ${
                  ite.dataIndex === 'action' ? `${styles.actionTd} actionTdContent` : ''
                } ${ite.dataIndex === 'status' ? `${styles.statusTd} statusTdContent` : ''} ${
                  ite.dataIndex === 'name' ? `${styles.nameTd} nameTdContent` : ''
                }`}
                key={`${item.id}Td${ite.dataIndex}`}
                style={
                  isOverflow
                    ? {
                        width: `${ite.width}px`,
                        left: `${ite.dataIndex === 'action' ? `${contentWidth - 60}px` : ''} ${
                          ite.dataIndex === 'status' ? `${contentWidth - 180}px` : ''
                        } ${ite.dataIndex === 'name' ? `${38}px` : ''}`,
                      }
                    : {
                        width: `${Math.floor((ite.width / columnsWidth) * 100)}%`,
                        flex: `${ite.dataIndex === 'name' ? '1' : 'none'}`,
                      }
                }
              >
                {ite.ellipsis ? (
                  // eslint-disable-next-line no-nested-ternary
                  <Tooltip
                    title={
                      typeof item[ite.dataIndex] === 'string'
                        ? item[ite.dataIndex]
                        : ite.render
                        ? ite.render(item, projectInfo)
                        : ''
                    }
                  >
                    {ite.render ? ite.render(item, projectInfo) : item[ite.dataIndex]}
                  </Tooltip>
                ) : (
                  <span>{ite.render ? ite.render(item, projectInfo) : item[ite.dataIndex]}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    });
  }, [
    JSON.stringify(projectInfo),
    contentWidth,
    isOverflow,
    JSON.stringify(columns),
    columnsWidth,
  ]);

  useEffect(() => {
    if (tableSelectData.length === 0) {
      setCheckedList([]);
      setCheckAll(false);
    }
  }, [JSON.stringify(tableSelectData), projectInfo]);

  return (
    <div className={`${styles.engineerTableItem} ${isOverflow ? styles.overflowTable : ''}`}>
      <div className={`${styles.engineerTableItemHeader} tableTitleContent`} style={{ left: `0px` }}>
        <div className={styles.foldButton} onClick={() => foldEvent()}>
          <span>{isFold ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
        </div>
        <div className={styles.engineerName}>
          <Checkbox
            onChange={checkAllEvent}
            style={{ marginRight: '7px' }}
            indeterminate={indeterminate}
            checked={checkAll}
          />
          <Tooltip title={projectInfo.name}>
            <u
              className={`canClick ${styles.engineerNameContent}`}
              onClick={() => projectNameClickEvent(projectInfo.id)}
            >
              {projectInfo.name}
            </u>
          </Tooltip>
        </div>
        <div className={styles.projectAccount}>
          <span className={styles.label}>共有项目:</span>
          <span>{projectInfo.projects ? projectInfo.projects?.length : 0}个</span>
        </div>
        <div className={styles.projectTime}>
          <span className={styles.label}>工程日期:</span>
          <span>
            {projectInfo.startTime ? moment(projectInfo.startTime).format('YYYY/MM/DD') : ''}
          </span>
          <span>
            -{projectInfo.startTime ? moment(projectInfo.endTime).format('YYYY/MM/DD') : ''}
          </span>
        </div>
        <div className={styles.createTime}>
          <span className={styles.label}>编制日期:</span>
          <span>
            {projectInfo.compileTime ? moment(projectInfo.compileTime).format('YYYY/MM/DD') : ''}
          </span>
        </div>
        <div className={styles.projectButtons}>
          {projectInfo?.operationAuthority?.canAddProject &&
            buttonJurisdictionArray?.includes('all-project-add-project') && (
              <Button className="mr10" ghost type="primary" onClick={() => addProjectEvent()}>
                新增项目
              </Button>
            )}
          {projectInfo?.operationAuthority?.canEdit &&
            buttonJurisdictionArray?.includes('all-project-edit-engineer') && (
              <Button className="mr10" onClick={() => editEngineerEvent()}>编辑</Button>
            )}
          {projectInfo?.operationAuthority?.canEdit &&
            buttonJurisdictionArray?.includes('all-project-file-engineer') && (
              <Button onClick={() => approvalFileEvent()}>批复文件</Button>
            )}
            
        </div>
      </div>
      <div
        className={styles.engineerTableBody}
        style={{ width: isOverflow ? `${columnsWidth}px` : '100%' }}
      >
        {!isFold && projectInfo.projects && projectInfo.projects.length > 0 && (
          <Checkbox.Group value={checkedList} onChange={checkboxChange}>
            <div className={styles.engineerTable}>
              <div className={styles.engineerTableContent}>
                <div className={styles.engineerTableHeader}>
                  <div
                    className={`${styles.engineerTableTh} ${styles.engineerTableThCheckbox} checkboxContent`}
                    style={{ width: '38px', left: `0px` }}
                  ></div>
                  {theadElement}
                </div>
                <div className={styles.engineerTableBody}>{tbodyElement}</div>
              </div>
            </div>
          </Checkbox.Group>
        )}
        {!isFold &&
          (!projectInfo.projects ||
            (projectInfo.projects && projectInfo.projects.length === 0)) && (
            <div className={styles.noEngineerData}>
              <EmptyTip className="pt20 pb20" description="该工程下没有项目" />
            </div>
          )}
      </div>
    </div>
  );
};

export default EngineerTableItem;
