/**
 *  @param treeData 需要平铺的树状数据
 *  @param childName 儿子数组的名称
 *  @returns 平铺的数据
 * */
export const flatten = <P extends {}>(
  treeData: any,
  childName: string = 'children',
  parentId: string = '',
  parentIdName: string = 'id',
): P[] => {
  if (treeData && treeData.length) {
    return treeData.reduce((arr: object[], item: object) => {
      return arr.concat(
        [{ ...item, parentId }],
        flatten(item[childName], childName, item[parentIdName], parentIdName),
      );
    }, []);
  }
  return [];
};

interface ToTreeDataOptions {
  keyField?: string;
  childField?: string;
  parentField?: string;
}

export const toTreeData = <P, T>(data: P[], options: ToTreeDataOptions = {}): T[] => {
  const list = JSON.parse(JSON.stringify(data));

  const { keyField = 'id', childField = 'children', parentField = 'parentId' } = options;

  const tree = [];
  const record = {};

  for (let i = 0, len = list.length; i < len; i += 1) {
    const item = list[i];
    const id = item[keyField];

    if (!id) {
      continue;
    }

    if (record[id]) {
      item[childField] = record[id];
    } else {
      item[childField] = record[id] = [];
    }

    if (item[parentField]) {
      const parentId = item[parentField];

      if (!record[parentId]) {
        record[parentId] = [];
      }

      record[parentId].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
};

/**
 *  @param needHandleData 需要处理的数组
 *  @returns 处理好的数据
 * */

export const handleJurisdictionData = (needHandleData: any[]) => {
  return needHandleData?.map(mapJurisdictionData);
};

const mapJurisdictionData = (data: any) => {
  const { id, name, hasPermission = true } = data;
  const children = data.children ?? [];
  return {
    id,
    name,
    hasPermission,
    functions: children
      .filter((item: any) => item.category === 3)
      .map((item: any) => ({
        name: item.name,
        id: item.id,
        hasPermission: item.hasPermission ?? true,
      })),
    children: children.filter((item: any) => item.category !== 3).map(mapJurisdictionData),
  };
};

export interface TreeData {
  readonly id: string;
  parentId: string | null;
  children?: TreeData[];
  [key: string]: unknown;
} 
/**
 * 树形结构化
 * @param data 平铺的扁平数组
 * @returns 树形结构数组
 */
export const formatDataTree = (data: TreeData[]) => {
  
  // if(!Array.isArray(data)) return [];
  let parents = data.filter(p => p.parentId === null);
  let children = data.filter(p => p.parentId !== null);
  dataToTree(parents, children);
  function dataToTree(parents: TreeData[], children: TreeData[]) {
    parents.forEach(p => {
      children.forEach((c) => {
        if(p.id === c.parentId) {
          if(!p.children) p.children = [];
          p.children.push(c);
          dataToTree([c], children)
        }
      })
    });
  }
  return parents;
}


export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}