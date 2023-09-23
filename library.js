'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');

const meta = require.main.require('./src/meta');
const user = require.main.require('./src/user');

const controllers = require('./lib/controllers');

const routeHelpers = require.main.require('./src/routes/helpers');
const socketAdmin = require.main.require('./src/socket.io/admin');
const DataBase = require('./lib/database/index.js');

const plugin = {};

socketAdmin.plugins.recharge = {};

socketAdmin.plugins.recharge.getServiceId = async function () {
	return await DataBase.getNextServiceId();
};

socketAdmin.plugins.recharge.directAddReputation = async function(socket, data) {
	const { userName, reputation } = data;
	const reputationAdd = parseInt(reputation, 10);
	if (!userName || !reputationAdd) {
		throw Error("uid或者reputation参数异常");
	}

	const uid = await user.getUidByUsername(data.userName);
	if (!uid) {
		throw Error('无法查找到该user，检查是否名字异常');
	}

	return await user.incrementUserReputationBy(uid, reputationAdd);
}

plugin.init = async (params) => {
	const { router, middleware /* controllers */ } = params;
	// Settings saved in the plugin settings can be retrieved via settings methods
	/**
	 * We create two routes for every view. One API call, and the actual route itself.
	 * Use the `setupPageRoute` helper and NodeBB will take care of everything for you.
	 *
	 * Other helpers include `setupAdminPageRoute` and `setupAPIRoute`
	 * */
	routeHelpers.setupPageRoute(router, '/recharge', [(req, res, next) => {
		winston.info(`[plugins/recharge] In middleware. This argument can be either a single middleware or an array of middlewares`);
		setImmediate(next);
	}, middleware.ensureLoggedIn], async (req, res) => {
		winston.info(`[plugins/recharge] Navigated to ${nconf.get('relative_path')}/recharge`);
		const rechargeData = await meta.settings.get("recharge");
		res.render('recharge', { uid: req.uid, services: rechargeData["services-list"]});
	});

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/recharge', controllers.renderAdminPage);
};

/**
 * If you wish to add routes to NodeBB's RESTful API, listen to the `static:api.routes` hook.
 * Define your routes similarly to above, and allow core to handle the response via the
 * built-in helpers.formatApiResponse() method.
 *
 * In this example route, the `ensureLoggedIn` middleware is added, which means a valid login
 * session or bearer token (which you can create via ACP > Settings > API Access) needs to be
 * passed in.
 *
 * To call this example route:
 *   curl -X GET \
 * 		http://example.org/api/v3/plugins/recharge/test \
 * 		-H "Authorization: Bearer some_valid_bearer_token"
 *
 * Will yield the following response JSON:
 * 	{
 *		"status": {
 *			"code": "ok",
 *			"message": "OK"
 *		},
 *		"response": {
 *			"foobar": "test"
 *		}
 *	}
 */
plugin.addRoutes = async ({ router, middleware, helpers }) => {
	const middlewares = [
		middleware.ensureLoggedIn,			// use this if you want only registered users to call this route
		// middleware.admin.checkPrivileges,	// use this to restrict the route to administrators	
	];

	routeHelpers.setupApiRoute(router, 'post', '/recharge/pay/', middlewares, controllers.handleRechargeRequest);
	routeHelpers.setupApiRoute(router, "post", '/recharge/notify/', [], controllers.handleNotifyRequest);
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/recharge',
		icon: 'fa-tint',
		name: 'recharge',
	});

	return header;
};

plugin.authenticateSkip = async (data) => {
	const metaSettings = await meta.settings.get("recharge");
	const notifyURL = metaSettings["notify-url"];
	if (!notifyURL) {
		return data;
	}
	data.skip.post.push(notifyURL);
	return data;
}

plugin.getThemeTopicData = async function(hookData) {
	const { topic } = hookData;
	const metaSettings = await meta.settings.get("recharge");
	topic["unlock::consume::reputation"] = parseInt(metaSettings["assume-reputation"]);
	return hookData;
}

module.exports = plugin;
