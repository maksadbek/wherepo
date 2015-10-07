var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var lodash = require("lodash");

var AppDispatcher = require('../dispatcher/AppDispatcher');

var StatusConstants = require('../constants/StatusConstants');
var UserConstants = require('../constants/UserConstants');

var CHANGE_EVENT = 'change';

var carStats = {};

var host = "online.maxtrack.uz";
var positionURL = "http://"+host+":8080/positions";

var StatusStore = assign({}, EventEmitter.prototype, {
    carStats: {},
    markers: [],
    sendAjax: function(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', encodeURI(positionURL));
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onload = function() {
            if (xhr.status === 200 ) {
                StatusStore.carStats = JSON.parse(xhr.responseText);
            }
            else if (xhr.status !== 200) {
                console.log("ajax request failed");
            }
            StatusStore.emitChange();
        };
        xhr.setRequestHeader("X-Access-Token", localStorage.token);
        xhr.send(JSON.stringify({
                fleetID: localStorage.getItem("fleet"),
                userName: localStorage.getItem("login")
            })
        );
    },
    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback){
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback){
        this.removeListener(CHANGE_EVENT, callback);
    },
    dispatcherIndex: AppDispatcher.register(function(action){
        switch(action.actionType){
            case StatusConstants.SelectGroup:
                StatusStore.chosenGroupIndex = action.info.id;
                StatusStore.emitChange();
                break;
            case StatusConstants.AddMarker:
                StatusStore.markers = lodash.union(StatusStore.markers, action.info);
                StatusStore.emitChange();
                break;
            case StatusConstants.DelMarker:
                lodash.remove(StatusStore.markers, function(id){
                    return action.info.indexOf(id) !== -1;
                });
                StatusStore.emitChange();
                break;
        }
        return true;
    })
});
module.exports =  StatusStore;
