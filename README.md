# raspberrypi-interface-client
Raspberry PI interface for PC monitoring and shortcuts.

### Requirements
* Raspberry Pi 4, 3
* LCD Monitor (5inch, 7inch, 10inch)
* Pi connected to the internet (WiFi or Ethernet).

### Configuration
These files must be configured properly before starting.
```
Rename .env.default to .env and fill out the fields.
```

### Installation
Before trying to install the client, please make sure you have completed the configuration section above.
<br/><br/>
Download the install shell script
```
wget https://raw.githubusercontent.com/dig/raspberrypi-interface-client/master/scripts/install.sh
```

Apply correct permissions
```
chmod +x install.sh
```

And finally install
```
./install.sh
```
