var React = require('react');
var Mui  = require('material-ui');
var GoogleMap = require('react-google-maps').GoogleMap;
var Marker = require('react-google-maps').Marker;
var ReactGridLayout = require('react-grid-layout');

var StatusStore = require('../stores/StatusStore');
var LoginStore = require('../stores/LoginStore');

var LoginActions = require('../actions/LoginActions');

var Sidebar = require('./Sidebar.react');

var ThemeManager = new Mui.Styles.ThemeManager();

var AppBar = Mui.AppBar,
    MenuItem= Mui.MenuItem, 
    IconButton= Mui.IconButton, 
    IconMenu = Mui.IconMenu,
    List  = Mui.List,
    IconMenuItem = require('material-ui/lib/menus/menu-item'),
    Paper = Mui.Paper,
    NavigationMenu = Mui.Icons.NavigationMenu,
    LeftNav= Mui.LeftNav;

menuItems = [
    { 
        type: MenuItem.Types.SUBHEADER, 
        text: 'Menu' 
    },
    { 
        payload: 'https://github.com', 
        text: 'Monitoring',
        disabled: true 
    },
    { 
        text: 'Settings', 
        payload: 'https://github.com', 
    },
    { 
        payload: 'https://www.google.com', 
        text: 'Help' 
    },
];

var Main = React.createClass({
    getInitialState: function(){
        this._bounds = new google.maps.LatLngBounds();
        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18 , 1],
            type: 'poly'
        };
        return {
            stats: {
                id: '',
                update: [],
            },
            isChildChecked: false
        }
    },
    childContextTypes: {
          muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    componentDidMount: function(){
        StatusStore.addChangeListener(this._onChange);
        var mapOptions = { zoom: 10 };
    },
    componentWillMount: function(){
    StatusStore.sendAjax();
    this.sendAjaxInterval = setInterval(function(){
        StatusStore.sendAjax();
    }, 5000);
    },
    componentWillUnmount: function(){
        StatusStore.removeChangeListener(this._onChange);
    },
    toggleLeftNav: function(){
        this.refs.leftNav.toggle();
    },
    _onChange: function(){
        if(!LoginStore.isLoggedIn()){
            clearInterval(this.sendAjaxInterval);
            this.props.history.replaceState(null, "/auth");
            return;
        }
        this.setState({stats: StatusStore.carStats});
    },
    logOut: function(){
        LoginActions.logOut();
    },
    render: function(){
        var content = [];
        var markers = [];
        var update = this.state.stats.update;
        var checked = this.state.isChildChecked;
        update.forEach(function(group){
            content.push(<Sidebar key={group.groupName} stats={group}/>)
            group.data.forEach(function(vehicle){
                if(StatusStore.markers.indexOf(vehicle.id) === -1){
                    return;
                }
                markers.push({
                    position:{
                        lat: vehicle.latitude,
                        lng: vehicle.longitude
                    },
                    key: vehicle.id
                });
            });
        });
        console.log(StatusStore.markers);
        return (   
            <div className="app">
                <LeftNav  ref="leftNav" docked={false} menuItems={menuItems} />
                <section className="main">
                    <div className="flexrow">
                        <AppBar style={{height:"64px"}}
                            title="gpsimple"
                            iconElementLeft={<IconButton onClick={this.toggleLeftNav} ><NavigationMenu /></IconButton>}
                            iconElementRight={
                                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
                                    <IconMenuItem index={1} primaryText="Settings" />
                                    <IconMenuItem onClick={this.logOut} index={2} primaryText="Sign out" />
                                </IconMenu>
                            } 
                        />
                    </div>
                    <div className="flexrow">
                        <section className="dialog">
                            <div id={"map-canvas"} style={{height:"100vh", width:"100%"}}>
                                <GoogleMap containerProps={{style:{height:"100%", width:"100%"}}} ref="map" defaultZoom={12} 
                                        defaultCenter={{lat: 41.3079867, lng: 69.2578129}}>
                                        {markers.map(function(marker, index){
                                                return(<Marker {...marker} />);
                                            })
                                        }
                                </GoogleMap>
                            </div>
                        </section>
                        <section style={{boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)"}} 
                                className="activity activity--shown">
                            <div className="activity__body group_profile">
                                <List style={{borderRadius: 0}} >
                                    {content}
                                </List>
                            </div>
                        </section>
                    </div>
                </section>
            </div>
            )
    }
});

module.exports = Main;
