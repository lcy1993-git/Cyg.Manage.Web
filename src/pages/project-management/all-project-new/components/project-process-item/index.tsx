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
  return data?.find((item) => item.Key === 'company_name')?.Value ?? ""
}

const getAllotUsers = (data: JSONData[]) => {
  return data?.find((item) => item.Key === 'allot_users')?.Value
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

  const jsonData: JSONData[] = JSON.parse(content);
  
  const allotUsers = getAllotUsers(jsonData)

  return (
    <div className={styles.projectProcessItem}>
      <div className={styles.projectProcessItemTime}>
        {date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : ""}
        <span className={styles.titleRightWrap}>{`${getCompanyName(jsonData)}-${operator}`}</span>

      </div>
      <div className={styles.projectProcessItemTitle}>
        {operationCategory}
      </div>
      {
        Array.isArray(allotUsers) &&
        <div className={styles.usersInfo}>
          {
            usersElement(allotUsers)
          }
        </div>
      }
    </div>
  )
}

export default ProjectProcessItem
