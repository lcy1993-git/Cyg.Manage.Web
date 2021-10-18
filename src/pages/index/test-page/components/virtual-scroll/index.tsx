import React from 'react'

import { FixedSizeList } from 'react-window'

const ctx = React.createContext({})


const Test: React.FC = () => {
  return (
    <div>
      23
      <FixedSizeList
        height={300}
        itemCount={100}
        itemSize={35} // 列表行高
        width={300} //列表可视区域的宽度
      >
        {({index, style}) => (
          <div style={style}>
            {index}
          </div>
        )}
      </FixedSizeList>
    </div>

  );
}

export default Test;