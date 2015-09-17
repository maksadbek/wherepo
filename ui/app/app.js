var React = require('react')
var Router = require('react-router');

var Main = require('./components/Main.react');
var Login = require('./components/Login.react');

var injectTapEventPlugin = require('react-tap-event-plugin');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
    render: function(){
        return <RouteHandler/>;
    }
});

var routes = (
    <Route handler={App} name="app" path="/">
        <Route handler={Main} name="main" path="/mon" />
        <Route handler={Login} name="login" path="/auth" />
        <DefaultRoute handler={Main} />
    </Route>
)

var router = Router.create(routes, Router.HashLocation);

router.run(function(Root){
    injectTapEventPlugin();
    React.render(<Root />, document.getElementById('app'));
});
