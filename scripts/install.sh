#!/bin/bash

# Update raspberry
echo -n "Updating raspberry..."
sudo apt-get update && sudo apt-get -y upgrade
echo " done"

# Configure display
echo -n "Configuring display..."
export DISPLAY=:0
xset -dpms
xset s noblank
xset s off
echo " done"

# Dependencies
echo -n "Installing dependencies..."
sudo apt-get -y install nodejs npm git
sudo apt-get -y install --no-install-recommends chromium-browser
echo " done"

# Configure chromium
echo -n "Configuring chromium..."
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
echo " done"

# Download interface files
echo -n "Downloading interface files..."
rm -rf ~/interface-client-temp
git clone https://github.com/dig/raspberrypi-interface-client.git ~/interface-client-temp

mkdir -p ~/interface-client/
cp -r ~/interface-client-temp/* ~/interface-client/
rm -rf ~/interface-client-temp

cd ~/interface-client
echo " done"

# Node dependencies
echo -n "Installing node dependencies..."
sudo npm run setup
echo " done"

# Build react app
echo -n "Building react app..."
sudo npm run build
echo " done"

# Fix permissions
echo -n "Fixing service permissions..."
sudo chmod +x ~/interface-client/scripts/service.sh
echo " done"

# Install service
if systemctl --all --type service | grep -q "interface-client.service"; then
  echo "Service exists, skipping..."
else
  echo -n "Installing service..."
  sudo ln -s ~/interface-client/service/interface-client.service /lib/systemd/system/interface-client.service
  systemctl daemon-reload
  systemctl enable interface-client.service
  systemctl stop interface-client.service
  echo " done"
fi

# Disable mouse cursor
echo -n "Disabling mouse cursor..."
sudo sed -i '/#xserver-command=X/c\xserver-command=X -nocursor -s 0 dpms' /etc/lightdm/lightdm.conf
sudo sed -i '/xserver-command=X -nocursor/c\xserver-command=X -nocursor -s 0 dpms' /etc/lightdm/lightdm.conf
echo " done"

echo -n " "
echo -n "Complete! rebooting in 10 seconds..."
echo -n " "

sleep 10
sudo reboot


