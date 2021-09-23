import { useMemo } from 'react';
import getThreeModeRouter from './getThreeModeRouter';
import { SidePopupProps, TableDataType } from "../..";

const getValue = (data: TableDataType[], key: string) => {
  const currentData = data.find(item => item.propertyName === key);
  return currentData?.data
}

const SidePopupMergeThreeHoc = <P extends {}>(WrapperComponent: React.ComponentType<SidePopupProps>) => (
  props: P & SidePopupProps
) => {
  const {data, ...rest} = props;
  const mergeThreeData = useMemo(() => {
    if (getValue(data, "所属图层") === "设计图层" || getValue(data, "所属图层") === "拆除图层") {
      return [...data, { propertyName: '三维模型', data: getThreeModeRouter(getValue(data, "元素类型")) }]
    }
    return data
  }, [data])
  return (
    <WrapperComponent data={mergeThreeData} {...rest} />
  );
}

export default SidePopupMergeThreeHoc;