import React from 'react';

interface ReqHeaderProps {
  info: any;
}

const ReqHeader: React.FC<ReqHeaderProps> = (props) => {
  const { info } = props;
  return (
    <div style={{width: "100%", overflowX: "auto"}}>
        <pre>
          {info.reqHeader}
        </pre>
    </div>
  );
};

export default ReqHeader;
