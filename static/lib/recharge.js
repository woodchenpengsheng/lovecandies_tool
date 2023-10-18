'use strict';
/*
	This file is located in the "modules" block of plugin.json
	It is only loaded when the user navigates to /recharge page
	It is not bundled into the min file that is served on the first load of the page.
*/

define('forum/recharge', ['components', 'api', 'alerts', 'helpers'], function (components, api, alerts, helpers) {
	var module = {};
	module.init = function () {
		$('#last-p').text('recharge.js loaded!');
	};

	components.get("recharge/pay/button").on('click', function (e) {
		const serviceId = $(this).attr('data-service-id');
		const reputationCost = $(this).attr('data-currency-reputation');
		const isReputationCost = JSON.parse(reputationCost.toLowerCase());
		const data = {
			serviceId,
		};
		
		const execute = function (ok) {
			if (!ok) {
				return;
			}
			api.post("/plugins/recharge/pay", data, function (err, data) {
				if (err) {
					return alerts.error(err);
				}
				if (data && data.url) {
					window.location.href = data.url;
				}
				if (data && isFinite(parseInt(data.leftReputation, 10)) && data.expireTime) {
					alerts.success(`[[recharge:reputation-unlock-succeed, ${data.leftReputation}, ${helpers.isoTimeToLocaleString(data.expireTime)}]]`);
				}
			});
		};

		if (isReputationCost) {
			const servicePrice = $(this).attr('data-service-price');
			const message = '[[recharge:vip-cost-reputation-unlock,' + servicePrice + ']]';
			bootbox.confirm(message, execute);
		} else {
			execute(true);
		}
	});

	return module;
});
