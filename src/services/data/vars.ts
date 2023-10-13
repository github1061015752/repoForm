const vars = {
  flag_apt: 'aUpK',
  flag_user: 'user',
  flag_group_id: 'groupId',
  flag_date: '_st_date',

  app_mobile: 0,
  app_h5: 3,

  icon_android: 'fab fa-android',
  icon_ios: 'fab fa-apple',
  icon_h5: 'fab fa-html5',

  type_string: 0,
  type_number: 1,
  type_not_number: -1,
  type_boolean: 2,
  type_date: 3,

  type_event_prop: 0,
  type_user_prop: 1,
  type_session_prop: 2,

  limit_max_indicator: 30,
  limit_max_filter: 20,

  limit_max_dimension: 10,

  limit_max_list: 7,
  limit_option_width: 10,

  type_default_interval: 0,
  type_discrete_interval: 1,
  type_customize_interval: 2,
  type_min_interval: 0,
  type_hour_interval: 1,
  type_day_interval: 2,
  type_week_interval: 3,
  type_month_interval: 4,

  relation_or: 0,
  relation_and: 1,

  check_off: 'off',
  check_some: 'some',
  check_on: 'on'
} as const;

Object.freeze(vars);

const platformMap = {
  0: { name: 'ANDROID', icon: 'fab fa-android' },
  1: { name: 'IOS', icon: 'fab fa-apple' },
  2: { name: 'MINI_PROGRAM', icon: '' },
  3: { name: 'HTML5', icon: 'fab fa-html5' }
} as const;
Object.freeze(platformMap);

const color = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
  '#0589B9',
  '#749F83',
  '#CA8622',
  '#FF815C',
  '#30434E',
  '#E066FF',
  '#0E9688',
  '#D0B004',
  '#D82B01',
  '#D86F96',
  '#996633',
  '#990133',
  '#E5B484',
  '#3466CC',
  '#FE99CC',
  '#FCBE7F',
  '#FE6666',
  '#99CC66',
  '#CC0666',
  '#109966',
  '#C1A909',
  '#1340A7',
  '#C2550E',
  '#D84F20',
  '#FE9F7F',
  '#FFD700'
] as const;

const formMap = [
  {
    field: 'name',
    cn_name: '姓名'
  },
  {
    field: 'phoneNum',
    cn_name: '电话号码'
  },
  {
    field: 'phoneNumber',
    cn_name: '电话号码'
  },
  {
    field: 'IDNumber',
    cn_name: '身份证号码'
  },
  {
    field: 'isBasicLiving',
    cn_name: '是否低保'
  },
  {
    field: 'isCriminalRecord',
    cn_name: '有无案底'
  },
  {
    field: 'isRealNamePhone',
    cn_name: '手机是否实名并满半年'
  },
  {
    field: 'isFirstCard',
    cn_name: '银行卡是否是一类卡'
  },
  {
    field: 'departPort',
    cn_name: '出发点'
  },
  {
    field: 'departDate',
    cn_name: '出发日期'
  },
  {
    field: 'isAnyTimeDepart',
    cn_name: '是否能随时出发'
  },
  {
    field: 'localAirportName',
    cn_name: '当地机场名字'
  },
  {
    field: 'toAirportTime',
    cn_name: '到机场大概时长'
  },
  {
    field: 'localHighSpeedStationName',
    cn_name: '当地高铁站名字'
  },
  {
    field: 'toHighSpeedStationTime',
    cn_name: '到高铁站大概时长'
  },
  {
    field: 'IDFrontImg',
    cn_name: '身份证头像页'
  },
  {
    field: 'IDNationalImg',
    cn_name: '身份证国徽页'
  },
  {
    field: 'bankCardImg',
    cn_name: '银行卡'
  },
  {
    field: 'creditImg',
    cn_name: '芝麻信用和守约记录'
  },
  {
    field: 'registeredBookImg',
    cn_name: '户口本'
  },
  {
    field: 'creditReport',
    cn_name: '征信报告'
  },
  {
    field: 'video',
    cn_name: '视频'
  },
  {
    field: 'remark',
    cn_name: '备注'
  }
];

export { vars, platformMap, color, formMap };
