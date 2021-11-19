import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import EngineerDetailInfo from '../engineer-detail-info';
import EngineerTable from '../engineer-table';

const EngineerTableWrapper = () => {
  const [modalNeedInfo, setModalInfo] = useState({
    engineerId: '',
  });

  // 工程详情
  const [engineerModalVisible, setEngineerModalVisible] = useState(false);

  const projectNameClickEvent = (engineerId: string) => {
    setModalInfo({
      engineerId,
    });
    setEngineerModalVisible(true)
  };

  const parentColumns: any[] = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (value: string, record: any) => {
        return (
          <Tooltip title={value}>
            <u
              className={`canClick`}
              style={{ marginLeft: '6px' }}
              onClick={() => projectNameClickEvent(record.id)}
            >
              {value}
            </u>
          </Tooltip>
        );
      },
    },
    {
      render: (_: unknown, record: any) => {
        return <span>共有项目：{record.projects.length} 个</span>;
      },
    },
    {
      render: (_: unknown, record: any) => {
        return (
          <span>
            工程日期：{record.startTime}-{record.endTime}
          </span>
        );
      },
    },
    {
      render: (_: unknown, record: any) => {
        return <span>编制日期：{record.compileTime}</span>;
      },
    },
    {
      render: (_: unknown, record: any) => {
        return (
          <>
            <Button key="0">新增项目</Button>
            <Button className="space-x-2" key="1">
              编辑
            </Button>
            <Button key="2">批复文件</Button>
          </>
        );
      },
    },
  ];
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <EngineerTable parentColumns={parentColumns} />
      {engineerModalVisible && (
        <EngineerDetailInfo
          engineerId={modalNeedInfo.engineerId}
          visible={engineerModalVisible}
          onChange={setEngineerModalVisible}
        />
      )}
    </div>
  );
};

export default EngineerTableWrapper;
