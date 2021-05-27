import { DatePicker, DatePickerProps } from 'antd';
import moment, { Moment } from 'moment';

interface Props {
  value?: string;
  onChange?: (arg0: number)=>void;
}

/**
 * 受控日期组件，与CyFormItem嵌套使用
 * @param  null, API同DatePicker
 * @returns JSX.Element
 */
const DatePickerForm: React.FC<Props & DatePickerProps> = ({value= moment(new Date()), onChange, ...rest}) => {
  const momentValue = moment(value);

  const handleDate = (v: Moment | null, m: string) => {
    onChange!(moment(m).valueOf())
  };

  return <DatePicker defaultValue={momentValue}  onChange={handleDate} {...rest}/>
}

export default DatePickerForm;