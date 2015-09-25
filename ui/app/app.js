var React = require('react')
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var Router = require('react-router').Router;

var Main = require('./components/Main.react');
var Login = require('./components/Login.react');

var requireAuth = require('./utils/requireAuth');
var signedUp = require('./utils/signedUp');

var injectTapEventPlugin = require('react-tap-event-plugin');


var App = React.createClass({
    render: function(){
        return this.props.children;
    }
});

React.render((
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Main} onEnter={requireAuth}/>
            <Route component={Main} path="/mon" onEnter={requireAuth} />
            <Route component={Login} path="/auth" onEnter={signedUp} />
        </Route>   
    </Router>
), document.getElementById('actor-web-app'));
