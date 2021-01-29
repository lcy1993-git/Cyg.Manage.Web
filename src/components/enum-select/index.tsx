import { Select } from 'antd';
import React from 'react';

interface EnumSelectProps {
  enumList: object;
  needAll?: any;
}

export const withEnum = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & EnumSelectProps & { children?: React.ReactNode },
) => {
  const { needAll, enumList = {}, ...rest } = props;

  const enumListKeysArray = Object.keys(enumList);
  const options = enumListKeysArray
    .filter((item, index) => index < enumListKeysArray.length / 2)
    .map((item) => ({ label: enumList[item], value: item }));
  if (needAll) {
    options.unshift({ label: '-全部-', value: '' });
  }
  return <WrapperComponent options={options} {...(rest as P)} />;
};

export default withEnum(Select);
