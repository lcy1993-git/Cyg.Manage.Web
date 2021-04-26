import {useMemo} from "react"


export const useGetOverflowArray = <T extends {}>(contentWidth: number, list: T[]) => {
    return useMemo(() => {
        let sum = 0;
        let noOverflowArray:T[] = [];
        let overflowArray:T[] = [];

        list.forEach((item: any) => {
            sum += item.width;
            if(sum <= contentWidth) {
                noOverflowArray.push(item);
            }else {
                overflowArray.push(item)
            }
        })

        return {
            noOverflowArray,
            overflowArray
        }
    }, [contentWidth, list])
}