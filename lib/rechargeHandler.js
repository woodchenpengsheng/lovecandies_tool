const _ = require('lodash');
const { costCurrency } = require('./rechargeDefine');
const { rechargeVipName, rechargeVipExpireName } = require('./database/define');
const user = require.main.require('./src/user');
const topic = require.main.require('./src/topics');
const events = require.main.require('./src/events');
const db = require.main.require('./src/database');
const User = require('./user');
const Topic = require('./topic');

async function serviceHandler_ra(rechargeData) {
    const { client_order_uid, service_params } = rechargeData;
    return await user.incrementUserReputationBy(client_order_uid, parseInt(service_params, 10));
}

async function serviceHandler_vip(uid, expireDays) {
    const open = expireDays > 0;
    await toogleVipEffective(uid, open);
    await setVipExpire(uid, expireDays);
    const expireTime = await user.getUserField(uid, rechargeVipExpireName);
    return {
        expireTime,
    }
}

async function vipUnLockTopic(caller, data) {
    const { uid, tid } = data;
    await User.vipUnLockTopic(uid, tid);
    await Topic.vipUnLockTopic(uid, tid);
    const identityData = await topic.identity.get(tid);
	const identityObject = JSON.parse(identityData.identity);
    await events.log({
		type: 'unlock-identity-vip',
		uid: caller.uid,
		targetUid: uid,
		ip: caller.ip,
		tid,
		identityStatus: topic.identity.getIdentitiyStatusContext(identityObject.identityStatus),
	});
}

async function toogleVipEffective(uid, open) {
    const effective = open ? 1 : 0;
    // 是否开通了vip
    const promises = [
        user.setUserField(uid, rechargeVipName, effective),
    ];
    if (open) {
        // 将这个用户的uid标记好，添加到这个key的数组里面
        promises.push(db.sortedSetAdd(`users:${rechargeVipName}:effective`, Date.now(), uid));
    } else {
        promises.push(db.sortedSetRemove(`users:${rechargeVipName}:effective`, uid));
        promises.push(db.deleteObjectField(`user:${uid}`, rechargeVipName));
    }

    await Promise.all(promises);
}

async function deleteVipUserData(uid) {
    await db.sortedSetRemove(`users:${rechargeVipName}:effective`, uid);
    await User.deleteUserData(uid);
}

async function deleteVipTopicData(tid) {
    await Topic.deleteTopicData(tid);
}

async function setVipExpire(uid, expireDays) {
    if (expireDays > 0) {
        // 判断用户当前是否已经是vip了，如果是的话，判断时间
        const beforeExpireTime = parseInt(await user.getUserField(uid, rechargeVipExpireName), 10);
        let expireStartTime = Date.now();
        if (isFinite(beforeExpireTime)) {
            expireStartTime = beforeExpireTime > expireStartTime ? beforeExpireTime : expireStartTime;
        }
        const oneDay = 1000 * 60 * 60 * 24;
		const expiry = expireStartTime + (oneDay * expireDays);
		await user.setUserField(uid, rechargeVipExpireName, expiry);
    } else {
        await db.deleteObjectField(`user:${uid}`, rechargeVipExpireName);
    }
}

async function checkVipExpire(uid) {
    const [isVip, expireTime] = await Promise.all([
        user.getUserField(uid, rechargeVipName),
        user.getUserField(uid, rechargeVipExpireName),
    ]);

    const expireTimeInt = parseInt(expireTime, 10);
    if (!isVip || !isFinite(expireTimeInt)) {
        return { result: false, msg: "[[recharge:not-vip]]" }
    }

    if (isVip && isFinite(expireTimeInt)) {
        const currentTime = Date.now();
        if (currentTime >= expireTimeInt) {
            await toogleVipEffective(uid, false);
            await setVipExpire(uid);
            return { result: false, msg: "[[recharge:vip-expire]]" }
        } else {
            return { result: true }
        }
    } else {
        return { result: false, msg: "[[recharge:not-vip]]" }
    }
}

async function checkUnLockVipPrivileges(tid, uid) {
	if ((isNaN(parseInt(tid, 10)) || !await topic.exists(tid))) {
        return { result: false, msg: '[[error:no-topic]]' };
	}

	if (!await topic.lockcontact.isTopicNeedUnLock(tid)) {
        return { result: false, msg: '[[error:topic-no-need-unlock]]' };
	}

	if (await User.isUnLockVipContact(uid, tid) || await Topic.isUnLockVipContact(uid, tid)) {
		return { result: false, msg: '[[error:already-unlock-contact]]' };
	}

	const [isAdmin, isGlobalMod] = await Promise.all([
		user.isAdministrator(uid),
		user.isGlobalModerator(uid),
	]);

	if (isAdmin || isGlobalMod) {
        return { result: false, msg: '[[error:no-need-unlock-contact]]' };
	}

    return { result: true};
};

function getServiceCurrency(services) {
    let serviceCostCurrency;
    if (services.serviceTypes === "ra") {
        serviceCostCurrency = costCurrency.yuan;
    } else if (services.serviceTypes === "vip") {
        const parameters = services.serviceParams.split(',');
        serviceCostCurrency = costCurrency[parameters[1]];
    }

    return serviceCostCurrency;
}

function formatServicesList(servicesList) {
    const costKey = Object.keys(costCurrency);
    servicesList.map((services) => {
        const serviceCostCurrency = getServiceCurrency(services);
        const valueList = costKey.map((value) => value === serviceCostCurrency)
        services.rechargePriceCurrency = _.zipObject(costKey, valueList);
    })
}

const serviceHandler = {
    ra: serviceHandler_ra,
    vip: serviceHandler_vip,
}

module.exports = {
    serviceHandler,
    formatServicesList,
    getServiceCurrency,
    deleteVipUserData,
    deleteVipTopicData,
    checkVipExpire,
    checkUnLockVipPrivileges,
    vipUnLockTopic,
}