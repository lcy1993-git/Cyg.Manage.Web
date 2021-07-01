import { Empty } from "antd"
import {useRequest} from 'ahooks';
import { getApiByType } from '../../utils/getApiByType';
import { getPropsByType } from '../../utils/getPropsByType'
import { useEffect } from "react";
import { useMemo } from "react";
import ConstomTable from "../constom-table";
interface CommonRateTableProps {
  id: string;
  type: string;
}

interface ResData {
  name: React.ReactNode;
  items: any
}

const CommonRateTable: React.FC<CommonRateTableProps> = ({
  id,
  type,
}) => {

  

  const {data, run} = useRequest<ResData>(getApiByType(type), {manual: true})

  useEffect(() => {
    type && id && run(id);
  }, [type])

  const props = useMemo(() => {
    return getPropsByType(type, data?.items)
  }, [type])
  
  return (
    <div>
      {
        id && type ?
        <ConstomTable
          headTitle={data?.name}
          {...props}
        />:
        <Empty />
      }
    </div>

  );
}

export default CommonRateTable;