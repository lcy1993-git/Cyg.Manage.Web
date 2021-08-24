function deepLoop(data: any, id: string) {
  for (let i = 0; i < data?.length; i++) {
    if (data[i].id === id) {
      return data[i];
    }

    if (data[i].children && data[i].children?.length > 0) {
      const res: any = deepLoop(data[i].children, id);
      if (res) {
        return res;
      }
    }
  }
}

export function getDepth(data: any) {
  let deep = 0;
  console.log(deep, 'bianhua');

  data?.forEach((ele: any) => {
    if (ele.children && ele.children.length > 0) {
      getDepth(ele.children);
      deep++;
    }
  });
  return deep;
}

export default (data: any, id: string) => {
  return deepLoop(data, id);
};
