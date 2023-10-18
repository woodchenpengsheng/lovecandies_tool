const User = module.exports;


require('./vipUnLockContact')(User);


require.main.require('./src/promisify')(User);