import commonLess from '../common.less'

interface EasyTableProps {
  head: React.ReactNode;
  data: any[];
  type?: React.ReactNode;
}

const EasyTable: React.FC<EasyTableProps> = ({head, data, type}) => {
  
  const foot = () => {
    if(type === 1) {
      return (
        <tr><td colSpan={3}><pre>
          注：架空线路工程中仅大跨越工程可计取此项费用。
        </pre></td></tr>
      )
    }
    return null
  }
  return (
    <table className={commonLess.table}>
      <thead>
        <tr>
          <th colSpan={3}>{head}</th>
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
        {foot()}
      </tbody>
    </table>
  );
}

export default EasyTable;