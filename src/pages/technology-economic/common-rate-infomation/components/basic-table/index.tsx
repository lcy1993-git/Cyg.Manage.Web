import commonLess from '../common.less';
import classNames from 'classnames';
interface BasicTableProps {
  head: React.ReactNode;
  data: any[];
}

const BasicTable: React.FC<BasicTableProps> = ({head, data}) => {

  const getData = (type: number) => data.find((item) => item.designStageType === type) ?? {};
  
  return (
    <>
      <table className={classNames(commonLess.table)}>
        <thead>
          <tr>
            <th colSpan={2}>{head}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>设计阶段</td>
            <td>费率(%)</td>
          </tr>
          <tr>
            <td>投资估算</td>
            <td>{ getData(1)?.costRate }</td>
          </tr>
          <tr>
            <td>初步设计概算</td>
            <td>{ getData(2)?.costRate }</td>
          </tr>
          <tr>
            <td>施工图预算</td>
            <td>{ getData(3)?.costRate }</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default BasicTable;