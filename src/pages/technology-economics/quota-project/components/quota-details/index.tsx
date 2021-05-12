import { useRequest } from '@/.umi/plugin-request/request';
import { Modal, Table } from 'antd';
import TreeTable from '../../../components/file-tree-table';


interface Props {
  id: string;
  setDetailId: (arg0: string) => void
}

const data = [
  {id:1,
    children: [{}]},
  {id:2}
];

const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "编号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "单位",
    dataIndex: "dep",
    key: "dep",
  },
  {
    title: "单重（kg）",
    dataIndex: "kg",
    key: "kg",
  },
  {
    title: "系数",
    dataIndex: "xishu",
    key: "xishu",
  },
  {
    title: "数量",
    dataIndex: "num",
    key: "num",
  },
]

const QuotaDetails: React.FC<Props> = ({id, setDetailId}) => {

  // const { data, loading} = useRequest()

  return (
    <Modal
      maskClosable={false}
      title="定额明细"
      width="80vw"
      visible={!!id}
      okText="确认"
      onCancel={()=>setDetailId("")}
      cancelText="取消"
      destroyOnClose
    >
      <TreeTable
        dataSource={data}
        columns={columns}
      />
    </Modal>
  );
}

export default QuotaDetails;