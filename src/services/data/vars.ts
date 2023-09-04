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

export { vars, platformMap, color };
