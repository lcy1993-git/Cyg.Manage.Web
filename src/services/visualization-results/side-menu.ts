import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

export const GetEngineerProjectList = () => {
  return cyRequest<any>(() =>
    request(
      `${baseUrl.webGis}/WebGis/GetEngineerProjectList
  `,
      { method: 'POST', data: { kvLevel: -1 } },
    ),
  );
};
