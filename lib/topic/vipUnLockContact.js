const { rechargeVipName } = require("../database/define");
const db = require.main.require('./src/database');
const batch = require.main.require('./src/batch');
const topic = require.main.require('./src/topics');
const user = require.main.require('./src/user');
const User = require('../user');
const async = require('async');

module.exports = function (Topic) {
    Topic.load = async function (topicData, uid) {
        const [
            checkNeedUnLock, isAdmin, isGlobalMod, isVipUnLock,
        ] = await Promise.all([
            topic.lockcontact.isTopicNeedUnLock(topicData.tid),
            user.isAdministrator(uid),
            user.isGlobalModerator(uid),
            Topic.isUnLockVipContact(uid, topicData.tid),
        ])

        if (!checkNeedUnLock || isAdmin || isGlobalMod || isVipUnLock) {
            topicData.vipUnLockContact = true;
        }

        if (topicData.reputationUnlockContact || topicData.vipUnLockContact) {
            topicData.unlockContact = true;
        }
    }

    Topic.vipUnLockTopic = async function (uid, tid) {
        const key = `tid:${tid}:${rechargeVipName}`;
        const now = Date.now();
        await db.sortedSetAdd(key, now, uid);
        const numUnLockVipContact = await db.sortedSetCard(key);
        await topic.setTopicField(tid, 'numUnLockVipContact', numUnLockVipContact);
    }

    Topic.isUnLockVipContact = async function (uid, tid) {
        const key = `tid:${tid}:${rechargeVipName}`;
        return await db.isSortedSetMember(key, uid);
    }

    Topic.deleteVipContact = async function (uid, tid) {
        const key = `tid:${tid}:${rechargeVipName}`;
        await db.sortedSetRemove(key, uid);
        const numUnLockVipContact = await db.sortedSetCard(key);
        await topic.setTopicField(tid, 'numUnLockVipContact', numUnLockVipContact);
    }

    Topic.deleteTopicData = async function(tid) {
        const key = `tid:${tid}:${rechargeVipName}`;
		await batch.processSortedSet(key, async (ids) => {
			await async.eachSeries(ids, async (uid) => {
				await User.deleteVipContact(uid, tid);
			});
		}, {});
		await db.delete(key);
    }
}