const user = require.main.require('./src/user');

async function serviceHandler_ra(rechargeData) {
    const { client_order_uid, service_params } = rechargeData;
    return await user.incrementUserReputationBy(client_order_uid, parseInt(service_params, 10));
}

const serviceHandler = {
    ra: serviceHandler_ra,
}

module.exports = {
    serviceHandler,
}