import React from 'react';
import ReactJson from 'react-json-view';

interface reqPostBodyProps {
  info: any;
}

const ReqPostBody: React.FC<reqPostBodyProps> = (props) => {
  const { info } = props;

  return (
    <div style={{ width: '100%', wordBreak : 'break-all', height: '500px', overflowY: 'auto' }}>
<<<<<<< HEAD
      {info.reqPostBody ? <ReactJson src={JSON.parse(info.reqPostBody)} /> : null}
=======
      {info.reqPostBody ? (
        <ReactJson src={JSON.parse(info.reqPostBody)} displayDataTypes={false} />
      ) : null}
>>>>>>> root权限测试版本
    </div>
  );
};

export default ReqPostBody;
