let date = {
  uuid: '123e4567-e89b-12d3-a456-426655440000', //uuid前端也可以生成
  name: '小明', //表单姓名,这个前端限制必填
  type: 0, //表单类型
  phone: 1321313231, //手机号
  templateName: '模板1', //模板名称
  templateTitle: '这是模板的标题', //模板标题
  createTime: 1695539826390, //创建时间
  isFreeze: false, //冻结查看
  lookedPeople: ['41545-ada', 'dada-55'], // 查看过的人, string数组
  
  //formData数据是一个json序列化的结果，不需要关心里面的内容，给什么存什么取什么
  formData: /*json序列化*/ JSON.stringify({
    //表单内容
    phoneNumber: '13154661156',
    IDNumber: '451456188805235546',
    isBasicLiving: false ,
    IdHeadImg:'图片的url'
    //....之类的
  })
};

let date = {
  uuid: '123e4567-e89b-12d3-a456-426655440000', //uuid前端也可以生成
  name: '小明', //表单姓名,这个前端限制必填
  type: 0, //表单类
  templateName: '模板1', //模板名称
  templateTitle: '这是模板的标题', //模板标题
  createTime: 1695539826390, //创建时间
  isFreeze: false //冻结查看
};





