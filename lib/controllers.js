'use strict';

const controllerHelpers = require.main.require('./src/controllers/helpers');
const nconf = require.main.require('nconf');
const meta = require.main.require('./src/meta');
const { generateOrderNumber, arrayDiffKey } = require('./utils');
const crypto = require('crypto');
const fetch = require("node-fetch-commonjs");
const { BarGainRequestStatus } = require('./btcDefine');
const Controllers = module.exports;

Controllers.renderAdminPage = function (req, res/* , next */) {
	/*
		Make sure the route matches your path to template exactly.

		If your route was:
			myforum.com/some/complex/route/
		your template should be:
			templates/some/complex/route.tpl
		and you would render it like so:
			res.render('some/complex/route');
	*/
	res.render('admin/plugins/recharge', {
		title: 'Recharge',
	});
};

Controllers.handleRechargeRequest = async (req, res) => {
	const price = 10 * 100;
	const metaSettings = await meta.settings.get("recharge");
	const clientOrderId = generateOrderNumber();
	// 获取btc交易所相关的配置信息
	const norifyUrl = new URL(metaSettings["notify-url"], nconf.get('url'));
	const key = metaSettings["api-key"];
	const clienet_id = parseInt(metaSettings["client-id"]);
	const requestURL = metaSettings["recharge-request-url"];
	// 生成请求数据，准备进行数字签名
	const prepareRequestData = {
		name: "月卡服务",
		price,
		client_order_id: clientOrderId,
		client_order_uid: String(req.uid),
		notify_url: norifyUrl,
		client_id: clienet_id,
		key,
	}
	// 步骤 1：按ASCII从小到大排序参数
	// 步骤 2：连接参数为url参数格式
	const sortedParams = Object.keys(prepareRequestData)
		.sort()
		.map(key => `${key}=${prepareRequestData[key]}`)
		.join('&');
	// 步骤 3：将所有字母转换成小写并去掉空格
	const formattedParams = sortedParams.toLowerCase().replace(/\s+/g, '');
	// 步骤 4：使用UTF8编码将字符串转换成字节流
	const utf8Bytes = Buffer.from(formattedParams, 'utf8');
	// 步骤 5：使用sha1算法进行哈希以生成sign参数
	const sha1Hash = crypto.createHash('sha1').update(utf8Bytes).digest('hex');
	prepareRequestData["sign"] = sha1Hash;
	// 步骤6: 去掉key关键字
	const resultPostData = arrayDiffKey(prepareRequestData, { key: "" });
	// 步骤7: 发送post请求
	// POST 请求的配置
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(resultPostData),
	};
	// 发送 POST 请求
	fetch(requestURL, requestOptions)
		.then(response => {
			if (!response.ok) {
				throw new Error("请求失败，请联系管理员用户admin");
			}
			return response.json(); // 解析 JSON 响应
		})
		.then(body => {
			if (body && body.status == BarGainRequestStatus.ok) {
				const visitUrl = body.data && body.data.visit_url;
				if (visitUrl === "") {
					throw new Error("支付平台异常，无法获得交易链接，请联系管理员admin");
				} else {
					controllerHelpers.formatApiResponse(200, res, {
						url: visitUrl,
					});
				}
			} else {
				throw new Error("支付平台状态码异常，请联系管理员admin");
			}
		})
		.catch(error => {
			controllerHelpers.formatApiResponse(400, res, error);
		});
}