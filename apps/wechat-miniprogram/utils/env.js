let local = {};
try {
  // 本地私有配置（已在 .gitignore 忽略）
  // eslint-disable-next-line global-require, import/no-unresolved
  local = require('../config/env.local');
} catch (error) {
  local = {};
}

const base = require('../config/env');

module.exports = {
  ...base,
  ...local
};
