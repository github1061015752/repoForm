/** 初始配置，打包注入 */
const buildSetup = {
  // 打包信息
  env: getArg(import.meta.env.st_replace_env),
  builtAt: getArg(st_replace_built_at),

  // 模块配置
  // app: {
  //   active: getArg(import.meta.env.st_replace_app_active), // 是否可以看 app 的应用
  // },
  bank: getArg(import.meta.env.st_replace_bank), // 影响：保险理财回溯、权限、菜单
  sdks: getArg(import.meta.env.st_replace_sdks),  // 是否可以为 sdks 新项目
  web: {
    active: getArg(import.meta.env.st_replace_web_active), // 是否可以看 web 应用
    session: getArg(import.meta.env.st_replace_web_session),
    heatmap: getArg(import.meta.env.st_replace_web_heatmap)
  }
};

updateBuildSetup();

/**
 * 读取部署配置（serverconfig.js），更新初始配置
 */
function updateBuildSetup() {
  const deployConfig = window._sjt_dict;
  if (deployConfig == null) return;

  deployConfig.getBuildSetup = getBuildSetup;
  setActiveAppType(deployConfig);
}

// 添加查看打包信息的接口，避免篡改配置
function getBuildSetup() {
  return JSON.parse(JSON.stringify(buildSetup));
}

function getArg(v) {
  if (v === 'false') return false;
  if (v === 'true') return true;
  return v;
}

/**
 * 读取部署配置时，更新各类型应用可用状态
 */
function setActiveAppType(deployConfig) {
  switch (deployConfig.MODULES_FLAG) {
    case 3:
      buildSetup.web.active = true;
    case 1:
      buildSetup.web.active = false;
    default:
      break;
  }
}

/**
 * 是否可以使用所有类型的应用
 */
function isAllAppTypeActive() {
  return [buildSetup.web.active].every(v => v === true);
}

export { buildSetup, isAllAppTypeActive };
