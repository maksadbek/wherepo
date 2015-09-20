var AppDispatcher = require('../dispatcher/AppDispatcher');

var LoginConstants= require('../constants/LoginConstants');

var LoginUtils = require('../utils/LoginUtils');

var LoginActions = {
    sendSignup: function(payload){
        LoginUtils.sendSignup(payload,
            AppDispatcher.dispatch({
                    actionType: LoginConstants.SET_LOGGED_IN,
                    payload: payload
            }),
            AppDispatcher.dispatch({
                    actionType: LoginConstants.SET_LOGIN_FAILED
            })
        );
    }
};

module.exports = LoginActions;
