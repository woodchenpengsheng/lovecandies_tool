'use strict';

/*
	This file is located in the "modules" block of plugin.json
	It is only loaded when the user navigates to /admin/plugins/recharge page
	It is not bundled into the min file that is served on the first load of the page.
*/

import { save, load } from 'settings';
import * as uploader from 'uploader';
import * as hooks from 'hooks';

export function init() {
	handleSettingsForm();
	setupUploader();
};

function handleSettingsForm() {
	load('recharge', $('.recharge-settings'), function () {
		setupColorInputs();
		handleServiceId();
	});

	$('#save').on('click', () => {
		save('recharge', $('.recharge-settings')); // pass in a function in the 3rd parameter to override the default success/failure handler
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
