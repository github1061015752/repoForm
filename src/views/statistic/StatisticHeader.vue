<script setup lang="ts">
import { reactive, ref } from 'vue';
import { statisticFilter } from './statistic';

// import { ElMessage } from 'element-plus';
// import { reactive, watchEffect } from 'vue';
// import { statistic } from './statistic';

const emits = defineEmits(['filter', 'updateList']);

const filter = reactive({
  time: 0,
  analysisSelected: [],
  creatSeleted: [],
  creatTypeOpts: {
    0: { name: '系统预设' },
    1: { name: '手动创建' }
  },
  creatorSeleted: [],
  creatorOpts: {},
  dashboardSeleted: [],
  dashboardOpts: {} as any
  // refresh() {
  //   statistic.loading = true;
  //   statistic.getStatistic().then(() => {
  //     statistic.loading = false;
  //     ElMessage.success('刷新成功');
  //   });
  // }
});

const analysis = (result: any, type: string) => {
  console.log(result, type);
  if (type === 'analysis')
    emits('filter', {
      analysisType: result.map((item: any) => {
        return +item.key;
      })
    });

  if (type === 'createType')
    emits('filter', {
      bornType: result.map((item: any) => {
        return +item.key;
      })
    });

  if (type === 'dashboard') {
    let combineBkId = [] as any; //去重的书签id
    if (result?.length === 0) {
      combineBkId = undefined as any;
    } else {
      result.forEach((item: any) => {
        combineBkId.push.apply(combineBkId, filter.dashboardOpts[item.key].statisticList);
      });
      combineBkId = Array.from(new Set(combineBkId));
      combineBkId = combineBkId.filter((n: any) => n);
    }
    if (combineBkId?.length === 0) combineBkId[0] = 0;
    emits('filter', {
      statisticList: combineBkId
    });
  }
};

function initRange() {
  const end = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 0);
  return [start, end];
}

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: '今天',
    value: () => {
      const [start, end] = initRange();
      return [start, end];
    },
    previousText: '昨天',
    previous: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      return [start, end];
    }
  },
  {
    text: '昨天',
    value: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      return [start, end];
    },
    previousText: '前天',
    previous: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 2);
      end.setDate(end.getDate() - 2);
      return [start, end];
    }
  },
  {
    text: '本周',
    value: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      return [start, end];
    },
    previousText: '上周',
    previous: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      start.setDate(start.getDate() - 7);
      end.setMonth(start.getMonth());
      end.setDate(start.getDate() + 6);
      return [start, end];
    }
  },
  {
    text: '上周',
    value: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      start.setDate(start.getDate() - 7);
      end.setMonth(start.getMonth());
      end.setDate(start.getDate() + 6);
      return [start, end];
    },
    previousText: '上上周',
    previous: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      start.setDate(start.getDate() - 7 - 7);
      end.setMonth(start.getMonth());
      end.setDate(start.getDate() + 6);
      return [start, end];
    }
  },
  {
    text: '本月',
    value: () => {
      const [start, end] = initRange();
      start.setDate(1);
      return [start, end];
    },
    previousText: '上月',
    previous: () => {
      const [start, end] = initRange();
      start.setMonth(start.getMonth() - 1, 1);
      end.setDate(0);
      return [start, end];
    }
  },
  {
    text: '上月',
    value: () => {
      const [start, end] = initRange();
      start.setMonth(start.getMonth() - 1, 1);
      end.setDate(0);
      return [start, end];
    },
    previousText: '上上月',
    previous: () => {
      const [start, end] = initRange();
      end.setMonth(start.getMonth() - 1, 0);
      start.setMonth(start.getMonth() - 2, 1);
      return [start, end];
    }
  },
  {
    text: '前天',
    value: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 2);
      end.setDate(end.getDate() - 2);
      return [start, end];
    }
  },
  {
    text: '上上周',
    value: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      start.setDate(start.getDate() - 7 - 7);
      end.setMonth(start.getMonth());
      end.setDate(start.getDate() + 6);
      return [start, end];
    }
  },
  {
    text: '上上月',
    value: () => {
      const [start, end] = initRange();
      end.setMonth(start.getMonth() - 1, 0);
      start.setMonth(start.getMonth() - 2, 1);
      return [start, end];
    }
  },
  {
    text: '过去7天',
    value: () => {
      //不包括今天
      const [start, end] = initRange();
      start.setDate(start.getDate() - 7);
      end.setDate(end.getDate() - 1);
      return [start, end];
    }
  },
  {
    text: '过去30天',
    value: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 30);
      end.setDate(end.getDate() - 1);
      return [start, end];
    }
  },
  {
    text: '过去60天',
    value: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 60);
      end.setDate(end.getDate() - 1);
      return [start, end];
    }
  }
];
const value2 = ref('');
</script>

<template>
  <div class="w-full space-x-3 flex items-center justify-between px-5">
    <section class="w-full space-x-3 flex items-center justify-start">
      <!-- <el-select
        v-model="filter.analysisSelected"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="请选择模板"
        style="width: 240px"
      >
        <el-option
          v-for="item in [
            {
              value: '模板1',
              label: '模板1'
            },
            {
              value: '模板2',
              label: '模板2'
            },
            {
              value: '模板3',
              label: '模板3'
            }
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->

      <!--      multiple -->
      <el-select
        v-model="statisticFilter.type"
        collapse-tags
        collapse-tags-tooltip
        placeholder="请选择类型"
        style="width: 240px"
        clearable
      >
        <el-option
          v-for="item in [
            {
              value: '0',
              label: '案底查询'
            },
            {
              value: '1',
              label: '个人信息箱'
            }
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <div class="w-1/5">
        <el-date-picker
          v-model="statisticFilter.dateRange"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :shortcuts="shortcuts"
        />
      </div>

      <el-input v-model.lazy="statisticFilter.Search" @blur="analysis($event, 'search')" placeholder="表单唯一秘钥" class="w-1/5" clearable>
        <template #prefix>
          <StIcon icon="search" />
        </template>
      </el-input>
    </section>

    <el-button @click="emits('updateList')" class="mr-12 items-end">全部刷新</el-button>
  </div>
</template>

<style scoped></style>
