<script setup lang="ts">
import { originListData, formatData, deleteSingleForm, updateWrit } from './statistic';
import Writ from '../criminal/Writ.vue';
// import StButton from '@/components/base/st-button';
// import StDrawer from '@/components/base/StDrawer.vue';
// import StatisticPanel from '@/components/statistic/StatisticPanel.vue';
// import { router } from '@/pages/app/router.js';
// import { sj } from '@/services/domain/util';
// import { AnalysisTypeEnum } from '@/types/analysis/enum';
// import { analysisTypeEnumName } from '@/types/analysis/name';
// import { StatisticPanelOpenTypeEnum } from '@/types/statistic/enum';
// import { ElMessage } from 'element-plus';
// import { onMounted, reactive, ref, Ref, watch, watchEffect } from 'vue';
// import { useRoute } from 'vue-router';
// import { statistic } from './statistic.js';
// import { analysisTypeMap, chartIconMap } from '../data-board/boardMap';

// // eslint-disable-next-line
// interface ChartIcon {
//   name: string;
//   icon: string;
//   size: number;
//   border: number;
// }

// const props = defineProps(['updateList']);

// const xTable = ref(null as any);
// const route = useRoute();
// statistic.ak = route.params.token as any;

// //书签列表
// const statisticList = ref([]);
// const usedStatistic = ref(null as any);

// const getStatisticList = () => {
//   statistic.getStatistic().then(
//     res => {
//       const { statisticDetails, dashboardCountPerStatistic, totalCount } = res.data.data;
//       statisticList.value = statisticDetails;
//       usedStatistic.value = dashboardCountPerStatistic;
//       statistic.statisticTotal = totalCount;
//     },
//     () => {
//       ElMessage.error('获取书签列表错误');
//     }
//   );
// };

// const deletedDilog = ref(false);

// const selectedRecords = ref([] as any);

// const seleteRow = () => {
//   selectedRecords.value = xTable.value.getCheckboxRecords();
// };

// const deleteConfirm = () => {
//   if (selectedRecords.value.length === 0) return ElMessage.warning('请选择要删除的书签');
//   const isPreset = selectedRecords.value.find((item: any) => item.bornType === 0);
//   if (isPreset?.length > 0) return ElMessage.warning('所选的书签中包含预置书签不可删除！');
//   const deleteList = selectedRecords.value.map((mkItem: any) => mkItem.id);
//   statistic
//     .deleteStatistic(deleteList)
//     .then(
//       res => {
//         if (res.data?.code === 200) {
//           ElMessage.success('删除书签成功');
//           xTable.value.removeCheckboxRow();
//           selectedRecords.value = [];
//           getStatisticList();
//         } else ElMessage.error('删除书签失败');
//       },
//       () => {
//         ElMessage.error('删除书签失败');
//       }
//     )
//     .finally(() => (deletedDilog.value = false));
// };

// //看板
// const currentRow = ref({});
// const dashboardDialog = ref(false);
// const dashboard = ref([]);

// const usedDashboard = (row: any) => {
//   if (!usedStatistic.value[row.id]) return false;
//   currentRow.value = row;
//   dashboardDialog.value = true;
//   statistic.getDashboard(row.id).then(
//     res => {
//       dashboard.value = res.data.data;
//     },
//     () => {
//       // TODO
//     }
//   );
//   console.log(row);
// };

// const toDashboard = (row: any) => {
//   let type = 'user';
//   if (row.isSystem) type = 'system';
//   const { href } = router.resolve({
//     path: `/${route.params.token}/overview/data-board`,
//     query: { type: type, id: row.id }
//   });
//   window.open(href, '_blank');
// };

// const analysisType = ref() as Ref<AnalysisTypeEnum>;
// const statisticPanelRef = ref<InstanceType<typeof StatisticPanel>>();
// const editStatistic = (row: any) => {
//   analysisType.value = row.analysisType;
//   statisticPanelRef.value?.open(StatisticPanelOpenTypeEnum.Edit, row);
// };

// const isCheckbox = reactive({
//   checkMethod: ({ row }: any) => {
//     return row.bornType === 1;
//   }
// });

// watch(() => [statistic.pagination, props.updateList], sj.debounce(getStatisticList, 200), {
//   deep: true
// });
// watch(
//   () => [statistic.statisticFilter, statistic.filterSearch],
//   () => {
//     getStatisticList();
//     statistic.pagination.pageNbr = 1;
//   },
//   {
//     deep: true,
//     immediate: true
//   }
// );

// onMounted(() => {
//   statistic.filterSearch = '';
// });

// watchEffect(() => {
//   console.log(analysisType.value, selectedRecords.value);
// });

// const getIconAndName = (analysisType: number, reportType: number, value: 'name' | 'key') => {
//   const base = analysisTypeMap[analysisType]['reportTypeMap'][reportType][value];
//   if (value === 'name') return base;
//   else return chartIconMap[base]['icon'];
// };

import { ElTable } from 'element-plus';
import { computed, ref } from 'vue';

interface User {
  uuid: string;
  template: string;
  name: string;
  type: number;
  createTime: string;
  isFreeze: string;
  lookedPeople: string;
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const toggleSelection = (rows?: User[]) => {
  if (rows) {
    rows.forEach(row => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
};
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};

const tableData: User[] = [
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  },
  {
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    template: '模板1',
    name: '小宇',
    type: 0,
    createTime: '2021-11-05 12:31:55',
    isFreeze: '否',
    lookedPeople: '200'
  }
];

const tableData1 = computed(() => formatData(originListData.value));

const currentRow = ref({} as any);

const previewWritDraw = ref(false);
const openPreviewWritDraw = (row: any) => {
  previewWritDraw.value = true;
  currentRow.value = row;
};

const editFormDraw = ref(false);
const openEditFormDraw = (row: any) => {
  editFormDraw.value = true;
  currentRow.value = row;
  console.log(row);
};
const writOrigin = ref('');
</script>

<template>
  <div class="absolute right-0 top-0 w-full h-full">
    <el-table
      ref="multipleTableRef"
      border
      height="100%"
      :data="tableData1"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="name" label="姓名" width="120" />
      <el-table-column property="uuid" label="唯一秘钥" width="330" show-overflow-tooltip> </el-table-column>
      <el-table-column property="type" label="类型" show-overflow-tooltip width="120" />
      <el-table-column property="phone" label="手机号" width="120" />
      <el-table-column label="是否冻结" width="90">
        <template #default="{ row }"
          ><div :class="{ 'text-red-600': row.isFreeze === '是', 'font-bold': true }">{{ row.isFreeze }}</div></template
        >
      </el-table-column>
      <el-table-column property="template" label="模板名称" width="120" />
      <el-table-column label="查看人数" width="120">
        <template #default="{ row }">{{ row.lookedPeople }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="240">
        <template #default="{ row }">{{ row.createTime }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div class="flex items-center justify-center space-x-2 spanDivider">
            <el-button link type="primary" @click="openPreviewWritDraw(row)">
              预览文书 <span class="ml-4 text-gray-600">|</span></el-button
            >
            <el-button link type="primary" @click="openEditFormDraw(row)"> 编辑表单 </el-button>
            <span>|</span>
            <el-button link :type="row.isFreeze === '否' ? 'danger' : 'primary'" @click="">
              {{ row.isFreeze === '否' ? '冻结查看' : '解冻查看' }}
            </el-button>
            <span>|</span>
            <el-popconfirm
              width="200"
              confirm-button-text="确定"
              cancel-button-text="取消"
              title="是否确实删除本条数据?"
              @confirm="deleteSingleForm(row?.uuid ?? '')"
            >
              <template #reference>
                <el-button link type="danger"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer v-model="previewWritDraw" :with-header="false" size="100%">
      <main class="w-full h-full flex flex-col relative">
        <header class="absolute top-0 right-0">
          <StIcon icon="close" type="info" plain zoom @click="previewWritDraw = false" />
        </header>
        <section class="flex-grow -mt-2">
          <Writ writString="" />
        </section>
      </main>
    </el-drawer>

    <el-drawer v-model="editFormDraw" :with-header="false">
      <main class="w-full h-full flex flex-col relative">
        <header class="absolute top-0 right-0">
          <StIcon icon="close" type="info" plain zoom @click="editFormDraw = false" />
        </header>
        <section class="flex-grow space-y-5">
          <el-input v-model="currentRow.name" disabled><template #prepend>姓名</template></el-input>
          <el-input v-model="currentRow.uuid" disabled><template #prepend>UUID</template></el-input>
          <el-input v-model="writOrigin" maxlength="15000" show-word-limit type="textarea" rows="30" placeholder="输入文书HTML" />
          <el-popconfirm
            width="320"
            confirm-button-text="确定"
            cancel-button-text="取消"
            title="确定提交文书?"
            @confirm="updateWrit(currentRow.origin, writOrigin)"
          >
            <template #reference>
              <el-button type="primary" class="mx-auto mt-4 w-full">提交保存</el-button>
            </template>
          </el-popconfirm>
        </section>
      </main>
    </el-drawer>

    <!-- 删除弹窗组件 -->
    <!-- <div v-show="selectedRecords.length > 0" class="w-[17%] absolute left-5 bottom-4 flex items-center space-x-3">
      <span class="inline-block text-sm box-border w-[150px]"
        >已选书签: {{ selectedRecords.length + '/' + statisticList.length }} 条</span
      >
      <el-button
        type="primary"
        size="small"
        status="danger"
        icon="clear2"
        @click="selectedRecords.length === 0 ? deleteConfirm() : (deletedDilog = true)"
      >
        删除
      </el-button>
    </div> -->
  </div>

  <!-- 删除警告 -->
  <!-- 批量删除 -->
  <!-- <el-dialog v-if="selectedRecords.length === 1" v-model="deletedDilog" title="删除警告" width="25%">
    <div>
      书签
      <span class="text-base text-red-600 font-medium">{{ `[ ${selectedRecords[0].bookName} ]` }}</span>
      可能已应用于看板中，删除该书签将会使看板中应用该书签的书签失效，是否确认？
    </div>
    <template #footer>
      <div class="space-x-3">
        <StButton size="small" @click="deletedDilog = false">取消</StButton>
        <StButton size="small" type="primary" status="danger" @click="deleteConfirm">确认</StButton>
      </div>
    </template>
  </el-dialog>

 
  <el-dialog v-else v-model="deletedDilog" title="批量删除警告" width="25%">
    <div>
      书签可能已应用到看板，是否确认删除批量选中的
      <span class="text-base text-red-600 font-semibold">{{ selectedRecords.length }}</span>
      个书签？
    </div>
    <template #footer>
      <div class="space-x-3">
        <StButton size="small" @click="deletedDilog = false">取消</StButton>
        <StButton size="small" type="primary" statue="danger" @click="deleteConfirm">确认</StButton>
      </div>
    </template>
  </el-dialog> -->
</template>

<style lang="postcss" scoped></style>
