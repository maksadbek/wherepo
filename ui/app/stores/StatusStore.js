var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var lodash = require("lodash");

var AppDispatcher = require('../dispatcher/AppDispatcher');

var StatusConstants = require('../constants/StatusConstants');
var UserConstants = require('../constants/UserConstants');

var CHANGE_EVENT = 'change';

var host = "online.maxtrack.uz";
var positionURL = "http://"+host+":8080/positions";

var StatusStore = assign({}, EventEmitter.prototype, {
    carStats: {},
    markers: [],
    selectedGroup: 3,
    sendAjax: function(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', encodeURI(positionURL));
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onload = function() {
            if (xhr.status === 200 ) {
                StatusStore.carStats = JSON.parse(xhr.responseText);
                StatusStore.emitChange();
            }
            else if (xhr.status !== 200) {
                console.warn("ajax request failed");
            }
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
            case StatusConstants.AddMarker:
                console.log(action.info);
                StatusStore.markers = lodash.union(StatusStore.markers, action.info);
                console.log(StatusStore.markers);
                StatusStore.emitChange();
                break;
            case StatusConstants.DelMarker:
                lodash.remove(StatusStore.markers, function(id){
                    return action.info.indexOf(id) !== -1;
                });
                StatusStore.emitChange();
                break;
            case StatusConstants.ChangeGroup:
                this.selectedGroup = info.index;
                StatusStore.emitChange();
                break;
        }
        return true;
    })
});
module.exports =  StatusStore;
