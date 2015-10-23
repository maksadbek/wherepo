var React = require('react');
var Mui  = require('material-ui');

var StatusStore = require('../stores/StatusStore');

var StatusActions = require('../actions/StatusActions');

var SidebarGroup = require('./SidebarGroup.react');

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
        items : React.PropTypes.array.isRequired
    },
    style: {boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)"},
    render: function(){
        var groups = this.props.items;
        var sidebarData= groups.map(function(group){
	    return (<SidebarGroup key={group.Name} group={group}/>)
        })
        return ( 
            <section style={this.style} className="activity activity--shown">
                <div className="activity__body group_profile">
                    <List style={{borderRadius: 0}} >
	    	        { sidebarData }
                    </List>
                </div>
            </section>
        );
    },
});

module.exports = Sidebar;
