var React = require('react');
var LoginStore = require('../stores/LoginStore');

function signedUp(nextState, replaceState) {
    if (LoginStore.isLoggedIn()) {
        replaceState({nextPathname: nextState.location.pathname }, '/');
    } 
};

module.exports = signedUp;
