#!/usr/bin/python
# This file is: /usr/share/cacti/site/scripts/flow_temps.py

import os, glob, time, sys, datetime
from influxdb import InfluxDBClient
from configparser import ConfigParser
import Adafruit_DHT


sensor = Adafruit_DHT.DHT22
config_object = ConfigParser()
config_object.read("config.ini")
influxDB_local_config = config_object["INFLUXDB_local"]
INFLUXDB_ADDRESS = influxDB_local_config["influxdb_address"].encode('utf-8')
INFLUXDB_USER = influxDB_local_config["influxdb_user"].encode('utf-8')
INFLUXDB_PASSWORD = influxDB_local_config["influxdb_password"].encode('utf-8')
INFLUXDB_DATABASE = influxDB_local_config["influxdb_database"].encode('utf-8')
INFLUXDB_PORT = int(influxDB_local_config["influxdb_port"])
influxDB_server_config = config_object["INFLUXDB_server"]
INFLUXDB_server_ADDRESS = influxDB_server_config["influxdb_address"].encode('utf-8')
INFLUXDB_server_USER = influxDB_server_config["influxdb_user"].encode('utf-8')
INFLUXDB_server_PASSWORD = influxDB_server_config["influxdb_password"].encode('utf-8')
INFLUXDB_server_DATABASE = influxDB_server_config["influxdb_database"].encode('utf-8')
INFLUXDB_server_PORT = influxDB_server_config["influxdb_port"].encode('utf-8')

influxdb_client = InfluxDBClient(INFLUXDB_ADDRESS, INFLUXDB_PORT, INFLUXDB_USER, INFLUXDB_PASSWORD, None)
influxdb_server_client = InfluxDBClient(INFLUXDB_server_ADDRESS, INFLUXDB_server_PORT, INFLUXDB_server_USER, INFLUXDB_server_PASSWORD, None)
#Set up the location of the DS18B20 sensors in the system
device_folder = glob.glob('/sys/bus/w1/devices/28*')
device_file = [device_folder[0] + '/w1_slave',device_folder[1] + '/w1_slave']
device_name = glob.glob('/sys/bus/w1/devices/28*/name')

def _init_influxdb_database():
    
    databases = influxdb_client.get_list_database()
    if len(list(filter(lambda x: x['name'] == INFLUXDB_DATABASE, databases))) == 0:
        influxdb_client.create_database(INFLUXDB_DATABASE)
    influxdb_client.switch_database(INFLUXDB_DATABASE)
    

def _init_influxdb_database_server():
    
    databases = influxdb_server_client.get_list_database()
    if len(list(filter(lambda x: x['name'] == INFLUXDB_server_DATABASE, databases))) == 0:
        influxdb_server_client.create_database(INFLUXDB_server_DATABASE)
    influxdb_server_client.switch_database(INFLUXDB_server_DATABASE)
    

def _send_data_to_influxdb(temp, humidity):
    json_temp1 = [
            {
                "measurement": "temperature",
                "tags": {
                    "location": "rack1",
                    "position": "front rack"
                }, 
                "fields": {
                    "value": temp[0]
                }
            }
        ]
    json_temp2 = [
            {
                "measurement": "temperature",
                "tags": {
                    "location": "rack1",
                    "position": "behind rack"
                }, 
                "fields": {
                    "value": temp[1],
                }
            }
        ]
    json_humidity = [
            {
                "measurement": "humidity",
                "tags": {
                    "location": "rack1",
                }, 
                "fields": {
                    "value": "{:.2f}".format(humidity),
                }
            }
        ]
    influxdb_client.write_points(json_temp1)
    influxdb_client.write_points(json_temp2)
    influxdb_client.write_points(json_humidity)
    #influxdb_server_client.write_points(json_temp1)
    #influxdb_server_client.write_points(json_temp2)
    #influxdb_server_client.write_points(json_humidity)
    print('Success write data to InfluxDB')

def read_temp_raw(): #A function that grabs the raw temp data from the sensors
    f_1 = open(device_file[0], 'r')
    lines_1 = f_1.readlines()
    f_1.close()
    f_2 = open(device_file[1], 'r')
    lines_2 = f_2.readlines()
    f_2.close()
    return lines_1 + lines_2 

def read_temp(): #A function to check the connection was good and strip out the temperature
    lines = read_temp_raw()
    print(lines[0]+lines[1])
    print(lines[2]+lines[3])
    while lines[0].strip()[-3:] != 'YES' and lines[2].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t='), lines[3].find('t=')
    temp = float(lines[1][equals_pos[0]+2:])/1000, float(lines[3][equals_pos[1]+2:])/1000
    return temp

def read_humidity():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, 8)
    if humidity is not None and temperature is not None:
        print('Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity))
    else:
        print('Failed to get reading. Try again!')
    return humidity    
    
    
    
_init_influxdb_database()
#_init_influxdb_database_server()
while True:
    print(time.ctime())
    humidity=read_humidity() #get humidity
    print('Humidity={0:0.1f}% (test print) '.format( humidity))
    temp = read_temp()#get the temp
    _send_data_to_influxdb(temp, humidity)
    #print('T1:'+str(temp[0])+ ' T2:'+str(temp[1]))
    #print('name_T1 : ' + str(device_name[0]) + ' name_T2 : ' + str(device_name[1]))
    time.sleep(5)

