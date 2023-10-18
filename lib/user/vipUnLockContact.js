const { rechargeVipName } = require("../database/define");
const db = require.main.require('./src/database');
const batch = require.main.require('./src/batch');
const Topic = require('../topic');
const async = require('async');

module.exports = function (User) {
    User.vipUnLockTopic = async function(uid, tid) {
        const key = `uid:${uid}:${rechargeVipName}`;
		const now = Date.now();
		await db.sortedSetAdd(key, now, tid);
    }

    // 判断某一个用户在某一个tid下是否已经解锁成功了？
	User.isUnLockVipContact = async function (uid, tid) {
		const key = `uid:${uid}:${rechargeVipName}`;
		return await db.isSortedSetMember(key, tid);
	};

	User.getUnLockVipContacts = async function (uid) {
		return await db.getSortedSetRange(`uid:${uid}:${rechargeVipName}`, 0, -1);
	};

	User.deleteUserData = async function(uid) {
		await batch.processSortedSet(`uid:${uid}:${rechargeVipName}`, async (ids) => {
			await async.eachSeries(ids, async (tid) => {
				await Topic.deleteVipContact(uid, tid);
			});
		}, {});
		const key = `uid:${uid}:${rechargeVipName}`;
		await db.delete(key);
	};

	User.deleteVipContact = async function (uid, tid) {
		const key = `uid:${uid}:${rechargeVipName}`;
		await db.sortedSetRemove(key, tid);
	};
}