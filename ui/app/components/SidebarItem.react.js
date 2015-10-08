var React = require('react');
var Mui  = require('material-ui');

var ListItem = Mui.ListItem,
    FontIcon = Mui.FontIcon,
    Checkbox = Mui.Checkbox; 

var SidebarItem = React.createClass({
    getInitialState: function(){
        return { isChecked: this.props.isChecked }
    },
    onCheck: function(event, checked){
        console.log(checked);
    },
    render: function(){
        var vehicle = this.props.vehicle;
        return ( 
            <ListItem primaryText={vehicle.number} >
                <Checkbox onCheck={this.onCheck} style={{float: "left", width: "auto"}} name="checkbox"></Checkbox>
            </ListItem>
        );
    }
});

module.exports = SidebarItem;
