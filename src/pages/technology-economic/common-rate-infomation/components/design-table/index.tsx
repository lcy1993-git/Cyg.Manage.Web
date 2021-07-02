import commonLess from '../common.less';
import classNames from 'classnames';
interface DesignTableProps {
  head: React.ReactNode;
  data: any[];
}

const DesignTable: React.FC<DesignTableProps> = ({ head, data }) => {

  const domRow = () => {
    
  };

  const empty = (num: number) => {
    return Array(num).fill(1).map(() => <span>&nbsp;</span>)
  }
  return (
    <>
      <table className={classNames(commonLess.table)}>
        <thead>
          <tr>
            <th colSpan={4}>{head}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>工程设计费额(万元)</td>
            <td colSpan={2}>设计费率(%)</td>
          </tr>
          <tr>
            <td>上限值(X1)</td>
            <td>下限值(X2)(s)</td>
            <td>下限值(Y1)</td>
            <td>上限值(Y1)</td>
          </tr>
          {domRow()}
          <tr>
            <td colSpan={4}>
              <pre>
              注1：对于设计费低于1000元的，按1000元计列。
                <br />
                注2：对于设备费占本工程建筑工程费加安装工程加设备费之和的98%及以上时，设计费按照以上费率的10%计算； <br />
                {empty(5)}设备费占本工程建筑工程费加安装工程加设备费之和的98%〜95%时（包含95%本身）， 设计费按照以上费率的20%计算；<br />
                {empty(5)}设备费占本工程建筑工程费加 安装工程加设备费之和的95%以下时，设计费按照表中费率计算。
                <br />
                注3：除架空线路、电缆线路工程外，其他各类工程均适用于配电室、开关站工程设计费费率。
                <br />
                注4：费率应按照内插法取定，计算时保留两位小数。
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default DesignTable;