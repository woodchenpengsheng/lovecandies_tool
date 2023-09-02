function generateOrderNumber(subPrefixLength = 12) {
    // 获取当前日期和时间
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 生成随机字符后缀
    const randomChars = generateRandomChars(subPrefixLength); // 这里可以指定后缀的长度

    // 组合前缀和后缀生成订单号
    const orderNumber = `${year}${month}${day}${hours}${minutes}${seconds}${randomChars}`;

    return orderNumber;
}

function generateRandomChars(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomChars = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomChars += charset.charAt(randomIndex);
    }

    return randomChars;
}

// 输入array1, array2返回
// {
//     d: 'date'
// }

// const array1 = {
//     'a': 'apple',
//     'b': 'banana',
//     'c': 'cherry',
//     'd': 'date'
// };

// const array2 = {
//     'a': 'apricot',
//     'b': 'banana',
//     'c': 'cherry'
// };
function arrayDiffKey(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const diffKeys = keys1.filter(key => !keys2.includes(key));

    const result = {};

    diffKeys.forEach(key => {
        result[key] = obj1[key];
    });

    return result;
}

module.exports = {
    generateOrderNumber,
    arrayDiffKey,
}