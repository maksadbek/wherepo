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


function getAllStatuses(){
    return StatusStore.getAll()
}

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
        this.setState({stats: StatusStore.getAll()});
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
                markers.push({
                    position:{
                        lat: vehicle.latitude,
                        lng: vehicle.longitude
                    },
                    key: vehicle.id
                });
            });
        });
        return (   
            <div>
            <LeftNav ref="leftNav" docked={false} menuItems={menuItems} />
            <div className="app">
                <section className="main">
                   <header className="toolbar row">
                      <div className="toolbar__controls col-xs">
                            <div className="toolbar__controls__buttons pull-left">
                                <button onClick={this.toggleLeftNav} className="button button--icon">
                                  <i className="material-icons">menu</i>
                                </button>
                            </div>
                      </div>

                      <div className="toolbar__controls">
                            <div className="toolbar__controls__buttons pull-right">
                        <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
                            <IconMenuItem index={1} primaryText="Settings" />
                            <IconMenuItem onClick={this.logOut} index={2} primaryText="Sign out" />
                        </IconMenu>

                            </div>
                            <div className="toolbar__controls__search pull-right">
                              <i className="material-icons">search</i>
                              <input className="input input--search" type="search"/>
                            </div>
                      </div>
                    </header> 
                    <div className="flexrow">
                        <section className="dialog">
                            <div id={"map-canvas"}>
                                <GoogleMap containerProps={{style:{height:"100vh"}}} ref="map" defaultZoom={12} 
                                        defaultCenter={{lat: 41.3079867, lng: 69.2578129}}>
                                        {markers.map(function(marker, index){
                                                return(<Marker {...marker} />);
                                            })
                                        }
                                </GoogleMap>
                            </div>
                        </section>
                        <section className="activity activity--shown">
                            <div className="activity__body group_profile">
                                <List style={{borderRadius: 0}} >
                                    {content}
                                </List>
                            </div>
                        </section>
                    </div>
                </section>
            </div>
            </div>
            )
    }
});

module.exports = Main;
