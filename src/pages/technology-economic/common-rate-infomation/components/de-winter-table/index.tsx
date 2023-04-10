import commonLess from '../common.less'

interface DeEasyTableProps {
  head: React.ReactNode
  data: any[]
  type?: React.ReactNode
}

const DeWinterTable: React.FC<DeEasyTableProps> = ({ head, data }) => {
  return (
    <table className={commonLess.table}>
      <thead>
        <tr>
          <th colSpan={6}>{head}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>专业</td>
          <td>I</td>
          <td>II</td>
          <td>III</td>
          <td>IV</td>
          <td>V</td>
        </tr>
        {data.map((item) => {
          return (
            <tr key={item.demolitionMajor}>
              <td>{item?.demolitionMajorText}</td>
              <td>{item?.costRateLevel_1}</td>
              <td>{item?.costRateLevel_2}</td>
              <td>{item?.costRateLevel_3}</td>
              <td>{item?.costRateLevel_4}</td>
              <td>{item?.costRateLevel_5}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default DeWinterTable
