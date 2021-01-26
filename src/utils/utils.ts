export const flatten = <P extends {}>(treeData: any, childName: string = 'children'): P[] => {
  if (treeData && treeData.length) {
    return treeData.reduce((arr: object[], item: object) => {
      return arr.concat([{ ...item }], flatten(item[childName], childName));
    }, []);
  }
  return [];
};
