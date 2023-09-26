'use strict';

define('forum/topic/freeReputation', ['alerts', 'api'], function (alerts, api) {
	var freeReputation = {};
	freeReputation.init = function (tid, topicContainer) {
        topicContainer.on('click', '.free-reputation-topic', function () {
            // 将这个主题标题成免费的
            api.put(`/topics/${tid}/freeTopicReputation`, {
                free: true,
            })
            .then(() => {
                alerts.success("成功将当前的主题设置为免费的了");;
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            })
            .catch(alerts.error);


			return true;
		});

        topicContainer.on('click', '.reset-reputation-topic', function () {
            // 将这个主题标题成免费的
            api.put(`/topics/${tid}/freeTopicReputation`, {
                free: false,
            })
            .then(() => {
                alerts.success("成功将当前主题设置为付费的了");;
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            })
            .catch(alerts.error);
    
    
            return true;
        });
	};

    return freeReputation;
});