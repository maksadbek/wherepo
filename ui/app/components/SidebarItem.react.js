var React = require('react');
var Mui  = require('material-ui');

var ThemeManager = new Mui.Styles.ThemeManager();

var ListItem = Mui.ListItem,
    FontIcon = Mui.FontIcon,
    CheckBox = Mui.CheckBox; 

var SidebarItem = React.createClass({
    getInitialState: function(){
        return { isChecked: this.props.isChecked }
    },
    propTypes:{
        vehicle: React.PropTypes.object.isRequired,
    },
    childContextTypes: {
          muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    render: function(){
        var vehicle = this.props.vehicle;
        return (
              <ListItem  primaryText={vehicle.number} />
        );
    }
});

module.exports = SidebarItem;
