var React = require('react')
var ReactDOM = require('react-dom')
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var Router = require('react-router').Router;

var Main = require('./components/Main.react');
var Login = require('./components/Login.react');

var requireAuth = require('./utils/requireAuth');
var signedUp = require('./utils/signedUp');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var App = React.createClass({
    render: function(){
        return this.props.children;
    }
});

ReactDOM.render((
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Main} onEnter={requireAuth}/>
            <Route component={Main} path="/mon" onEnter={requireAuth} />
            <Route component={Login} path="/auth" onEnter={signedUp} />
        </Route>   
    </Router>
), document.getElementById('web-app'));
