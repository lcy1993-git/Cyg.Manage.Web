export function getUsersIds(data: any) {
  let handleIds: any[] = [];
  for (let i = 0; i < data?.length; i++) {
    if (data[i].children && data[i].children?.length > 0) {
      const res = getUsersIds(data[i].children);
      if (res) {
        handleIds = handleIds.concat(res);
      }
    } else {
      handleIds.push(data[i].chooseValue);
    }
  }
  return handleIds;
}
