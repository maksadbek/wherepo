var React = require('react');
var StatusStore = require('../stores/StatusStore');
var CarActions = require('../actions/StatusActions');
var UserActions = require('../actions/UserActions');
var Sidebar = require('./Sidebar.react');
var UserStore = require('../stores/UserStore');
var Status = require('./CarStatus.react');
var Mui  = require('material-ui');
var ThemeManager = new Mui.Styles.ThemeManager();
mui = require('material-ui')

var AppBar = Mui.AppBar,
    MenuItem= Mui.MenuItem, 
    IconButton= Mui.IconButton, 
    List  = Mui.List,
    Paper = Mui.Paper,
    LeftNav= Mui.LeftNav;

menuItems = [
    { 
        type: MenuItem.Types.SUBHEADER, 
        text: 'Resources' 
    },
    { 
        type: MenuItem.Types.LINK, 
        payload: 'https://github.com', 
        text: 'GitHub' 
    },
    { 
        text: 'Disabled', 
        disabled: true 
    },
    { 
        type: MenuItem.Types.LINK, 
        payload: 'https://www.google.com', 
        text: 'Disabled Link', 
        disabled: true 
    },
];


function getAllStatuses(){
    return StatusStore.getAll()
}

var StatusApp = React.createClass({
    childContextTypes: {
          muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    getInitialState: function(){
        this._bounds = new google.maps.LatLngBounds();
        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18 , 1],
            type: 'poly'
        };
        return {
            bounds: {},
            map: {},
            stats: {
                id: '',
                update: [],
            },
            isChildChecked: false
        }
    },

    componentDidMount: function(){
        StatusStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onAuth);
        var mapOptions = { zoom: 10 };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        this.setState({map: map});
    },

    componentWillMount: function(){
       UserActions.Auth({
           login: "taxi",
           uid: "taxi",
           hash: "b5ea8985533defbf1d08d5ed2ac8fe9b",
           fleet: "436",
           groups: "1,2,3" // TODO ochirib tashlash
       });
    },
    componentWillUnmount: function(){
        StatusStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onAuth);
    },
    toggleLeftNav: function(){
        console.log(this.refs.leftNav);
        React.findDOMNode(this.refs.leftNav).toggle()
    },
    render: function(){
        var content = [];
        var update = this.state.stats.update;
        var checked = this.state.isChildChecked;
        var bounds = this.state.bounds;
        var map = this.state.map;
        update.forEach(function(group){
            content.push(<Sidebar bounds={bounds} map={map} key={group.groupName} stats={group}/>)
        });
        return (   
            <div>
                <LeftNav ref="leftNav" docked={false} menuItems={menuItems} />
                <AppBar
                    onLeftIconButtonTouchTap={this.toggleLeftNav}
                    title="Wherepo"
                    iconElementLeft={<IconButton></IconButton>}
                />

                <div style={{width:"30%"}}> 
                    <div style={{border: "solid 1px #d9d9d9", height: "100vh", float: "left", overflow:"scroll"}}>
                        <List>
                            {content}
                        </List>
                    </div>
                </div>
                <div style={{border: "solid 1px #d9d9d9", height: "100vh", float: "left", width:"67%"}} id={"map-canvas"}></div>

            </div>
            )
    },
    _onChange: function(){
        this.setState({stats: getAllStatuses()});
    },
    _onAuth: function(){
        console.log("fuck");
        StatusStore.sendAjax();
        setInterval(function(){
            StatusStore.sendAjax();
        }, 5000);
    },
    _map: {},
    _bounds: {}
});

module.exports = StatusApp;
