import commonLess from '../common.less'
import classNames from 'classnames'
interface DeSpecialTableProps {
  head: React.ReactNode
  data: any[]
}

const DeSpecialTable: React.FC<DeSpecialTableProps> = ({ head, data }) => {
  //   coldCostRate: 6.18
  // demolitionMajor: 6
  // demolitionMajorText: "通信线路拆除"
  // highCostRate: 8.64
  // hotCostRate: 5.48
  // const getData = (type: number, key: string) => data.find((item) => item.costRateType === type)?.[key]
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
            <td>专业</td>
            <td>高海拔地区</td>
            <td>高纬度严寒地区</td>
            <td>酷热地区</td>
          </tr>
          {data.map((item) => {
            return (
              <tr key={item.demolitionMajorText}>
                <td>{item?.demolitionMajorText}</td>
                <td>{item?.highCostRate}</td>
                <td>{item?.coldCostRate}</td>
                <td>{item?.hotCostRate}</td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={7}>
              <pre>
                注1：高海拔地区指平均海拔在3000m以上的地区。
                <br />
                注2：高纬度严寒地区指北纬45。以北地区。
                <br />
                注3：酷热地区指面积在1万平方公里以上的沙漠地区，以及新疆吐鲁番地区。
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default DeSpecialTable
