var React = require('react');
var Mui  = require('material-ui');
var GoogleMap = require('react-google-maps').GoogleMap;
var Marker = require('react-google-maps').Marker;
var ReactGridLayout = require('react-grid-layout');

var StatusStore = require('../stores/StatusStore');
var LoginStore = require('../stores/LoginStore');


var Sidebar = require('./Sidebar.react');

var ThemeManager = new Mui.Styles.ThemeManager();

var AppBar = Mui.AppBar,
    MenuItem= Mui.MenuItem, 
    IconButton= Mui.IconButton, 
    List  = Mui.List,
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
    //   LoginActions.Auth({
    //       login: "taxi",
    //       uid: "deadbeef",
    //       hash: "b5ea8985533defbf1d08d5ed2ac8fe9b",
    //       fleet: "436"
    //   });
    StatusStore.sendAjax();
    setInterval(function(){
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
        this.setState({stats: StatusStore.getAll()});
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
                <AppBar
                    title="GPSimple"
                    iconElementLeft={<IconButton onClick={this.toggleLeftNav} ><NavigationMenu /></IconButton>}
                />
                <ReactGridLayout cols={12}
                  autoSize={true}
                  margin={[0, 0]}
                  minH={1}
                  maxH={900}
                  minW={1}
                  isDraggable={false}
                  isResizable={false}
                  useCSSTransforms={true}
                  listenToWindowResize={true}
                  verticalCompact={true}
                >
                    <div _grid={{maxH:screen.height, x:0, y:0, w:9, h:5}} key={1} style={{border: "solid 1px #d9d9d9"}} id={"map-canvas"}>
                        <GoogleMap containerProps={{style:{height:"100%"}}} ref="map" defaultZoom={12} 
                                defaultCenter={{lat: 41.3079867, lng: 69.2578129}}>
                                {markers.map(function(marker, index){
                                        return(<Marker {...marker} />);
                                    })
                                }
                        </GoogleMap>
                    </div>
                    <div _grid={{maxH:screen.height, x:10, y:0, w:3, h:5}} key={2} 
                        style={{borderRadius: 0, border: "solid 1px #d9d9d9", overflow:"scroll"}}>
                        <List style={{borderRadius: 0}} >
                            {content}
                        </List>
                    </div>
                </ReactGridLayout>
            </div>
            )
    }
});

module.exports = Main;
