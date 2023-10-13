import { getFormListApi, deleteFormApi, updateFormApi } from '@/services/api/businessApi';
import { handleAxiosRes, http } from '@/services/domain/http';
import { sj } from '@/services/domain/util';
import { ElMessage } from 'element-plus';
import { reactive, ref, watch } from 'vue';

const statisticFilter = reactive({
  loading: false,
  type: '',
  Search: '',
  dateRange: ''
});

const pagination = reactive({
  pageNum: 1,
  pageSize: 10
});
const dataTotal = ref(0);

const originListData = ref([]);

export { statisticFilter, pagination, dataTotal, originListData };

watch(
  [statisticFilter, pagination],
  () => {
    console.log(statisticFilter);
    getFormList();
  },
  { deep: true }
);

/** 获取表单列表数据*/
export const getFormList = sj.debounce(async () => {
  const { isSuccess, isError, res } = await getFormListApi({
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
    type: statisticFilter.type,

    uuid: '',
    phone: '',
    endTime: '',
    startTime: '',
    templateName: ''
  }).then(handleAxiosRes, handleAxiosRes);

  console.log(res);

  if (isError) {
    return ElMessage.error('获取列表数据错误！');
  }
  if (isSuccess) {
    const data = res.data.data;
    originListData.value = data.list;
    dataTotal.value = data.total;
    console.log(originListData.value);
  }
}, 300);

/** 格式化列表数据*/
export function formatData(originData: any[]) {
  return originData.map(item => {
    return {
      uuid: item.id,
      template: item.templateName,
      name: item.name,
      type: item.type == '0' ? '案底查询' : '个人信息箱',
      phone: item.phoneNumber,
      createTime: item.createTime,
      isFreeze: item.isFreeze === 'true' ? '是' : '否',
      lookedPeople: item.lookedPeople,
      origin: item
    };
  });
}

/** 删除列表数据*/
export function deleteSingleForm(id: string) {
  deleteFormApi(id);
  getFormList();
}

/** 更新表单*/
export async function updateWrit(curRowOrigin: any, writString: string) {
  console.log('curr', curRowOrigin);

  const data = {
    type: 0, //表单类型
    id: curRowOrigin.id,
    name: curRowOrigin.name,
    phoneNumber: curRowOrigin.phoneNumber,
    // createTime: curRowOrigin.createTime,

    formData: writString
  };
  updateFormApi(data);
}
