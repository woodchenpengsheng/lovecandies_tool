'use strict';

/* eslint-disable no-tabs */
const nconf = require.main.require('nconf');
const winston = require.main.require('winston');

const meta = require.main.require('./src/meta');

const controllers = require('./lib/controllers');

const routeHelpers = require.main.require('./src/routes/helpers');

const plugin = {};

plugin.init = async (params) => {
	const { router /* , middleware , controllers */ } = params;

	// Settings saved in the plugin settings can be retrieved via settings methods
	const { setting1, setting2 } = await meta.settings.get('filterpostcontent');
	if (setting1) {
		console.log(setting2);
	}

	/**
	 * We create two routes for every view. One API call, and the actual route itself.
	 * Use the `setupPageRoute` helper and NodeBB will take care of everything for you.
	 *
	 * Other helpers include `setupAdminPageRoute` and `setupAPIRoute`
	 * */
	routeHelpers.setupPageRoute(router, '/filterpostcontent', [(req, res, next) => {
		winston.info(`[plugins/filterpostcontent] In middleware. This argument can be either a single middleware or an array of middlewares`);
		setImmediate(next);
	}], (req, res) => {
		winston.info(`[plugins/filterpostcontent] Navigated to ${nconf.get('relative_path')}/filterpostcontent`);
		res.render('filterpostcontent', { uid: req.uid });
	});

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/filterpostcontent', [], controllers.renderAdminPage);
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
 * 		http://example.org/api/v3/plugins/filterpostcontent/test \
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
		middleware.ensureLoggedIn, // use this if you want only registered users to call this route
		middleware.admin.checkPrivileges, // use this to restrict the route to administrators
	];

	routeHelpers.setupApiRoute(router, 'get', '/filterpostcontent/:param1', middlewares, (req, res) => {
		helpers.formatApiResponse(200, res, {
			foobar: req.params.param1,
		});
	});
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/filterpostcontent',
		icon: 'fa-tint',
		name: 'FilterPostContent',
	});

	return header;
};

plugin.filterPostContent = (postFieldData) => {
	const { posts, fields } = postFieldData;
	const pattern = /(联系方式|微信|电话|QQ)(:|：)(\s)*(1[0-9]{10}|[a-zA-Z0-9\-_]{6,16}|[0-9]{6,11})+/gi;
	const replacedText = '<span style="color:red">付费解锁哦</span>';
	if (fields.length <= 0 || fields.includes('content')) {
		posts.forEach((postData) => {
			if (!postData || !postData.content) {
				return;
			}
			postData.originContent = postData.content;
			postData.content = postData.content.replace(pattern, replacedText);
		});
	}
	return postFieldData;
};

module.exports = plugin;
