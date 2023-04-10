import React from 'react'

interface ContentProps {
  info: any
}

const Content: React.FC<ContentProps> = (props) => {
  const { info } = props
  return (
    <div style={{ width: '100%', overflow: 'auto', height: '500px', wordBreak: 'break-all' }}>
      <pre>{info.message}</pre>
    </div>
  )
}

export default Content
