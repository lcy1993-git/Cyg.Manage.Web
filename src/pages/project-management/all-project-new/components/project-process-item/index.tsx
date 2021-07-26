import CyTag from "@/components/cy-tag";
import moment from "moment";
import uuid from "node-uuid";
import React from "react"
import { OperateLog } from '@/services/project-management/all-project';
import styles from "./index.less"

interface JSONData {
  Key: string;
  Value: string | any[]
}

const getCompanyName = (data: JSONData[]) => {
  return data?.find((item) => item.Key === 'company_name')?.Value || data?.find((item) => item.Key === 'source_company_name')?.Value || ""
}

const getAllotUsers = (data: JSONData[]) => {
  return data?.find((item) => item.Key === 'allot_users')?.Value
}

const getHandover = (data: JSONData[]) => {
  return data?.find((item) => item.Key === 'identitys')?.Value
}

const getCompanyNameByShare = (data: JSONData[]) => {
  
  return data?.find((item) => item.Key === 'target_company_name')?.Value
}

const ProjectProcessItem: React.FC<OperateLog> = ({ date, category, operationCategory, createdByName, content, operator }) => {

  const usersElement = (allotUsers: any[]) => allotUsers?.map(({ Value, Text }, index) => {
    return (
      <>
        {(index & 1) === 0 && <div className={styles.nextRow} />}
        <div className={styles.userItem} key={uuid.v1()}>
          <div className={styles.userItemLabel}>
            {Value}
          </div>
          <div className={styles.userItemContent}>
            <CyTag className="mr7" key={uuid.v1()}>
              {Text}
            </CyTag>
          </div>
        </div>
      </>
    );
  })

  const handoverElement = (handover: any[]) => {
    return handover.map((item) => {
      return (
        <>
        <div className={styles.userItem} key={uuid.v1()}>
        <div className={styles.userItemLabel}>
          {item.Key}
        </div>
        <div className={styles.userItemContent}>
          <CyTag className="mr7" key={uuid.v1()}>
            {item?.Value?.Handover?.Text}
          </CyTag>
          <span className={styles.gtRight}>&gt;&gt;</span>

          <CyTag className="mr7" key={uuid.v1()}>
            {item?.Value?.Receive?.Text}
          </CyTag>
        </div>

      </div>
        <div />
      </>
      );
    })

  }

  const jsonData: JSONData[] = JSON.parse(content);
  
  const allotUsers = getAllotUsers(jsonData);

  const handover = getHandover(jsonData);

  return (
    <div className={styles.projectProcessItem}>
      <div className={styles.projectProcessItemTime}>
        <div className={styles.time}>{date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : ""}</div>

        <div className={styles.titleRightWrap}>{`${getCompanyName(jsonData)}-${operator}`}</div>

      </div>
      <div className={styles.projectProcessItemTitle}>
        <span className={styles.title}>{operationCategory}</span>
        {
          getCompanyNameByShare(jsonData) &&
          <span>
            &nbsp;&gt;&gt;&nbsp;{getCompanyNameByShare(jsonData)}
          </span>
        }
        
      </div>
      {
        Array.isArray(allotUsers) &&
        <div className={styles.usersInfo}>
          {
            usersElement(allotUsers)
          }
        </div>
      }
      {
        Array.isArray(handover) &&
        <div className={styles.usersInfo}>
          {
            handoverElement(handover)
          }
        </div>
      }
    </div>
  )
}

export default ProjectProcessItem
