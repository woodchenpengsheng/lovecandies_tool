'use strict';
/*
	This file is located in the "modules" block of plugin.json
	It is only loaded when the user navigates to /recharge page
	It is not bundled into the min file that is served on the first load of the page.
*/

define('forum/recharge', ['components', 'api', 'alerts'], function (components, api, alerts) {
	var module = {};
	module.init = function () {
		$('#last-p').text('recharge.js loaded!');
	};

	components.get("recharge/pay/button").on('click', function (e) {
		const serviceId = $(this).attr('data-service-id');
		const data = {
			serviceId,
		};

		api.post("/plugins/recharge/pay", data, function (err, data) {
			if (err) {
				return alerts.error(err);
			}
			if (data.url) {
				window.location.href = data.url;
			}
		});
	});

	return module;
});
