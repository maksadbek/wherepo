var AppDispatcher = require('../dispatcher/AppDispatcher');

var LoginConstants= require('../constants/LoginConstants');

var LoginUtils = require('../utils/LoginUtils');

var LoginActions = {
    sendSignup: function(payload){
        LoginUtils.sendSignup(
            payload,
            function(data){
                AppDispatcher.dispatch({
                    actionType: LoginConstants.SET_LOGGED_IN,
                    payload: data
                })
            },
            function(data){
                AppDispatcher.dispatch({
                    actionType: LoginConstants.SET_LOGIN_FAILED,
                    payload: data
                })
            }
        );
    },
    logOut: function(){
        AppDispatcher.dispatch({
            actionType: LoginConstants.SET_LOGGED_OUT
        });
    }
};

module.exports = LoginActions;
