import React, { useMemo } from 'react';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tooltip } from 'antd';
import { useBoolean } from 'ahooks';
import { TableContext } from '@/pages/project-management/all-project-new/components/engineer-table/table-store';

import styles from './index.less';
import moment from 'moment';
import EmptyTip from '@/components/empty-tip';
import { useContext } from 'react';
import { useEffect } from 'react';
import { isNumber } from 'lodash';
import uuid from 'node-uuid';
import CyTag from '@/components/cy-tag';
export interface AddProjectValue {
  engineerId: string;
  areaId: string;
  company: string;
  companyName: string;
}

const colorMap = {
  立项: 'green',
  委托: 'blue',
  共享: 'yellow',
  执行: 'yellow',
};

interface EngineerTableItemProps {
  projectInfo: any;
  columns: any[];
  onChange?: (checkedValue: TableItemCheckedInfo) => void;
  getClickProjectId: (clickProjectId: string) => void;
  left: number;
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

const EngineerTableList: React.FC<EngineerTableItemProps> = (props) => {
  const [isFold, { toggle: foldEvent }] = useBoolean(false);

  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const { tableSelectData } = useContext(TableContext);

  const {
    projectInfo = {},
    columns = [],
    onChange,
    getClickProjectId,

    left,
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

  //列表字段
  const listColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 300,
      render: (record: any) => {
        return (
          <u
            className="canClick"
            // onClick={() => {
            //   setCurrentClickProjectId(record.id);
            //   setProjectModalVisible(true);
            // }}
          >
            {record.name}
          </u>
        );
      },
      ellipsis: true,
    },
    {
      title: '项目起止时间',
      dataIndex: 'projectTime',
      width: 190,
      ellipsis: true,
      render: (record: any) => {
        const { startTime, endTime } = record;
        if (startTime && endTime) {
          return `${moment(startTime).format('YYYY-MM-DD')} 至 ${moment(endTime).format(
            'YYYY-MM-DD',
          )}`;
        }
        if (startTime && !endTime) {
          return `开始时间: ${moment(startTime).format('YYYY-MM-DD')}`;
        }
        if (!startTime && endTime) {
          return `截止时间: ${moment(startTime).format('YYYY-MM-DD')}`;
        }
        return '未设置起止时间';
      },
    },
    {
      title: '专业类别',
      dataIndex: 'majorCategoryText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '项目阶段',
      dataIndex: 'stageText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '勘察人',
      dataIndex: 'surveyUser',
      width: 120,
      ellipsis: true,
      render: (record: any) => {
        return record.surveyUser ? `${record.surveyUser.value}` : '无需安排';
      },
    },
    {
      title: '设计人',
      dataIndex: 'designUser',
      width: 120,
      ellipsis: true,
      render: (record: any) => {
        return record.designUser ? `${record.designUser.value}` : '';
      },
    },
    {
      title: '项目来源',
      dataIndex: 'sources',
      width: 120,
      render: (record: any) => {
        const { sources = [] } = record;
        return sources.map((item: any) => {
          return (
            <span key={uuid.v1()}>
              <CyTag color={colorMap[item] ? colorMap[item] : 'green'}>
                <span>{item}</span>
              </CyTag>
            </span>
          );
        });
      },
    },
    {
      title: '项目身份',
      dataIndex: 'identitys',
      width: 180,
      render: (record: any) => {
        const { identitys = [] } = record;
        return identitys
          .filter((item: any) => item.text)
          .map((item: any) => {
            return (
              <span className="mr7" key={uuid.v1()}>
                <CyTag color={colorMap[item.text] ? colorMap[item.text] : 'green'}>
                  {item.text}
                </CyTag>
              </span>
            );
          });
      },
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      width: 120,
    },
  ];

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

  const theadElement = useMemo(() => {
    return columns.map((item) => {
      return (
        <div
          className={`${styles.engineerTableTh} ${
            item.dataIndex === 'action' ? styles.actionTd : ''
          } ${item.dataIndex === 'status' ? styles.statusTd : ''} ${
            item.dataIndex === 'name' ? styles.nameTd : ''
          }`}
          key={`${item.dataIndex}`}
          style={
            isOverflow
              ? {
                  width: `${item.width}px`,
                  left: `${item.dataIndex === 'action' ? `${left + contentWidth - 60}px` : ''} ${
                    item.dataIndex === 'status' ? `${left + contentWidth - 180}px` : ''
                  } ${item.dataIndex === 'name' ? `${left + 38}px` : ''}`,
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
    left,
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
            className={`${styles.engineerTableTd} ${styles.engineerTableThCheckbox}`}
            style={{ width: '38px', left: `${left}px` }}
          >
            <Checkbox style={{ marginLeft: '4px' }} value={item.id} />
          </div>
          {columns.map((ite) => {
            return (
              <div
                className={`${styles.engineerTableTd} ${ite.ellipsis ? styles.ellipsis : ''} ${
                  ite.dataIndex === 'action' ? styles.actionTd : ''
                } ${ite.dataIndex === 'status' ? styles.statusTd : ''} ${
                  ite.dataIndex === 'name' ? styles.nameTd : ''
                }`}
                key={`${item.id}Td${ite.dataIndex}`}
                style={
                  isOverflow
                    ? {
                        width: `${ite.width}px`,
                        left: `${
                          ite.dataIndex === 'action' ? `${left + contentWidth - 60}px` : ''
                        } ${ite.dataIndex === 'status' ? `${left + contentWidth - 180}px` : ''} ${
                          ite.dataIndex === 'name' ? `${left + 38}px` : ''
                        }`,
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
    left,
    contentWidth,
    isOverflow,
    JSON.stringify(columns),
    columnsWidth,
  ]);

  // useEffect(() => {
  //   if (tableSelectData.length === 0) {
  //     setCheckedList([]);
  //     setCheckAll(false);
  //   }
  // }, [JSON.stringify(tableSelectData), projectInfo]);

  return (
    <div className={`${styles.engineerTableItem} ${isOverflow ? styles.overflowTable : ''}`}>
      <div className={styles.engineerTableItemHeader} style={{ left: `${left}px` }}>
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
                    className={`${styles.engineerTableTh} ${styles.engineerTableThCheckbox}`}
                    style={{ width: '38px', left: `${left}px` }}
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
              <EmptyTip className="pt20 pb20" description="暂无交接的内容" />
            </div>
          )}
      </div>
    </div>
  );
};

export default EngineerTableList;
