import { Tooltip, Button, message } from 'antd';
import styles from './index.less';
interface Props {
  onClick: () => void;
  checkedKeys: any;
  svg: string;
  buttonName: string;
}

const ToolTipButton: React.FC<Props> = ({ onClick, checkedKeys = [], svg, buttonName }) => {
  return (
    <Tooltip
      mouseLeaveDelay={0.1}
      mouseEnterDelay={0.1}
      placement="top"
      title={Array.isArray(checkedKeys) && checkedKeys?.length > 1 ? '多选状态下不可操作' : ''}
    >
      <div className={styles.buttonWrap}>
        {Array.isArray(checkedKeys) && checkedKeys?.length > 1 && (
          <div className={styles.redTip}>?</div>
        )}
        <Button
          style={
            Array.isArray(checkedKeys) && checkedKeys?.length !== 1 ? { color: '#d6d6d6' } : {}
          }
          onClick={() => {
            if (Array.isArray(checkedKeys) && checkedKeys?.length === 1) {
              onClick();
            } else if (Array.isArray(checkedKeys) && checkedKeys?.length === 0) {
              message.error('当前未选择项目');
            }
          }}
        >
          <img className={styles.svg} src={svg} />
          {buttonName}
        </Button>
      </div>
    </Tooltip>
  );
};

export default ToolTipButton;
