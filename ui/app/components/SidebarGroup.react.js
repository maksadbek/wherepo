var React = require('react');
var Mui  = require('material-ui');

var StatusStore = require('../stores/StatusStore');

var StatusActions = require('../actions/StatusActions');

var SidebarItem = require('./SidebarItem.react');

var ThemeManager = require('material-ui/lib/styles/theme-manager');
var rawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme.js')

var ListItem = Mui.ListItem,
    Checkbox = Mui.Checkbox,
    List  = Mui.List,
    ListDivider = Mui.ListDivider,
    DropDownMenu = Mui.DropDownMenu,
    FontIcon = Mui.FontIcon;

var Sidebar = React.createClass({
  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(rawTheme),
    };
  },
    propTypes:{
        group : React.PropTypes.object.isRequired
    },
    getInitialState: function(){
        return {childChecked: false}
    },
    onCheck: function(event, checked){
        if(checked){
            StatusActions.addMarker(
                data.data.map(function(vehicle){
                    return vehicle.id
                })
            );
        } else {
            StatusActions.delMarker(
                data.data.map(function(vehicle){
                    return vehicle.id
                })
            );
        }
    },
    render: function(){
        var items,
            checked = this.state.childChecked,
	    group = this.props.group;
        // range over group items and build SidebarItems
	var items = group.data.map(function(vehicle){
	    return (<SidebarItem key={vehicle.id} checked={checked} vehicle={vehicle} />);
	})
	return (<ListItem primaryText={group.groupName} key={group.groupName} nestedItems={items} />);
    },
});

module.exports = Sidebar;
