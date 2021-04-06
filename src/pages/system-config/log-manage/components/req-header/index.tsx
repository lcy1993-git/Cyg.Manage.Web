import React from 'react';
import ReactJson from 'react-json-view';

interface ReqHeaderProps {
  info: any;
}

const ReqHeader: React.FC<ReqHeaderProps> = (props) => {
  const { info } = props;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {info.reqHeader ? <ReactJson src={JSON.parse(info.reqHeader)} /> : null}
    </div>
  );
};

export default ReqHeader;
