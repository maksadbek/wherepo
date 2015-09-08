package utils

import (
	"io/ioutil"
	"os"
	"strconv"
	"syscall"
	"time"

	"github.com/Maksadbek/wherepo/conf"
	"github.com/Maksadbek/wherepo/models"
	log "github.com/Maksadbek/wherepo/logger"
	"github.com/Maksadbek/wherepo/cache"
)

func SendTERM(pid int) error {
	process, err := os.FindProcess(pid)
	if err != nil {
		return err
	}
	err = process.Signal(syscall.SIGTERM)
	if err != nil {
		return err
	}
	return nil
}

func SendHUP(pid int) error {
	process, err := os.FindProcess(pid)
	if err != nil {
		return err
	}
	err = process.Signal(syscall.SIGHUP)
	if err != nil {
		return err
	}
	return nil
}

func ReadPid(fileName string) (int, error) {
	var pid int
	p, err := ioutil.ReadFile(fileName)
	if err != nil {
		return pid, err
	}

	pid, err = strconv.Atoi(string(p))
	if err != nil {
		return pid, err
	}
	return pid, nil
}

func CheckPidFile(fileName string) bool {
	_, err := os.Stat(fileName)
	if err != nil {
		return false
	}
	return true
}

func WritePid() error {
	f, err := os.Create("pid")
	if err != nil {
		log.Log.Error(err)
	}
	pid := os.Getpid()
	log.Log.Info("my pid is", pid)
	pidStr := strconv.Itoa(pid)
	_, err = f.Write([]byte(pidStr))
	if err != nil {
		log.Log.Error(err)
	}
	f.Close()
	return nil
}
func CacheData(app conf.App, done <-chan struct{}) {
	err := models.CacheTrackers()
	if err != nil {
		log.Log.Error(err)
	}
	CacheFleetTrackers()
	for _ = range time.Tick(time.Duration(app.DS.Mysql.Interval) * time.Minute) {
		err := models.CacheTrackers()
		if err != nil {
			log.Log.Error(err)
		}
		CacheFleetTrackers()
	}
	<-done
}

func CacheFleetTrackers() {
	t, err := models.CacheFleetTrackers()
	if err != nil {

		log.Log.Error(err)
	}
	err = cache.AddFleetTrackers(t)
	if err != nil {
		log.Log.Error(err)
	}
}

func CacheGroups(app conf.App, done <-chan struct{}) {
	err := models.LoadGroups()
	if err != nil {
		log.Log.Error(err)
	}
	for _ = range time.Tick(time.Duration(app.Cache.GroupInterval) * time.Minute) {
		err := models.LoadGroups()
		if err != nil {
			log.Log.Error(err)
		}
	}
	<-done
}
