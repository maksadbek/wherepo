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
        items : React.PropTypes.array.isRequired
    },
    getInitialState: function(){
        return {childChecked: false}
    },
    onCheck: function(event, checked){
        var data = this.props.items[5];
        if(checked){
            this.setState({childChecked: true});
            StatusActions.addMarker(
                data.data.map(function(vehicle){
                    return vehicle.id
                })
            );
        } else {
            this.setState({childChecked: false});
            StatusActions.delMarker(
                data.data.map(function(vehicle){
                    return vehicle.id
                })
            );
        }
    },
    onGroupSelect: function(e, index){
        StatusActions.selectGroup({
            index: index
        });
    },
    style: {boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)"},
    render: function(){
        var statuses = [],
            groups = this.props.items,
            menuItems = [], 
            items,
            selectedGroupIndex = StatusStore.selectedGroup;

        // fill menu items
        groups.forEach(function(group, index){
            menuItems.push({payload: index, text: group.groupName})
        });
        var data = groups[5];
        var sidebarData;
        var checked = this.state.childChecked;
        if(!!data){
            sidebarData= data.data.map(function(vehicle, id){
                return (<div key={vehicle.id}>
                            <SidebarItem checked={checked} vehicle={vehicle} />
                        </div>)
            })
        }
        return ( 
                <section style={this.style} className="activity activity--shown">
                    <div className="activity__body group_profile">
                        <ListDivider inset={false} /> 
                        <ListItem leftCheckbox={<Checkbox onCheck={this.onCheck}/>}>
                            <DropDownMenu autoWidth={false} style={{width:"100%"}} menuItems={menuItems} />
                        </ListItem>
                        <List style={{borderRadius: 0}} >
                            {sidebarData }
                        </List>
                    </div>
                </section>
                
        );
    },
});

module.exports = Sidebar;
