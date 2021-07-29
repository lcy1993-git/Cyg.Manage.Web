import commonLess from '../common.less'

interface DeEasyTableProps {
  head: React.ReactNode;
  data: any[];
  type?: React.ReactNode;
}

const DeWinterTable: React.FC<DeEasyTableProps> = ({head, data}) => {
  

  return (
    <table className={commonLess.table}>
      <thead>
        <tr>
          <th colSpan={6}>{head}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>工程类别</td>
          <td>建筑工程</td>
          <td>安装工程</td>
        </tr>
        <tr>
          <td>费率(%)</td>
          <td>{data?.find((item) => item.costRateType === 1)?.costRate ?? ""}</td>
          <td>{data?.find((item) => item.costRateType === 2)?.costRate ?? ""}</td>
        </tr>

      </tbody>
    </table>
  );
}

export default DeWinterTable;