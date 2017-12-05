const axios = require('axios');

const API_KEY = 'NzA3Mi0xNTExNDg1MDA5NTQ1LTQzN2RkMWQyLTE4N2ItNDllYy1iZGQxLWQyMTg3YjA5ZWNjYQ==';
const API_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';
const API_URL = 'http://api.apistore.co.kr/kko/1';
const API_ID = 'chashwan';


exports.handle = function (e, ctx, cb) {

    var result = '';

    axios.defaults.headers.get['x-waple-authorization'] = API_KEY;
    axios.defaults.headers.get['Content-Type'] = API_CONTENT_TYPE;
    axios.get(API_URL + '/sendnumber/list/' + API_ID)
        .then(function (response) {
            result = response;
            console.log("succeed");
            console.log(response.data);
            cb(null, response.data)
        })
        .catch(function (error) {
            result = 'load Fail....';
            console.log(result);
            console.log(error);
            cb(error, "fail")
        });

    // cb(null, "request end")
};
