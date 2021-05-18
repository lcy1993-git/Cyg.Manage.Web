import React, { FC } from 'react';
import UrlSelect, { UrlSelectProps } from '../url-select';
interface CascaderProps {
  onChange: () => void;
  urlSelectProps: UrlSelectProps[];
}

export const CascaderUrlSelect: FC<CascaderProps> = (props) => {
  const { onChange, urlSelectProps } = props;
  return (
    <div>
      {urlSelectProps.map((v) => (
        <UrlSelect {...v} manual/>
      ))}
    </div>
  );
};
