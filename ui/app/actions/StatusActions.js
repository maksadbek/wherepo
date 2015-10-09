var AppDispatcher = require('../dispatcher/AppDispatcher');
var StatusConstants = require('../constants/StatusConstants');

var StatusActions = {
    addMarker: function(info){
        AppDispatcher.dispatch({
                actionType: StatusConstants.AddMarker,
                info: info
        });
    },
    delMarker: function(info){
        AppDispatcher.dispatch({
                actionType: StatusConstants.DelMarker,
                info: info
        });
    },
    selectGroup: function(info){
        AppDispatcher.dispatch({
            actionType: StatusConstants.ChangeGroup,
            info: info 
        });
    }
};

module.exports = StatusActions;
