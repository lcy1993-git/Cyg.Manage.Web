import { Select } from 'antd';
import React from 'react';

interface EnumSelectProps {
  enumList: object;
  needAll?: any;
  allLabel?: string;
  allValue?: string;
  valueString?: boolean;
}

export const withEnum = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & EnumSelectProps & { children?: React.ReactNode },
) => {
  const {
    needAll,
    enumList = {},
    allLabel = '-全部-',
    allValue = '',
    valueString = false,
    ...rest
  } = props;

  const enumListKeysArray = Object.keys(enumList);

  const options = valueString
    ? enumListKeysArray
        .filter((item, index) => index < enumListKeysArray.length)
        .map((item) => ({ label: enumList[item], value: item }))
    : enumListKeysArray
        .filter((item, index) => index < enumListKeysArray.length / 2)
        .map((item) => ({ label: enumList[item], value: item }));
  if (needAll) {
    options.unshift({ label: allLabel, value: allValue });
  }

  return <WrapperComponent options={options} {...(rest as P)} />;
};

export default withEnum(Select);
