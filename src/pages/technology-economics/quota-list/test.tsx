import {Table} from 'antd';
import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import TreeTable from '@/components/checkbox-tree-table';
import { TreeData, formatDataTree } from '@/utils/utils';
const data = [
  {
    "id": "1369223437942743040",
    "name": "配网预算定额2016",
    "parentId": null,
    "libId": "1357588635508068352",
    "explain": null,
    "level": 1,
    "sort": 0
  },
  {
    "id": "1369223437942743041",
    "name": "第一册 建筑工程",
    "parentId": "1369223437942743040",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 2,
    "sort": 0
  },
  {
    "id": "1369223437942743042",
    "name": "第1章 土石方与施工降水工程",
    "parentId": "1369223437942743041",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 3,
    "sort": 0
  },
  {
    "id": "1369223437942743043",
    "name": "1.1 人工施工土方",
    "parentId": "1369223437942743042",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 4,
    "sort": 0
  },
  {
    "id": "1369223437942743044",
    "name": "1.1.1 挖土方",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743045",
    "name": "1.1.2 挖沟、槽、基坑",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743046",
    "name": "1.1.3 挖淤泥、流砂、冻土",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743047",
    "name": "1.1.4 运土方、淤泥、冻土",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743048",
    "name": "1.1.5 平整场地、回填土",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743049",
    "name": "1.1.6 支挡土板",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743050",
    "name": "1.2 人工施工石方",
    "parentId": "1369223437942743042",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 4,
    "sort": 0
  },
  {
    "id": "1369223437942743051",
    "name": "1.2.1 凿岩石",
    "parentId": "1369223437942743050",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743052",
    "name": "1.2.2 打孔爆破石方",
    "parentId": "1369223437942743050",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743053",
    "name": "1.2.3 运石方、回填石方",
    "parentId": "1369223437942743050",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743054",
    "name": "1.2.4 清底修边",
    "parentId": "1369223437942743050",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  }
];

const dataSource = formatDataTree(data);
console.log(dataSource);

const columns = [
  {
    title: "目录名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "层级",
    dataIndex: "level",
    key: "level",
  },
  {
    title: "排序码",
    dataIndex: "sort",
    key: "sort"
  },
];

const Test = () => {
  const [expKeys, setExpKeys] = useState<string[]>([]);
  return (
    <div>
      <button onClick={()=>{
        const newKeys = data.map((i) => i.id);
        setExpKeys(newKeys);
      }}>全部展开</button>
      <button onClick={()=>setExpKeys([])}>全部收起</button>

      <button onClick={()=>setExpKeys([])}>DDDD</button>
      <button onClick={()=>setExpKeys(['1','11','112'])}>DDDD</button>
      <TreeTable
        dataSource={dataSource}
        columns={columns}
        rowKey={e => e.id}
        expandedRowKeys={expKeys}
        onExpand={(b, r) => {
          const newExp: any = b ? [...expKeys, r.id] : expKeys.filter(i => i !== r.id);
          setExpKeys(newExp);
        }}
        expandable={{
          rowExpandable: r => true,
          expandRowByClick: true,
          defaultExpandAllRows: true,
          expandIcon: (r)=> {
            if(r.expanded) {
              return (
                <span className={styles.folder}>
                  <FolderOpenOutlined/>&nbsp;
                </span>

              );
            } else {
              return (
                <span className={styles.folder}>
                  <FolderOutlined />&nbsp;
                </span>
              );
            }

          }
        }}
      />
    </div>
  );
}

export default Test;



const rightButton = () => {
  return (
    <div>
      <Button type="primary" className="mr7" onClick={() => addEvent()}>
        <PlusOutlined />
        添加
      </Button>
      <Button className="mr7" onClick={() => editEvent()}>
        <EditOutlined />
        编辑
      </Button>

      <Popconfirm
        title="您确定要删除该条数据?"
        onConfirm={sureDeleteData}
        okText="确认"
        cancelText="取消"
        // disabled
      >
        <Button className="mr7">
          <DeleteOutlined />
          删除
        </Button>
      </Popconfirm>
      <Button className="mr7" onClick={() => openAll()}>
        <DownOutlined />
        全部展开
      </Button>
      <Button className="mr7" onClick={() => foldAll()}>
        <UpOutlined />
        全部折叠
      </Button>
      {/* <TableImportButton className={styles.importBtn} importUrl="/Dictionary/Import" />
      <TableExportButton selectIds={selectIds} exportUrl="/Dictionary/Export" /> */}
    </div>
  );
};