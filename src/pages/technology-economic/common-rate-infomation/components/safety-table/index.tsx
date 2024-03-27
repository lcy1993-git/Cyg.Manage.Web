import classNames from 'classnames'
import commonLess from '../common.less'
interface TemporaryTableProps {
  head: React.ReactNode
  data: any[]
}

const SafetyTable: React.FC<TemporaryTableProps> = ({ head, data }) => {
  const getDom = (type: any, city: any) => {
    const typeData = data.find((item) => item.costRateType === type)
    return typeData ? typeData?.[`level_${city}`] : ''
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
            <td colSpan={2}>工程类别</td>
            <td>建筑工程</td>
            <td>安装工程</td>
          </tr>
          <tr>
            <td rowSpan={3}>费率(%)</td>
            <td>市区</td>
            <td>{getDom(1, 1)}</td>
            <td>{getDom(2, 1)}</td>
          </tr>
          <tr>
            <td>县城或镇</td>
            <td>{getDom(1, 2)}</td>
            <td>{getDom(2, 2)}</td>
          </tr>
          <tr>
            <td>其他</td>
            <td>{getDom(1, 3)}</td>
            <td>{getDom(2, 3)}</td>
          </tr>
          <tr>
            <td colSpan={4} style={{ textAlign: 'left' }}>
              注1：市区、县城或镇按照市区维护建设税中的行政区划确定
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{ textAlign: 'left' }}>
              注2：京、沪、广深城区按以上市区费率乘以1.05。
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default SafetyTable
