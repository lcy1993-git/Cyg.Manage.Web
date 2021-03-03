import CyTag from "@/components/cy-tag";
import moment from "moment";
import uuid from "node-uuid";
import React from "react"
import styles from "./index.less"

interface ProjectProcessItemProps {
    time: string
    title: string
    isArrangePerson?: boolean
    users?: any[]
}

const ProjectProcessItem: React.FC<ProjectProcessItemProps> = (props) => {
    const { time, title, isArrangePerson = false, users } = props;

    const usersElement = users?.map((item) => {
        return (
            <div className={styles.userItem} key={uuid.v1()}>
                <div className={styles.userItemLabel}>
                    {item.key.text}
                </div>
                <div className={styles.userItemContent}>
                    {
                        item.value?.map((ite: string) => {
                            return (
                                <CyTag className="mr7" key={uuid.v1()}>
                                    {ite}
                                </CyTag>
                            )
                        })
                    }
                </div>
            </div>
        )
    })

    return (
        <div className={styles.projectProcessItem}>
            <div className={styles.projectProcessItemTime}>
                {time ? moment(time).format("YYYY-MM-DD HH:mm:ss") : ""}
            </div>
            <div className={styles.projectProcessItemTitle}>
                {title}
            </div>
            {
                isArrangePerson &&
                <div className={styles.usersInfo}>
                    {
                        usersElement
                    }
                </div>
            }
        </div>
    )
}

export default ProjectProcessItem