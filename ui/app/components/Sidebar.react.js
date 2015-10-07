var React = require('react');
var Mui  = require('material-ui');
var injectTapEventPlugin = require("react-tap-event-plugin");

var StatusStore = require('../stores/StatusStore');

var StatusActions = require('../actions/StatusActions');

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
    onCheck: function(event, checked){
        var data = this.props.stats.data
        console.log(checked)
        if(checked){
            StatusActions.addMarker(
                data.map(function(vehicle){
                    return vehicle.id
                })
            );
        } else {
            StatusActions.delMarker(
                data.map(function(vehicle){
                    return vehicle.id
                })
            );
        }
    },
    render: function(){
        var statuses = [];
        var stat = this.props.stats.data;
        var group = this.props.stats.groupName;
        return ( <ListItem open={true} primaryText={group + " (" + stat.length + ")" } >
                    <Checkbox ref="groupSelect" onCheck={this.onCheck} style={{float: "left", width: "auto"}} name="checkbox"></Checkbox>
                    {
                        stat.map(function(vehicle){
                            return( <ListItem  key={vehicle.id} primaryText={vehicle.number} >
                                        <Checkbox onCheck={this.onCheck} style={{float: "left", width: "auto"}} name="checkbox"></Checkbox>
                                    </ListItem>
                            );
                        })
                    }
                </ListItem>
        );
    },
});

module.exports = Sidebar;
