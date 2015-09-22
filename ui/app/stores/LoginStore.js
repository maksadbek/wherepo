var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var UserConstants = require('../constants/UserConstants');
var LoginConstants = require('../constants/LoginConstants');

var CHANGE_EVENT = 'change';

// errors object is used to store error messages, initially it is null. 
var errors = {
    signup: null
}

var LoginStore = assign({}, EventEmitter.prototype, {
    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },
    getErrors: function(){
        return errors
    },
    dispatcherIndex: AppDispatcher.register(function(action){
        switch(action.actionType){
            case LoginConstants.SET_LOGGED_IN:
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("fleet", action.payload.fleet);
                localStorage.setItem("login", action.payload.email);
                LoginStore.emitChange();
                break;
            case LoginConstants.SET_LOGGED_OUT:
                localStorage.clear();
                LoginStore.emitChange();
                break;
            case LoginConstants.SET_LOGIN_FAILED:
                errors.signup = "invalid username or password";
                LoginStore.emitChange();
                break
        }
        return true;
    }),
    isLoggedIn: function(){
        return !!localStorage.token
    }
});

module.exports = LoginStore;
