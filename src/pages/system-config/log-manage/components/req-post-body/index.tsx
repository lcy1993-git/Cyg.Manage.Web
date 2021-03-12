
import React from 'react';

interface reqPostBodyProps {
  info: any;
}

const ReqPostBody: React.FC<reqPostBodyProps> = (props) => {
  const { info } = props;
  return (
    <div style={{ width: "100%", overflow: "auto", height: "500px" }}>
      <pre>
        {info.reqPostBody}
      </pre>
    </div>
  );
};

export default ReqPostBody;
