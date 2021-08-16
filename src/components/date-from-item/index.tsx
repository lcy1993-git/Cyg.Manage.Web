// import { divide } from '@umijs/deps/compiled/lodash';
// import { Button, DatePicker, DatePickerProps } from 'antd';
// import moment, { Moment } from 'moment';
// import { useState } from 'react';
// import styles from './index.less';
// interface Props {
//   value?: string;
//   onChange?: (arg0: string) => void;
// }

// /**
//  * 受控日期组件，与CyFormItem嵌套使用
//  * @param  null, API同DatePicker
//  * @returns JSX.Element
//  */
// const DatePickerForm: React.FC<Props & DatePickerProps> = ({
//   value = '',
//   onChange,
//   picker,
//   ...rest
// }) => {
//   const momentValue = moment(value).isValid() ? moment(value) : undefined;
//   const [dateValue, setDateValue] = useState<any>(momentValue);
//   const format = picker === 'year' ? 'YYYY' : 'YYYY-MM-DD';
//   const handleDate = (v: Moment | null, m: string) => {
//     // onChange!(moment(m).format(format));
//     setDateValue(v);
//   };

//   const reset = () => {
//     setDateValue(undefined);
//   };

//   return (
//     <DatePicker
//       allowClear={false}
//       dropdownClassName={styles.expireDate}
//       value={dateValue}
//       onChange={handleDate}
//       picker={picker}
//       {...rest}
//       renderExtraFooter={() => [
//         <div key="clearDate" style={{ color: '#0f7b3c', textAlign: 'center' }}>
//           <span style={{ cursor: 'pointer' }} onClick={() => reset()}>
//             清除日期
//           </span>
//         </div>,
//       ]}
//     />
//   );
// };

// export default DatePickerForm;
