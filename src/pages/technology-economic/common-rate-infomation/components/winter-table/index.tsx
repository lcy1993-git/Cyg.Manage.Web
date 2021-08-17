import { useCallback } from 'react'
import commonLess from '../common.less';
import classNames from 'classnames';
interface WinterTableProps {
  head: React.ReactNode;
  data: any[];
}

const WinterTable: React.FC<WinterTableProps> = ({ head, data }) => {
  const constomDom = useCallback((type) => {
    const architectureData = data?.find(item => item.costRateType === type) ?? [];
    return Array(5).fill(1).map((e, i) => {
      return <td key={i}>{architectureData['costRateLevel_' + (i + 1)]}</td>
    })
  }, [head]);


  return (
    <>
      <table className={classNames(commonLess.table, commonLess.margin)}>
        <thead>
          <tr>
            <th colSpan={7}>{head}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan={2}>
              地区分类
            </th>
            <th>
              I
            </th>
            <th>
              II
            </th>
            <th>III</th>
            <th>IV</th>
            <th>V</th>
          </tr>
          <tr>
            <td rowSpan={2}>
              费率(%)
            </td>
            <td>
              建筑工程
            </td>
            {constomDom(1)}
          </tr>
          <tr>
            <td>
              安装工程
            </td>
            {constomDom(2)}
          </tr>
        </tbody>
      </table>

      <table className={commonLess.table}>
        <thead>
          <tr>
            <th colSpan={2}>
              表3.3.2&nbsp;地区分类表
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>地区分类</td>
            <td>省、自治区、直辖市名称</td>
          </tr>
          <tr>
            <td>I</td>
            <td>上海、江苏、安徽、浙江、福建、江西、湖南、湖北、广东、 广西、海南</td>
          </tr>
          <tr>
            <td>II</td>
            <td>北京、天津、山东、河南、河北（张家口、承德以南地区）、重 庆、四川（甘孜、阿坝州除外）、云南（迪庆州除外）、贵州</td>
          </tr>
          <tr>
            <td>III</td>
            <td>辽宁（盖县及以南地区）、陕西（不含榆林地区）、山西、河北 （张家口、承德及以北地区）</td>
          </tr>
          <tr>
            <td>IV</td>
            <td>辽宁（盖县以北）、陕西（榆林地区）、内蒙古（锡林郭勒盟锡 林浩特市以南各盟、市、旗，不含阿拉善盟）、新疆（伊犁、哈密 地区以南）、吉林、甘肃、宁夏、四川（甘孜、阿坝州）、云南（迪 庆州）</td>
          </tr>
          <tr>
            <td>V</td>
            <td>黑龙江、青海、新疆（伊犁、哈密及以北地区）、内蒙古除四类 地区以外的其他地区</td>
          </tr>
        </tbody>
      </table>

    </>
  );
};

export default WinterTable;
