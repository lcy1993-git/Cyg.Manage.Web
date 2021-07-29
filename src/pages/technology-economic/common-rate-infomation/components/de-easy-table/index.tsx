import commonLess from '../common.less'

interface DeEasyTableProps {
  head: React.ReactNode;
  data: any[];
  type?: React.ReactNode;
}

const DeEasyTable: React.FC<DeEasyTableProps> = ({head, data}) => {
  
  return (
    <table className={commonLess.table}>
      <thead>
        <tr>
          <th colSpan={7}>{head}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {
            data.map((item, index) => {
              return (
                <td key={item.demolitionMajorText + index}>{item.demolitionMajorText}</td>
              )
            })
          }
        </tr>
        <tr>
          {
            data.map((item, index) => {
              return (
                <td key={item.demolitionMajorText + index}>{item.costRate}</td>
              )
            })
          }
        </tr>
      </tbody>
    </table>
  );
}

export default DeEasyTable;