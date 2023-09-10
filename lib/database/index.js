const { RechargeOrderStatus } = require("./define");

const db = require.main.require('./src/database');
const winston = require.main.require('winston');
const DataBase = module.exports;
// 数据库存储字段
const saveNewOrderDbKeys = ["name", "price", "client_order_id", "client_order_uid", "client_id"];
const rechargePrefixName = "0123btc:lovecandies:recharge";


function checkNewOrderData(transferData) {
    const transferDataKeys = Object.keys(transferData);
    return saveNewOrderDbKeys.filter((saveKey) => !transferDataKeys.includes(saveKey)) <= 0;
}

// 将发送数据转换成数据库存储字段
function transerPostData2DbSaveData(transferData) {
    if (!checkNewOrderData(transferData)) {
        winston.error('[recharge] database transfer post data error');
        return {};
    }

    return saveNewOrderDbKeys.reduce((acc, value) => {
        acc[value] = transferData[value];
        return acc;
    }, {});
}

DataBase.saveNewOrder = async function (data, appendData) {
    const orderId = data.client_order_id;
    const now = Date.now();
    // 标记当前订单的状态
    const transferdata = transerPostData2DbSaveData(data);
    const saveData = {...transferdata, "order_status": RechargeOrderStatus.Unpaid, "generate_time_stamp": now, ...appendData};
    await Promise.all([
        // 步骤一，存储订单到数据库中
        db.setObject(`${rechargePrefixName}:${orderId}`, saveData),
        // 步骤二，将订单和用户进行关联
        db.sortedSetAdd(`uid:${data.client_order_uid}:${rechargePrefixName}`, now, orderId),
        // 步骤三，对所有的订单按照时间进行排序
        db.sortedSetAdd(`${rechargePrefixName}:orderid`, now, orderId),
    ]);
    return data;
}

DataBase.getRechargesFields = async function (rechargeIds, fields) {
    if (!Array.isArray(rechargeIds) || !rechargeIds.length) {
        return [];
    }
    const keys = rechargeIds.map(rechargeId => `${rechargePrefixName}:${rechargeId}`);
    return await db.getObjects(keys, fields);
}

DataBase.getRechargeFields = async function (rechargeId, fields) {
    const posts = await DataBase.getRechargesFields([rechargeId], fields);
    return posts ? posts[0] : null;
};

DataBase.getRechargeField = async function (rechargeId, field) {
    const recharge = await DataBase.getRechargeFields(rechargeId, [field]);
    return recharge ? recharge[field] : null;
};

DataBase.getRechargeData = async function (rechargeId) {
    const recharges = await DataBase.getRechargesFields([rechargeId], []);
    return recharges && recharges.length ? recharges[0] : null;
};

DataBase.getRechargesData = async function (rechargeIds) {
    return await DataBase.getRechargesFields(rechargeIds, []);
};

DataBase.setRechargeFields = async function (rechargeId, data) {
    await db.setObject(`${rechargePrefixName}:${rechargeId}`, data);
};

DataBase.setRechargeField = async function (rechargeId, field, value) {
    await DataBase.setRechargeFields(rechargeId, { [field]: value });
};

