import { addFormApi } from '@/services/api/businessApi';
import { ElMessage } from 'element-plus';
import { v4 as uuid4 } from 'uuid';

export async function criRecordQuery(name: string) {
  if (name === '') return;
  const data = {
    id: uuid4(), //uuid前端也可以生成
    name: name, //表单姓名,这个前端限制必填
    type: 0, //表单类型
    isFreeze: false, //冻结查看
    createTime: new Date().toLocaleString().replaceAll('/', '-'), //创建时间
    phoneNumber: sessionStorage.getItem('phone') //手机号

    // templateName: '模板1', //模板名称
    // templateTitle: '这是模板的标题', //模板标题
    // lookedPeople: '1223', // 查看过的人, string数组
    // formData:''
  };

  await addFormApi(data);
  console.log('案底查询的payload', data);

  sessionStorage.removeItem('userName');
}

export function toPay(name: string) {
  if (name === '') return ElMessage.warning({ message: '请先输入查询的名字', grouping: true });
  sessionStorage.setItem('userName', name);
  location.assign(`https://7-pay.cn/code.php?id=3705&fee=0.01&alipay=0&url=${location.origin}/redirect/`);
}
