import { handleAxiosRes, http } from '@/services/domain/http';
import { ElMessage } from 'element-plus';
import { originFormDataById, originFormDataByUser } from '@/services/store/store';

/**
 * 发送验证码接口
 * @param phoneNumber 要发送验证码的手机
 * @returns 验证码
 */
export async function sentAuthCodeApi(phoneNumber: string) {
  const rest = `/user/getVerificationCode?phone=${phoneNumber}`;

  const { isError, isSuccess, error, data } = await http.get(rest).then(handleAxiosRes, handleAxiosRes);

  if (isError) {
    ElMessage.warning(`${error}`);
    return null;
  }
  if (isSuccess) {
    ElMessage.success({ message: `签名为'小爽爽美妆'验证码已发到手机,请注意查收！`, duration: 2000 });
  }

  return data;
}

/**
 * 登录接口
 * @param phoneNumber 要登录的手机号
 * @returns 是否登录
 */
export function loginApi(phoneNumber: string) {
  const rest = `/user/login?phone=${phoneNumber}`; //&authCode=${authCode}
  return http.get(rest);
}

/**
 * 根据手机号获取表单信息
 * @param phoneNumber 要登录的手机号
 * @returns 用户下的所有表单
 */
export async function selectFormByPhone(phoneNumber: string) {
  const rest = `/user/selectTemplateByPhone?phone=${phoneNumber}`;
  const { isError, res } = await http.get(rest).then(handleAxiosRes, handleAxiosRes);
  if (isError) {
    ElMessage.error(`获取表单数据错误！`);
    return null;
  } else {
    originFormDataByUser.value = res.data?.data || [];
    console.log('手机下的表单数据', res);
  }
}

/**
 * 保存表单数据
 * @param FormObject 表单数据
 * @returns
 */
export async function addFormApi(FormObject: any) {
  const url = `/user/addTemplate`;
  const { isError, isSuccess } = await http.post(url, FormObject).then(handleAxiosRes, handleAxiosRes);
  if (isSuccess) {
    ElMessage.success(`保存成功！`);
  }
  if (isError) {
    ElMessage.error(`保存表单错误！`);
  }

  return null;
}

/**
 * 更新表单数据
 * @param FormObject 表单数据
 * @returns
 */
export async function updateFormApi(FormObject: any) {
  const url = `/user/updateTemplateById`;
  const { isError, isSuccess } = await http.post(url, FormObject).then(handleAxiosRes, handleAxiosRes);
  if (isSuccess) {
    ElMessage.success(`更新成功！`);
  }
  if (isError) {
    ElMessage.error(`更新失败！`);
  }

  return null;
}

/**
 * 查询单个表单数据
 * @param userPhone 表单的uuid
 * @returns 单个表单数据对象
 */
export async function querySingleFormApi(uuid: string) {
  const url = `/user/selectTemplateById?id=${uuid}`;
  const { isError, res } = await http.get(url).then(handleAxiosRes, handleAxiosRes);
  if (isError) {
    ElMessage.error(`查询表单错误！`);
    return null;
  }
  originFormDataById.value = res.data.data;
  return res;
}

/**
 * 删除表单数据
 * @param uuidString 表单的uuid字符串, 多个表单 ',' 隔开
 * @returns
 */
export async function deleteFormApi(uuidString: string) {
  const url = `/user/batchDeleteTemplateById`;
  const { isError, isSuccess, res } = await http.post(url, { ids: uuidString }).then(handleAxiosRes, handleAxiosRes);
  if (isError) ElMessage.error(`删除表单错误！`);
  if (isSuccess) ElMessage.success(`表单已删除！`);
  return res;
}

/**
 * 查询表单列表
 * @returns
 */
export function getFormListApi(payload: any) {
  const pageNum = payload.pageNum ?? 1;
  const pageSize = payload.pageSize ?? 10;
  const type = payload.type ?? '';

  const uuid = payload.uuid && `&uuid=${payload.uuid}`;
  const phone = payload.phone && `&phone=${payload.phone}`;
  const endTime = payload.endTime && `&endTime=${payload.endTime}`;
  const startTime = payload.startTime && `&startTime=${payload.startTime}`;
  const templateName = payload.templateName && `&templateName=${payload.templateName}`;

  const urlExpend = uuid + phone + endTime + startTime + templateName;
  console.log('urlExpend:', urlExpend);

  const url = `user/TemplateList?pageNum=${pageNum}&pageSize=${pageSize}&type=${type}` + urlExpend;
  console.log('url:', url);
  return http.get(url);
}
