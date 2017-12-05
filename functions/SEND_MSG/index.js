const axios = require('axios');
const qs = require('qs');
const slackNode = require('slack-node');

const API_KEY = 'NzA3Mi0xNTExNDg1MDA5NTQ1LTQzN2RkMWQyLTE4N2ItNDllYy1iZGQxLWQyMTg3YjA5ZWNjYQ==';
const API_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';
const API_URL = 'http://api.apistore.co.kr/kko/1';
const API_ID = 'chashwan';
const SLACK_API = 'https://hooks.slack.com/services/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';

slack = new slackNode();
slack.setWebhook(SLACK_API);

function createMsg(data) {
    return '아래의 정보로 젤라또 파트너 제휴 신청이 접수 되었습니다.\n\n상호명 : '
        + data.shopName
        + '\n샵주소 : '
        + data.addrUserInput
        + '\n샵 전화번호 : '
        + data.shopTel
        + '\n원장님 성함 : '
        + data.ownerName
        + '\n원장님 휴대폰번호 : '
        + data.ownerMobileTel
        + '\n------------------\n입력해주신 정보를 기반으로 내부 검수 진행 후 '
        + data.ownerMobileTel
        + '으로 처리결과를 알려드리겠습니다. (영업일기준 2~5일 소요)\n\n감사합니다. 젤라또 드림';
}

function createAttachments(data, type) {

    var attachment = [
        {
            'color': 'good',
            'fields': [
                {
                    'title': '상호명',
                    'value': data.shopName,
                    'short': false
                },
                {
                    'title': '샵주소',
                    'value': data.addrUserInput,
                    'short': false
                },
                {
                    'title': '샵 전화번호',
                    'value': data.shopTel,
                    'short': false
                },
                {
                    'title': '원장님 성함',
                    'value': data.ownerName,
                    'short': false
                },
                {
                    'title': '원장님 연락처',
                    'value': data.ownerMobileTel,
                    'short': false
                }
            ]
        }
    ];

    if (type === 'fail') {
        attachment.color = 'danger';
    }
    return attachment;
}


exports.handle = function (e, ctx, cb) {

    var msg = createMsg(e);

    var data = {
        'phone': e.ownerMobileTel,
        'callback': '16445185',
        'reqdate': '',
        'msg': msg,
        'template_code': 'PC001',
        'failed_type': 'lms',
        'failed_msg': msg,
        'failed_subject': '젤라또 제휴안내'
    };

    axios.defaults.headers.post['x-waple-authorization'] = API_KEY;
    axios.defaults.headers.post['Content-Type'] = API_CONTENT_TYPE;
    axios.post(API_URL + '/msg/' + API_ID, qs.stringify(data))
        .then(function (response) {
            console.log("succeed");
            console.log(response.data);
            slack.webhook({
                channel: "#sms",
                username: "merchant-bot",
                text: "아래의 샵이 추가되어 알림톡으로 발송되었습니다",
                attachments: createAttachments(e, 'success')
            }, function (err, response) {
                console.log(response);
            });
            cb(null, response.data)
        })
        .catch(function (error) {
            console.log(error);
            slack.webhook({
                channel: "#sms",
                username: "merchant-bot",
                text: "아래의 샵이 추가되었지만 아래의 이슈로 인해 발송이 되지 않았습니다",
                attachments: createAttachments(e, 'fail')
            }, function (err, response) {
                console.log(response);
            });
            cb(error, "fail")
        });

};