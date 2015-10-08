var React = require('react');
var Mui  = require('material-ui');

var StatusStore = require('../stores/StatusStore');

var StatusActions = require('../actions/StatusActions');

var SidebarItem = require('./SidebarItem.react');

var ListItem = Mui.ListItem,
    Checkbox = Mui.Checkbox,
    FontIcon = Mui.FontIcon;

var Sidebar = React.createClass({
    propTypes:{
        items : React.PropTypes.array.isRequired
    },
    onCheck: function(event, checked){
        var data = this.props.stats.data
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
    onCheckItem: function(event, checked){
        console.log(event.target);
        if(checked){
            StatusActions.addMarker([event.target.id]);
        } else {
            StatusActions.delMarker([event.target.id])
        }
    },
    render: function(){
        var statuses = [];
        var groups = this.props.items;
        var menuItems, items;
        groups.forEach(function(group){

        });
        return ( 
                <section style={{boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)"}} 
                        className="activity activity--shown">
                    <div className="activity__body group_profile">
                        <DropDownMenu autoWidth={true} menuItems={menuItems} />
                        <List style={{borderRadius: 0}} >
                            {   group.map(function(vehicle, id){
                                    return (<ListItem key={vehicle.id} primaryText={vehicle.number} />)
                                })
                            }
                        </List>
                    </div>
                </section>
                
        );
    },
});

module.exports = Sidebar;
