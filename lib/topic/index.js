const Topic = module.exports;

require('./vipUnLockContact')(Topic);

require.main.require('./src/promisify')(Topic);