import React from 'react';
import ReactJson from 'react-json-view';

interface reqPostBodyProps {
  info: any;
}

const ReqPostBody: React.FC<reqPostBodyProps> = (props) => {
  const { info } = props;

  return (
    <div style={{ width: '100%', overflow: 'auto', height: '500px' }}>
      {info.reqPostBody ? <ReactJson src={JSON.parse(info.reqPostBody)} /> : null}
    </div>
  );
};

export default ReqPostBody;
