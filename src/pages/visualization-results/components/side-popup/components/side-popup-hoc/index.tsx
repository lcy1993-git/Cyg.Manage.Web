import { useMemo } from 'react';
// import getThreeModeRouter from './getThreeModeRouter';
import { SidePopupProps } from "../..";
import mixinThreeData from './mixinThreeData';



const SidePopupMergeThreeHoc = <P extends {}>(WrapperComponent: React.ComponentType<SidePopupProps>) => (
  props: P & SidePopupProps
) => {
  const {data, ...rest} = props;
  const mergeThreeData = useMemo(() => {
    return mixinThreeData(data)
  }, [data])
  return (
    <WrapperComponent data={mergeThreeData} {...rest} />
  );
}

export default SidePopupMergeThreeHoc;