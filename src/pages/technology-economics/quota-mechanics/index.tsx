import QuotaLibCommon from '../components/quota-lib-common';

// 外部
const columns = [
  {
    dataIndex: 'id',
    index: 'id',
    title: '材料编号',
    width: 120,
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '材料名称',
    width: 360,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '单位',
    width: 180,
  },
  {
    dataIndex: 'releaseDate',
    index: 'releaseDate',
    title: '单重',
    width: 80,
  }
];

const QuotaMechanics = () => {
  // 内部
  const columns = [
    {
      dataIndex: 'id',
      index: 'id',
      title: '材料编号',
      width: 120,
    },
    {
      dataIndex: 'name',
      index: 'name',
      title: '材料名称',
      width: 360,
    },
    {
      dataIndex: 'categoryText',
      index: 'categoryText',
      title: '单位',
      width: 180,
    },
    {
      dataIndex: 'releaseDate',
      index: 'releaseDate',
      title: '单重',
      width: 80,
    }
  ];

  return (
    <>
      <QuotaLibCommon
        title="定额库机械项"
        columns={columns}
        // fromItems={}
        url=""
      />
    </>
  );
}

export default QuotaMechanics;