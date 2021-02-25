import { getDataByUrl } from "@/services/common";
import { useRequest } from "ahooks"
import { useMemo } from "react";

interface UrlSelectDataParams {
    method?: "post" | "get" 
    extraParams?: any
    titleKey?: string
    valueKey?: string
    requestSource?: "project" | "common" | "resource"
    ready?: boolean
}

export const useUrlSelectData = (url:string ,params: UrlSelectDataParams = {}) => {
    const {method = "get", extraParams = {}, titleKey = "text", valueKey = "value", requestSource = "project", ready} = params;
    
    const { data: resData = [] } = useRequest(() => getDataByUrl(url, extraParams, requestSource), {
        ready: ready,
        refreshDeps: [url, JSON.stringify(extraParams)],
      });

      const afterHanldeData = useMemo(() => {
        if (resData) {
          return resData.map((item: any) => {
            return { label: item[titleKey], value: item[valueKey] };
          });
        }
        return [];
      }, [JSON.stringify(resData)]);

      return {data: afterHanldeData}
      
}


export const useGetUserInfo = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "{}");
  console.log(userInfo)
  return userInfo
}