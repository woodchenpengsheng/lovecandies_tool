'use strict';

/*
	This file is located in the "modules" block of plugin.json
	It is only loaded when the user navigates to /admin/plugins/recharge page
	It is not bundled into the min file that is served on the first load of the page.
*/

import { save, load } from 'settings';
import * as uploader from 'uploader';
import * as hooks from 'hooks';
import * as alerts from 'alerts';
import * as helpers from 'helpers';
import { serviceTypes } from '../../lib/rechargeDefine';

export function init() {
	handleSettingsForm();
	setupUploader();
};

function handleSettingsForm() {
	handleLoadServiceTypes();
	load('recharge', $('.recharge-settings'), function () {
		setupColorInputs();
		handleServiceId();
		handleDirectAddReputation();
		handleDirectAddVipDay();
	});

	$('#save').on('click', () => {
		save('recharge', $('.recharge-settings')); // pass in a function in the 3rd parameter to override the default success/failure handler
	});
}

function handleDirectAddReputation() {
	$('#start-add-reputation').on('click', function (event) {
		socket.emit('admin.plugins.recharge.directAddReputation', {
			userName: $('#reputation-add-user-name').val(),
			reputation: $('#reputation-add-value').val(),
		}, function (err, currentReputation) {
			if (err) {
				return alerts.error(err);
			}
			alerts.success(`增加声望成功，用户现在的声望值为：${currentReputation}`);
		}); 
	});
}

function handleDirectAddVipDay() {
	$('#start-add-vip-day').on('click', function (event) {
		socket.emit('admin.plugins.recharge.directAddVipDays', {
			userName: $('#vip-add-user-name').val(),
			days: $('#vip-add-day-value').val(),
		}, function (err, expireTime) {
			if (err) {
				return alerts.error(err);
			}

			if (!expireTime) {
				alerts.success("已经成功关停vip服务");
			} else {
				alerts.success(`您的vip有限期到:${helpers.isoTimeToLocaleString(expireTime)}`);
			}
			
		}); 
	});
}

function handleServiceId() {
	hooks.on("action:settings.sorted-list.modal", (data) => {
		const originServiceId = $(data.modal).find('input[name="serviceId"]').val();
		// 说明是编辑状态，不用重新获取新的服务编号
		if (originServiceId) {
			return;
		}
		// 说明是新建，需要重新拿编号
		socket.emit('admin.plugins.recharge.getServiceId', (err, serviceId) => {
			$(data.modal).find('input[name="serviceId"]').val(serviceId);
		})
	})
}

function handleLoadServiceTypes() {
	const handleServiceTypes = Object.keys(serviceTypes).map(
		code => ({ name: serviceTypes[code], value: code, selected: false })
	);

	hooks.on("filter:settings.sorted-list.load", async (data) => {
		data.formValues.serviceTypes = handleServiceTypes;
		return data
	})
}

function setupColorInputs() {
	var colorInputs = $('[data-settings="colorpicker"]');
	colorInputs.on('change', updateColors);
	updateColors();
}

function updateColors() {
	$('#preview').css({
		color: $('#color').val(),
		'background-color': $('#bgColor').val(),
	});
}

function setupUploader() {
	$('#content input[data-action="upload"]').each(function () {
		var uploadBtn = $(this);
		uploadBtn.on('click', function () {
			uploader.show({
				route: config.relative_path + '/api/admin/upload/file',
				params: {
					folder: 'recharge',
				},
				accept: 'image/*',
			}, function (image) {
				$('#' + uploadBtn.attr('data-target')).val(image);
			});
		});
	});
}
