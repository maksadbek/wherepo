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
            <section className="login-new row center-xs middle-xs">
                  <div className="login-new__welcome col-xs row center-xs middle-xs">
                      <article>
                        <h1 className="login-new__heading">Welcome to <strong>GPSimple</strong></h1>
                        <p>
                          GPSimple brings all your business network connections into one place,
                          makes it easily accessible wherever you go.
                        </p>
                        <p>
                          Our aim is to make your work easier, reduce your email amount,
                          make the business world closer by reducing time to find right contacts.
                        </p>
                      </article>
                      <footer>
                        <div className="pull-left">
                          GPSimple LLC © 2015
                        </div>
                        <div className="pull-right">
                          <a href="//gpsimple.io/ios">iPhone</a>
                          <a href="//gpsimple.io/android">Android</a>
                        </div>
                      </footer>
                    </div>

                    <div className="login-new__form col-lg-6 col-xs-6 col-md-4 row center-xs middle-xs">
                        <div>
                            <h1 className="login-new__heading" >Sign in</h1>
                            <form>
                                <TextField className="login__form__input" ref="email" hintText="email" />
                            </form>
                            <form>
                                <TextField className="login__form__input" ref="secret" type="password" />
                                <footer className="text-center">
                                    <RaisedButton label="sign up"
                                            onClick={this.handleSubmit} 
                                            secondary={true} 
                                            type="submit" />
                                </footer>
                            </form>
                        </div>
                    </div>
            </section>
        )
    }
});

module.exports = Login;
