# raspberrypi-interface-client

[![](https://img.shields.io/github/license/dig/raspberrypi-interface-client.svg)](LICENSE)

Raspberry PI interface for PC monitoring and shortcuts.

## Requirements

 - Raspberry Pi 4, 3
 - Power supply (USB-C for Pi 4 and Micro USB for Pi 3)
 - Pi connected to the internet (WiFi or Ethernet)
 - Pi LCD Monitor (5inch, 7inch, 10inch)
 - 1GB+ micro sd card

## Configuration

These files must be configured properly before starting.
```
Rename .env.default to .env and fill out the fields.
```

## Installation

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
sudo ./install.sh
```
