import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { useGetSelectData } from '@/utils/hooks';
import { useControllableValue } from 'ahooks';
import { Button, message } from 'antd';
import { Modal, Input } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DataSelect from '@/components/data-select';
import { useRef } from 'react';
import { modifyMultipleEngineerLib } from '@/services/project-management/all-project';

const { Search } = Input;

interface ResourceLibraryManageModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
}

const ResourceLibraryManageModal: React.FC<ResourceLibraryManageModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [requestLoading, setRequestLoading] = useState(false);
  const [keyWord, setKeyWord] = useState('');
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [libId, setLibId] = useState<string>('');
  const { changeFinishEvent } = props;

  const { data: libSelectData = [] } = useGetSelectData({
    url: '/ResourceLib/GetList?status=1',
    requestSource: 'resource',
    titleKey: 'libName',
    valueKey: 'id',
  });

  const tableRef = useRef<HTMLDivElement>(null);

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search();
    }
  };

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };

  const resetSelectedRows = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.resetSelectedRows();
    }
  };

  const tableColumns = [
    {
      dataIndex: 'engineerName',
      index: 'engineerName',
      title: '工程',
    },
    {
      dataIndex: 'libName',
      index: 'libName',
      title: '资源库',
      width: 180,
    },
  ];

  const tableButton = () => {
    return (
      <>
        <TableSearch className="mr22" label="工程名称" width="248px">
          <Search
            placeholder="请输入工程名称"
            enterButton
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            onSearch={() => search()}
          />
        </TableSearch>
      </>
    );
  };

  const tableButtonRightContent = () => {
    return (
      <>
        <div className="flex">
          <TableSearch className="mr22" label="迭代资源库" width="288px">
            <DataSelect
              style={{ width: '100%' }}
              value={libId}
              onChange={(value) => setLibId(value as string)}
              placeholder="请选择"
              options={libSelectData}
            />
          </TableSearch>
          <Button type="primary" onClick={() => sureReplace()} loading={requestLoading}>
            确认迭代
          </Button>
        </div>
      </>
    );
  };

  const sureReplace = async () => {
    if (tableSelectRows.length === 0) {
      message.error('请至少选择一条数据');
      return;
    }
    if (!libId) {
      message.error('请选择迭代资源库');
      return;
    }
    setRequestLoading(true);
    const engineerIds = tableSelectRows.map((item) => item.engineerId);
    try {
      await modifyMultipleEngineerLib({
        engineerIds: engineerIds,
        libId: libId,
      });
      message.success('批量变更资源库成功');
      resetSelectedRows();
      refresh();
    } catch (msg) {
      console.error(msg);
    } finally {
      setRequestLoading(false);
    }
  };

  const closeEvent = () => {
    setState(false);
    changeFinishEvent?.();
  };

  useEffect(() => {
    if (state) {
      resetSelectedRows();
    }
  }, [state]);

  return (
    <Modal
      maskClosable={false}
      title="资源库迭代"
      width={750}
      visible={state as boolean}
      destroyOnClose
      footer={null}
      onCancel={() => closeEvent()}
    >
      <GeneralTable
        ref={tableRef}
        type="checkbox"
        getSelectData={(data) => setTableSelectRows(data)}
        buttonRightContentSlot={tableButtonRightContent}
        buttonLeftContentSlot={tableButton}
        columns={tableColumns}
        extractParams={{ keyWord }}
        needTitleLine={false}
        rowKey="engineerId"
        url="/Engineer/GetEngineerByLibList"
      />
    </Modal>
  );
};

export default ResourceLibraryManageModal;
