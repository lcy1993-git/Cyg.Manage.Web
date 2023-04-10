import ReadonlyItem from '@/components/readonly-item'
import moment from 'moment'
import React from 'react'

interface BaseInfoProps {
  baseInfo: any
}

const BaseInfo: React.FC<BaseInfoProps> = (props) => {
  const { baseInfo = {} } = props
  return (
    <div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="请求标识">{baseInfo.id}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="应用程序">{baseInfo.application}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="追踪编号">{baseInfo.traceId}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="环境变量">{baseInfo.environment}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="请求方式">{baseInfo.reqMethod}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="客户端ip">{baseInfo.clientIp}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="编码类型">{baseInfo.reqContentType}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="请求地址">{baseInfo.reqUrl}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="请求日期">
            {baseInfo.executeDate ? moment(baseInfo.executeDate).format('YYYY-MM-DD hh:mm:ss') : ''}
          </ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="用户编号">{baseInfo.userIdentity}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="响应日期">
            {baseInfo.resDateTime ? moment(baseInfo.resDateTime).format('YYYY-MM-DD hh:mm:ss') : ''}
          </ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="日志等级">{baseInfo.logLevel}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="用户名">{baseInfo.userIdentityName}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="耗时(秒)">{baseInfo.timeCost}</ReadonlyItem>
        </div>
      </div>
      <div>
        <ReadonlyItem label="日志记录器">{baseInfo.logger}</ReadonlyItem>
      </div>
      <div>
        <ReadonlyItem label="Url参数">
          <pre>{baseInfo.reqQueryString}</pre>
        </ReadonlyItem>
      </div>
    </div>
  )
}

export default BaseInfo
