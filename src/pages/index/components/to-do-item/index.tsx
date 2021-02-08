import React from "react";

import styles from "./index.less";

interface ToDoItemProps {
    icon: string,
    number: number,
    status: string
}

const ToDoItem:React.FC<ToDoItemProps> = (props) => {
    const {icon = "other",number,status} = props;

    const imgSrc = require("../../../../assets/image/index/to-do/"+icon+".png");

    return (
        <div className={styles.toDoItem}>
             <div className={styles.toDoItemIcon}>
                <img src={imgSrc} />
             </div>
             <div className={styles.toDoItemNumber}>
                {number}
             </div>
             <div className={styles.toDoItemStatus}>
                {status}
             </div>
        </div>
    )
}

export default ToDoItem