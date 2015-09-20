var host = "217.29.118.23";
var authURL = "http://"+host+":8080/signup";
var LoginUtils = {
    sendSignup: function(payload, success, fail){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', encodeURI(authURL));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            resp = JSON.parse(xhr.responseText)
            if (xhr.status === 200 ) {
                success();
            } else if (xhr.status !== 200) {
                fail();
            }
        };
        xhr.send(
            JSON.stringify({
                user: payload.email,
                hash: payload.secret,
                uid: Math.random().toString(36).substring(8)
            })
        );
    }
}

module.exports = LoginUtils;
