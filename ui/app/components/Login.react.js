var React = require('react');
var Mui  = require('material-ui');

var StatusStore = require('../stores/StatusStore');
var UserStore = require('../stores/UserStore');

var CarActions = require('../actions/StatusActions');
var UserActions = require('../actions/UserActions');

var ThemeManager = new Mui.Styles.ThemeManager();

var TextField = Mui.TextField,
    RaisedButton = Mui.RaisedButton;

var Login = React.createClass({
    childContextTypes: {
          muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
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
                            <TextField hintText="email" />
                        </form>
                        <form>
                            <TextField type="password" />
                            <footer className="text-center">
                                <RaisedButton label="Sign up" secondary={true} type="submit"/>
                            </footer>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Login;
