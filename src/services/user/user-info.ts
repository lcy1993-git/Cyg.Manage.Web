import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface EditPasswordParams {
    pwd: string
    newPwd: string
}

export const editPassword = (params: EditPasswordParams) => {
    return cyRequest(() =>
        request(`${baseUrl.project}/Manage/ModifyCurrentUserPwd`, { method: 'POST', data: params}),
    );
}