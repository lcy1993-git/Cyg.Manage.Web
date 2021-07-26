import { Empty, Spin } from "antd"
import {useRequest} from 'ahooks';
import { getApiByType } from '../../utils/getApiByType';
import { getPropsByType } from '../../utils/getPropsByType'
import { useEffect } from "react";
import { useMemo } from "react";
import EasyTable from "../easy-table";
import WinterTable from '../winter-table';
import TemporaryTable from "../temporary-table";
import BasicTable from "../basic-table";
import DesignTable from "../design-table";
import SpecialTable from "../special-table";
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
  
  
  const {data, run, loading} = useRequest<ResData>(getApiByType(type, window.location.search.slice(4)), {manual: true})
  const props = {
    head: data?.name ?? "",
    data: data?.items ?? [],
    type
  }

  
  const tableDom = () => {
    
    switch (String(type)) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
        return <EasyTable {...props}/>;
      case "51":
        return <WinterTable {...props} />
      case "52":
        return <TemporaryTable {...props} />
      case "53":
        return <BasicTable {...props} />
      case "54":
        return <SpecialTable {...props} />
      case "55":
        return <DesignTable {...props} />
      default:
        return <Empty />
    }
  }

  useEffect(() => {
    type && id && run(id);
  }, [type])


  
  return (
    <div style={{width: "100%", height: "100%"}}>
      <Spin spinning={loading}>
        {tableDom()}
      </Spin>

    </div>

  );
}

export default CommonRateTable;