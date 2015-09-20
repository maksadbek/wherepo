var React = require('react');
var Mui  = require('material-ui');
var injectTapEventPlugin = require("react-tap-event-plugin");

var StatusStore = require('../stores/StatusStore');

var CarActions = require('../actions/StatusActions');

var SidebarItem = require('./SidebarItem.react');

var ThemeManager = new Mui.Styles.ThemeManager();

var ListItem = Mui.ListItem,
    Checkbox = Mui.Checkbox,
    FontIcon = Mui.FontIcon;

injectTapEventPlugin();

var Sidebar = React.createClass({
    childContextTypes: {
          muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    propTypes:{
        stats: React.PropTypes.object.isRequired
    },
    render: function(){
        var statuses = [];
        var stat = this.props.stats.data;
        var group = this.props.stats.groupName;
        var checked = this.state.isChildChecked;
        return ( <ListItem open={true} primaryText={group} >
                    <Checkbox style={{float: "left", width: "auto"}} name="checkbox"></Checkbox>
                    {
                        stat.map(function(vehicle){
                            return(<SidebarItem vehicle={vehicle} />);
                        })
                    } 
                </ListItem>
        );
    },
});

module.exports = Sidebar;
