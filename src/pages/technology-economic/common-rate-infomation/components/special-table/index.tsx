import classNames from 'classnames'
import commonLess from '../common.less'
interface SpecialTableProps {
  head: React.ReactNode
  data: any[]
}

const SpecialTable: React.FC<SpecialTableProps> = ({ head, data }) => {
  const getData = (type: number, key: string) =>
    data.find((item) => item.costRateType === type)?.[key]
  return (
    <>
      <table className={classNames(commonLess.table)}>
        <thead>
          <tr>
            <th colSpan={7}>{head}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={2}>工程类别</td>
            <td colSpan={2}>高海拔地区</td>
            <td colSpan={2}>高纬度严寒地区</td>
            <td colSpan={2}>酷热地区</td>
          </tr>
          <tr>
            <td>建筑</td>
            <td>安装</td>
            <td>建筑</td>
            <td>安装</td>
            <td>建筑</td>
            <td>安装</td>
          </tr>
          <tr>
            <td>费率(%)</td>
            <td>{getData(1, 'highCostRate')}</td>
            <td>{getData(2, 'highCostRate')}</td>
            <td>{getData(1, 'coldCostRate')}</td>
            <td>{getData(2, 'coldCostRate')}</td>
            <td>{getData(1, 'hotCostRate')}</td>
            <td>{getData(2, 'hotCostRate')}</td>
          </tr>
          <tr>
            <td colSpan={7} style={{ textAlign: 'left' }}>
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

export default SpecialTable
