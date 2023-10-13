<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import Upload from '@/components/Upload.vue';
import StDynamicArea from '@/components/base/StDynamicArea.vue';
import StSidePanel from '@/components/base/StSidePanel.vue';

import { formData, saveForm ,updateForm} from './form';
import { querySingleFormApi ,deleteFormApi} from '@/services/api/businessApi';

const sideVisible = ref(false);
const menu = [
  {
    name: '表单模板',
    children: [
      {
        name: '模板1',
        value: '/icon'
      },
      {
        name: '模板2',
        value: '/icon'
      },
      {
        name: '模板3',
        value: '/icon'
      }
    ]
  }
];

const dynamicAreaRef = ref();
watch(sideVisible, () => {
  dynamicAreaRef.value.area1.visible = sideVisible.value;
});

onMounted(() => {
  // querySingleFormApi('5ec8fb77-1a36-4a23-a874-e0ece8f41dbf')
});
</script>

<template>
  <StDynamicArea
    ref="dynamicAreaRef"
    :area1="{ minSize: 80, curSize: 140, maxSize: 640, button: false, offset: 0, visible: false }"
  >
    <template #area1>
      <StSidePanel v-model:visible="sideVisible">
        <aside>
          <div v-for="item in menu">
            <div class="group">{{ item.name }}</div>
            <div v-for="childrenItem in item.children || []" :class="{ active: true, 'item-class': true }">
              {{ childrenItem.name }}
            </div>
          </div>
        </aside>
      </StSidePanel>
    </template>
    <template #default>
      <main class="form flex relative w-full h-full bg-[#ebedf0]">
        <el-backtop :bottom="15" :right="20" target=".form > div.max-w-4xl" />
        <StIcon
          class="absolute top-4 left-4 transition cursor-pointer rounded text-blue-600 bg-blue-150 hover:bg-blue-400 hover:text-white"
          :class="{ 'opacity-0 ': sideVisible === true, 'animate-pulse': sideVisible === false }"
          title="点击展开模板界面"
          plain
          icon="dire3"
          type="primary"
          :rotate="-90"
          @click="() => (sideVisible = true)"
        />
        <div class="w-full h-[calc(100%-60px)] max-w-4xl mx-auto p-5 bg-white overflow-y-auto">
          <header class="text-center mb-5 font-bold text-xl text-[#1ea0fa]">个人信息密码箱</header>
          <el-form ref="form" :model="formData" label-width="auto" label-position="top">
            <el-form-item label="1.姓名">
              <el-input v-model="formData.name" />
            </el-form-item>

            <el-form-item label="2.电话">
              <el-input v-model="formData.phoneNumber" />
            </el-form-item>

            <el-form-item label="3.身份证号">
              <el-input v-model="formData.IDNumber" />
            </el-form-item>

            <el-form-item label="4.是否低保">
              <el-radio-group v-model="formData.isBasicLiving">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>

            <el-form-item label="5.有无案底">
              <el-radio-group v-model="formData.isCriminalRecord">
                <el-radio label="有" />
                <el-radio label="无" />
              </el-radio-group>
            </el-form-item>

            <el-form-item label="6.手机是否实名并满半年">
              <el-radio-group v-model="formData.isRealNamePhone">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>

            <el-form-item label="7.银行卡是否是一类卡">
              <el-radio-group v-model="formData.isFirstCard">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>

            <el-form-item label="8.出发地点">
              <el-input v-model="formData.departPort" />
            </el-form-item>

            <el-form-item label="9.出发日期">
              <el-input v-model="formData.departDate" />
            </el-form-item>

            <el-form-item label="10.是否能随时出发">
              <el-radio-group v-model="formData.isAnyTimeDepart">
                <el-radio label="是" />
                <el-radio label="否"
              /></el-radio-group>
            </el-form-item>

            <el-form-item label="11.当地机场名字">
              <el-input v-model="formData.localAirportName" />
            </el-form-item>
            <el-form-item label="到机场大概时长">
              <el-radio-group v-model="formData.toAirportTime">
                <el-radio label="30分钟" />
                <el-radio label="60分钟" />
                <el-radio label="90分钟" />
                <el-radio label="120分钟" />
                <el-radio label="120分钟以上" />
              </el-radio-group>
            </el-form-item>

            <el-form-item label="12.当地高铁站名字">
              <el-input v-model="formData.localHighSpeedStationName" />
            </el-form-item>

            <el-form-item label="13.到高铁站大概时长">
              <el-radio-group v-model="formData.toHighSpeedStationTime">
                <el-radio label="30分钟" />
                <el-radio label="60分钟" />
                <el-radio label="90分钟" />
                <el-radio label="120分钟" />
                <el-radio label="120分钟以上" />
              </el-radio-group>
            </el-form-item>
            <!-- 
            <el-form-item label="14.身份证">
              <div class="space-x-3 flex">
                <Upload tip="上传身份证头像页">
                  <el-image src="\image\IDHead2.png" class="w-40 h-24"></el-image>
                </Upload>
                <Upload tip="上传身份证国徽页">
                  <el-image src="\image\IDNational2.png" class="w-40 h-24"></el-image>
                </Upload>
              </div>
            </el-form-item>

            <el-form-item label="15.银行卡">
              <div class="space-x-3 flex">
                <Upload tip="上传身份证头像页">
                  <el-image src="\image\IDHead2.png" class="w-40 h-24"></el-image>
                </Upload>
                <Upload tip="上传身份证国徽页">
                  <el-image src="\image\IDNational2.png" class="w-40 h-24"></el-image>
                </Upload>
              </div>
            </el-form-item>

            <el-form-item label="16.芝麻信用和守约记录">
              <el-upload
                v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card"
                show-file-list
              >
                <StIcon icon="add" :size="16" type="primary" :round="0" />
              </el-upload>
            </el-form-item>

            <el-form-item label="17.户口本(本人页)">
              <el-upload
                v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card"
                show-file-list
              >
                <StIcon icon="add" :size="16" type="primary" :round="0" />
              </el-upload>
            </el-form-item>

            <el-form-item label="18.征信报告">
              <el-upload
                v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card"
                show-file-list
              >
                <StIcon icon="add" :size="16" type="primary" :round="0" />
              </el-upload>
            </el-form-item> -->

            <!-- <el-form-item label="19.视频">
              <el-input v-model="sizeForm.name" />
            </el-form-item> -->

            <el-form-item label="20.备注">
              <el-input v-model="formData.remark" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="mx-auto mt-4" @click="saveForm(true)">提交保存</el-button>
              <el-button type="primary" class="mx-auto mt-4" @click="updateForm()">更新表单</el-button>
              <el-button type="primary" class="mx-auto mt-4" @click="deleteFormApi('112,113')">删除</el-button>
            </el-form-item>
          </el-form>
          <footer class="flex items-center">
            <StIcon icon="user3Fill" type="info" :round="60" />
            <span class="text-gray-400 text-xs font-bold">查看过的人 13 </span>
          </footer>
        </div>
      </main>
    </template>
  </StDynamicArea>
</template>

<style lang="postcss" scoped>
aside {
  @apply w-40  flex-shrink-0 overflow-y-scroll overflow-x-hidden text-sm pr-2 px-3 box-border bg-white;
}
aside .group {
  @apply p-2 box-border text-base font-semibold text-gray-600 mt-2 cursor-default;
}
aside .item-class {
  @apply mx-2 box-border cursor-pointer text-gray-500;
  @apply block p-2 box-border transform duration-200 truncate;
}
aside .item-class:hover {
  @apply text-blue-400;
}
aside .item-class.active {
  @apply text-blue-400 bg-blue-50 rounded;
}
</style>
