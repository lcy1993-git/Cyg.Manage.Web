import moment,{ Moment } from "moment";
import React from "react";
import styles from "./index.less";

interface ReplyComponentProps {
    name:string,
    time: string | Moment
    className: string
}

const ReplyComponent:React.FC<ReplyComponentProps> = (props) => {
    const {name,time,className} = props;
    return (
        <div className={`${styles.replyComponent} ${className}`}>
            <div className={styles.replyComponentTitle}>
                <span className={styles.replyPerson}>
                    {name}
                </span>
                <span className={styles.replyTime}>
                    {time ? moment(time).format("YYYY-MM-DD hh:mm:ss") : ""}
                </span>
            </div>
            <div className={styles.replyComponentContent}>
                {
                    props.children
                }
            </div>
        </div>
    )
}

export default ReplyComponent