package datastore

import (
	"database/sql"
	"fmt"
	"strings"

	"bitbucket.org/maksadbek/go-mon-service/conf"
	log "bitbucket.org/maksadbek/go-mon-service/logger"
	"bitbucket.org/maksadbek/go-mon-service/rcache"
	"github.com/Sirupsen/logrus"
	_ "github.com/go-sql-driver/mysql"
	"github.com/kovetskiy/go-php-serialize"
)

var db *sql.DB

func Initialize(c conf.Datastore) error {
	log.Log.WithFields(logrus.Fields{
		"package": "datastore",
		"config":  fmt.Sprintf("%+v", c),
	}).Info("Initialize")

	var err error
	db, err = sql.Open("mysql", c.Mysql.DSN)
	if err != nil {
		log.Log.WithFields(logrus.Fields{
			"package": "datastore",
			"Error":   err.Error(),
		}).Warn("Initialize")
		return err
	}
	return nil
}

func GetTrackers(fleet string) (map[int]rcache.Vehicle, error) {
	queryFilter := " where fleet = " + fleet
	if fleet == "" {
		queryFilter = ""
	}
	log.Log.WithFields(logrus.Fields{
		"package": "datastore",
		"fleet":   fleet,
	}).Info("GetTrackers")
	var pos map[int]rcache.Vehicle = make(map[int]rcache.Vehicle)
	query := queries["getTrackers"] + queryFilter
	rows, err := db.Query(query)
	defer rows.Close()
	if err != nil {
		log.Log.WithFields(logrus.Fields{
			"package": "datastore",
			"Error":   err.Error(),
		}).Warn("GetTrackers")
		return pos, err
	}
	for rows.Next() {
		var v rcache.Vehicle
		rows.Scan(
			&v.Id,
			&v.Fleet,
			&v.Imei,
			&v.Number,
			&v.Tracker_type,
			&v.Tracker_type_id,
			&v.Device_type_id,
			&v.Name,
			&v.Owner,
			&v.Active,
			&v.Additional,
			&v.Customization,
			&v.Group_id,
			&v.Detector_fuel_id,
			&v.Detector_motion_id,
			&v.Detector_dinamik_id,
			&v.Pid,
			&v.Installed_sensor,
			&v.Detector_agro_id,
			&v.Car_health,
			&v.Color,
			&v.What_class,
		)
		pos[v.Id] = v
	}
	log.Log.WithFields(logrus.Fields{
		"package": "datastore",
	}).Warn("GetTrackers")
	return pos, err
}

func UsrTrackers(name string) (usr rcache.Usr, err error) {
	log.Log.WithFields(logrus.Fields{
		"package": "datastore",
		"name":    name,
	}).Info("UsrTrackers")
	rows, err := db.Query(queries["usrTrackers"], name)
	defer rows.Close()
	if err != nil {
		log.Log.WithFields(logrus.Fields{
			"package": "datastore",
			"error":   err.Error(),
		}).Warn("UsrTrackers")
		return usr, err
	}

	for rows.Next() {
		var cars string
		rows.Scan(
			&usr.Login,
			&usr.Fleet,
			&cars,
		)
		if cars == "all" {
			usr.Trackers = append(usr.Trackers, "0")
			log.Log.WithFields(logrus.Fields{
				"package": "datastore",
				"user":    usr,
			}).Info("UsrTrackers")
			return usr, err
		}
		tr, err := phpserialize.Decode(cars)
		if err != nil {
			return usr, err
		}
		for _, x := range tr.(map[interface{}]interface{}) {
			usr.Trackers = append(usr.Trackers, fmt.Sprintf("%v", x))
		}
	}
	log.Log.WithFields(logrus.Fields{
		"package": "datastore",
		"user":    usr,
	}).Info("UsrTrackers")
	return
}

func CacheFleetTrackers() ([]rcache.FleetTracker, error) {
	log.Log.WithFields(logrus.Fields{
		"package": "datastore",
	}).Info("CacheFleetTrackers")
	var fleetTrackers []rcache.FleetTracker
	rows, err := db.Query(queries["fleetTrackers"])
	if err != nil {
		log.Log.WithFields(logrus.Fields{
			"package": "datastore",
			"error":   err.Error(),
		}).Warn("CacheFleetTrackers")
		return fleetTrackers, err
	}

	defer rows.Close()
	for rows.Next() {
		var (
			trackers rcache.FleetTracker
			t        string
		)
		rows.Scan(
			&trackers.Fleet,
			&t,
		)
		trackers.Trackers = strings.Split(t, ",")
		fleetTrackers = append(fleetTrackers, trackers)
	}
	return fleetTrackers, nil
}