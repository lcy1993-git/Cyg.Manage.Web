import { AreaInfo, getProjectManageData } from '@/services/index';
import { useRequest } from 'ahooks';
import uuid from 'node-uuid';
import React, { useMemo } from 'react';
import ChartBox from '../chart-box';
import ToDoItem from '../to-do-item-second';
import styles from './index.less';
import { history } from 'umi';
import ScrollView from 'react-custom-scrollbars';
import { useLayoutStore } from '@/layouts/context';
import { Spin } from 'antd';

interface ToDoProps {
  componentProps?: string[];
  currentAreaInfo: AreaInfo;
}
const typeEnmu = {
  awaitProcess: '1',
  inProgress: '2',
  delegation: '3',
  beShared: '4',
};

const areaTypeObj = {
  "1": "-1",
  "2": "1",
  "3": "2"
}

const ToDo: React.FC<ToDoProps> = (props) => {
  const {
    componentProps = ['awaitProcess', 'inProgress', 'delegation', 'beShared'],
    currentAreaInfo,
  } = props;

  const { setAllProjectSearchType, setAllProjectAreaInfo } = useLayoutStore();

  const { data: toDoStatisticsInfo, loading } = useRequest(
    () =>
      getProjectManageData({
        areaCode: currentAreaInfo.areaId,
        areaType: currentAreaInfo.areaLevel,
      }),
    {
      refreshDeps: [currentAreaInfo],
      pollingWhenHidden: false,
    },
  );

  const afterHandleComponentProps = useMemo(() => {
    return componentProps.reduce((arr, item, index) => {
      if ((index + 1) % 2 === 1) {
        if (!arr[Math.ceil((index + 1) / 2) - 1]) {
          arr.push([item]);
        } else {
          arr[Math.ceil((index + 1) / 2) - 1].push(item);
        }
      } else {
        arr[Math.ceil((index + 1) / 2) - 1].push(item);
      }
      return arr;
    }, []);
  }, [componentProps]);

  const toAllProjectListPage = (type: string) => {
    setAllProjectSearchType?.(typeEnmu[type]);
    setAllProjectAreaInfo?.({
      areaId: currentAreaInfo.areaId,
      areaLevel: areaTypeObj[currentAreaInfo.areaLevel!],
    })
    history.push('/project-management/all-project');
  };

  const componentShowElement = useMemo(() => {
    if (toDoStatisticsInfo) {
      return afterHandleComponentProps.map((item, index) => {
        return (
          <div key={uuid.v1()} className={styles.projectManageRow}>
            {item[0] && (
              <div className="flex1" onClick={() => toAllProjectListPage(item[0])}>
                <ToDoItem type={item[0]} number={toDoStatisticsInfo![item[0]]} />
              </div>
            )}
            {item[1] && (
              <div className="flex1" onClick={() => toAllProjectListPage(item[1])}>
                <ToDoItem type={item[1]} number={toDoStatisticsInfo![item[1]]} />
              </div>
            )}
            {!item[1] && <div className="flex1"></div>}
          </div>
        );
      });
    }
    return [];
  }, [afterHandleComponentProps, toDoStatisticsInfo]);

  const scrollBarRenderView = (params: any) => {
    const { style, ...rest } = params;
    const viewStyle = {
      backgroundColor: `#4DA944`,
      borderRadius: '6px',
      cursor: 'pointer',
    };
    return <div className="box" style={{ ...params.style, ...viewStyle }} {...rest} />;
  };

  return (

    <ChartBox title="项目管理">
      <Spin spinning={loading} delay={300}>
        <div className={styles.projectManageContent}>
          <ScrollView renderThumbVertical={scrollBarRenderView}>{componentShowElement}</ScrollView>
        </div>
      </Spin>
    </ChartBox>

  );
};

export default ToDo;
