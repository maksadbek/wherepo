var md5 = require('md5');

var host = "online.maxtrack.uz";
var authURL = "http://"+host+":8080/signup";
var LoginUtils = {
    sendSignup: function(payload, success, fail){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', encodeURI(authURL));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            resp = JSON.parse(xhr.responseText)
            if (xhr.status === 200 ) {
                success({
                    token: resp.token,
                    email: payload.email
                });
            } else if (xhr.status !== 200) {
                fail(resp);
            }
        };
        xhr.send(
            JSON.stringify({
                user: payload.email,
                hash: md5(payload.secret),
                uid: Math.random().toString(36).substring(8)
            })
        );
    }
}

module.exports = LoginUtils;
