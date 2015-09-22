var React = require('react');
var LoginStore = require('../stores/LoginStore');

function requireAuth(nextState, replaceState) {
    if (!LoginStore.isLoggedIn()) {
        replaceState({nextPathname: nextState.location.pathname }, '/auth');
    } 
};

module.exports = requireAuth;
