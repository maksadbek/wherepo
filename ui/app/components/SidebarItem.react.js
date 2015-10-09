var React = require('react');
var Mui  = require('material-ui');

var StatusActions = require('../actions/StatusActions');

var ListItem = Mui.ListItem,
    FontIcon = Mui.FontIcon,
    ListDivider = Mui.ListDivider,
    Checkbox = Mui.Checkbox; 

var SidebarItem = React.createClass({
    getInitialState: function(){
        return { checked: this.props.checked }
    },
    propTypes:{
        checked: React.PropTypes.bool.isRequired
    },
    onCheck: function(event, checked){
        var id = [];
        id.push(this.props.vehicle.id);
        this.setState({checked: checked});
        if(checked){
            StatusActions.addMarker(id);
        } else {
            StatusActions.delMarker(id)
        }
    },
    render: function(){
        var vehicle = this.props.vehicle;
        var checked = this.state.checked;
        return (<div>
                    <ListDivider inset={false} /> 
                    <ListItem leftCheckbox={<Checkbox defaultChecked={checked} onCheck={this.onCheck} />} 
                                            key={vehicle.id} 
                                            primaryText={vehicle.number} 
                    />
                </div>);
    }
});

module.exports = SidebarItem;
