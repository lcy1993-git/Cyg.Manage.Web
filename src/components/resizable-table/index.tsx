/**
 * APPTAG常量
 * @type {string}
 */
import { Resizable } from 'react-resizable';
import './index.less';

export const APP_TAG = 'INSURANCE_APP';

export const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export const components = {
  header: {
    cell: ResizableTitle,
  },
};
//@ts-ignore
export const handleResize = ({ width, index, columns }) => {
  const res = columns.map((item: any, i: any) => {
    if (i == index) {
      item.width = width;
    }
    return item;
  });

  return res;
};
