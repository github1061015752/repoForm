import { reactive } from 'vue';
import { v4 as uuid4 } from 'uuid';
import { addFormApi, updateFormApi } from '@/services/api/businessApi';

const formData = reactive({
  name: '', // '姓名'
  phoneNumber: '', // '电话号码'
  IDNumber: '', // '身份证号码'
  isBasicLiving: '否', // '是否低保'
  isCriminalRecord: '无', // '有无案底'
  isRealNamePhone: '否', // '手机是否实名并满半年'
  isFirstCard: '否', // '银行卡是否是一类卡'
  departPort: '', // '出发点'
  departDate: '', // '出发日期'
  isAnyTimeDepart: '否', // '是否能随时出发'
  localAirportName: '', // '当地机场名字'
  toAirportTime: '60分钟', // '到机场大概时长'
  localHighSpeedStationName: '', // '当地高铁站名字'
  toHighSpeedStationTime: '60分钟', // '到高铁站大概时长'
  IDFrontImg: '', // '身份证头像页'
  IDNationalImg: '', // '身份证国徽页'
  bankCardImg: '', // '银行卡'
  creditImg: '', // '芝麻信用和守约记录'
  registeredBookImg: '', // '户口本'
  creditReport: '', // '征信报告'
  video: '', // '视频'
  remark: '' // '备注'
});

export { formData };

function setMockData(no_: number) {
  function generateRandomPhoneNumber() {
    const prefixArray = ['13', '15', '17', '18']; // 常见的手机号前缀
    const randomPrefix = prefixArray[Math.floor(Math.random() * prefixArray.length)];
    const randomNumber = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, '0'); // 随机生成9位数字

    return randomPrefix + randomNumber;
  }
  function generateRandomIDCardNumber() {
    const randomID = Math.floor(Math.random() * 10000000000000)
      .toString()
      .padStart(13, '0');
    return randomID;
  }
  function generateRandomChineseName() {
    const randomNameLength = Math.floor(Math.random() * 2) + 2; // 随机生成2到3个汉字
    let randomChineseName = '';

    for (let i = 0; i < randomNameLength; i++) {
      const randomCharCode = Math.floor(Math.random() * (0x9fff - 0x4e00 + 1)) + 0x4e00; // 随机生成汉字的 Unicode 编码
      const randomChineseChar = String.fromCharCode(randomCharCode);
      randomChineseName += randomChineseChar;
    }

    return randomChineseName;
  }

  const randomPhoneNum = generateRandomPhoneNumber();
  const randomIDCardNumber = generateRandomIDCardNumber();
  const randomName = generateRandomChineseName();

  return {
    formData: `{"name":"${randomName}",
      "phoneNumber":${randomPhoneNum},
      "IDNumber":"${randomIDCardNumber}",
      "isBasicLiving":"否",
      "isCriminalRecord":"无",
      "isRealNamePhone":"否",
      "isFirstCard":"否",
      "departPort":"出发地点${no_}",
      "departDate":"出发日期${no_}",
      "isAnyTimeDepart":"否",
      "localAirportName":"出发机场${no_}",
      "toAirportTime":"60分钟",
      "localHighSpeedStationName":"出发高铁${no_}",
      "toHighSpeedStationTime":"60分钟",
      "remark":"备注${no_}"}`,
    isFreeze: true,
    lookedPeople: '1223',
    name: '迪迦',
    phoneNumber: randomPhoneNum,
    templateName: '模板1',
    templateTitle: '这是模板的标题',
    type: 1
  };
}

export function saveForm(mock = false) {
  // if (mock) {
  //   for (let i = 1; i <= 50; i++) {
  //     addFormApi(setMockData(i));
  //   }
  // }

  const date = {
    // uuid: uuid4(), //uuid前端也可以生成
    name: formData.name, //表单姓名,这个前端限制必填
    type: 0, //表单类型
    phoneNumber: sessionStorage.getItem('phone'), //手机号
    templateName: '模板1', //模板名称
    templateTitle: '这是模板的标题', //模板标题
    // createTime: Date.now, //创建时间
    isFreeze: false, //冻结查看
    lookedPeople: '1223', // 查看过的人, string数组
    formData:
      '{"name":"嬩娣渐","phoneNumber":17041223480,"IDNumber":"6573434825547","isBasicLiving":"否","isCriminalRecord":"无","isRealNamePhone":"否","isFirstCard":"否","departPort":"出发地点15","departDate":"出发日期15","isAnyTimeDepart":"否","localAirportName":"出发机场15","toAirportTime":"60分钟","localHighSpeedStationName":"出发高铁15","toHighSpeedStationTime":"60分钟","remark":"备注15"}'
  };

  addFormApi(date);

  console.log(date);
}

export function updateForm() {
  const date = {
    id: 'd5d8ef18-3f27-4f35-92d6-14fad9a8fc83',
    name: '赛罗', //表单姓名,这个前端限制必填
    type: 1, //表单类型
    phoneNumber: sessionStorage.getItem('phone'), //手机号
    templateName: '新模板1', //模板名称
    templateTitle: '这是模板的新标题', //模板标题
    // createTime: Date.now, //创建时间
    isFreeze: false, //冻结查看
    lookedPeople: '新1223', // 查看过的人, string数组

    formData: JSON.stringify(formData)
  };

  updateFormApi(date);

  console.log(date);
}
