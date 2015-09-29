var React = require('react');
var Mui  = require('material-ui');

var StatusStore = require('../stores/StatusStore');
var LoginStore = require('../stores/LoginStore');

var CarActions = require('../actions/StatusActions');
var LoginActions = require('../actions/LoginActions');

var ThemeManager = new Mui.Styles.ThemeManager();

var TextField = Mui.TextField,
    RaisedButton = Mui.RaisedButton;

var Login = React.createClass({
    getInitialState: function(){
        return {
            errors: LoginStore.getErrors()
        }
    },
    childContextTypes: {
          muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    componentWillUnmount: function(){
        LoginStore.removeChangeListener(this.onChange);
    },
    componentDidMount: function(){
        LoginStore.addChangeListener(this.onChange);
    },
    handleSubmit: function(event){
        event.preventDefault();
        var email = this.refs.email.getValue(), 
            secret = this.refs.secret.getValue();
        LoginActions.sendSignup({ email: email, secret: secret });
    },
    onChange: function(){
        if(LoginStore.isLoggedIn()){
            this.props.history.replaceState(null, "/mon");
        }
    },
    render: function(){
        return (   
            <div className="row center-xs middle-xs">
                <div className="col-xs row center-xs middle-xs">
                </div>
                <div className="col-xs-6 col-md-4 row center-xs middle-xs">
                    <div>
                        <h1>Sign in</h1>
                        <form>
                            <TextField ref="email" hintText="email" />
                        </form>
                        <form>
                            <TextField ref="secret" type="password" />
                            <footer className="text-center">
                                <RaisedButton label="Sign up" onClick={this.handleSubmit} secondary={true} type="submit"/>
                            </footer>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Login;
