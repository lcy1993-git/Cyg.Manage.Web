import React from 'react';
import styles from './index.less';

interface TableSearchProps {
  label?: string | React.ReactNode;
  className?: string;
  width: string;
  marginLeft?: string;
}

const TableSearch: React.FC<TableSearchProps> = (props) => {
  const { marginLeft, label, width, ...rest } = props;
  return (
    <div
      {...rest}
      className={styles.tableSearchComponent}
      style={{ width: width, marginLeft: marginLeft }}
    >
      <div className={styles.tableSearchLabel}>{label}</div>
      <div className={styles.tableSearchContent}>{props.children}</div>
    </div>
  );
};

export default TableSearch;
