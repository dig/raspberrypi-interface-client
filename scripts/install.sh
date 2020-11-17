#!/bin/bash

# Update raspberry
echo -n "Updating raspberry..."
sudo apt-get update && sudo apt-get -y upgrade &> /dev/null
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
sudo apt-get -y install nodejs npm git &> /dev/null
sudo apt-get -y install --no-install-recommends chromium-browser &> /dev/null
echo " done"

# Configure chromium
echo -n "Configuring chromium..."
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
echo " done"

# Download interface files
echo -n "Downloading interface files..."
rm -rf ~/interface-client-temp &> /dev/null
git clone https://github.com/dig/raspberrypi-interface-client.git ~/interface-client-temp &> /dev/null

mkdir -p ~/interface-client/ &> /dev/null
cp -r ~/interface-client-temp/* ~/interface-client/ &> /dev/null
rm -rf ~/interface-client-temp &> /dev/null

cd ~/interface-client &> /dev/null
echo " done"

# Node dependencies
echo -n "Installing node dependencies..."
sudo npm run setup &> /dev/null
echo " done"

# Build react app
echo -n "Building react app..."
sudo npm run build &> /dev/null
echo " done"

# Disable bluetooth
echo -n "Disabling bluetooth..."
sudo systemctl stop bluetooth
sudo systemctl disable bluetooth
echo " done"

# Fix permissions
echo -n "Fixing service permissions..."
chmod +x ~/interface-client/scripts/service.sh
chmod +x ~/interface-client/scripts/install.sh
echo " done"

# Install service
if systemctl --all --type service | grep -q "interface-client.service"; then
  echo "Service exists, skipping..."
else
  echo -n "Installing service..."
  sudo ln -s ~/interface-client/service/interface-client.service /lib/systemd/system/interface-client.service
  sudo systemctl daemon-reload
  sudo systemctl enable interface-client.service
  sudo systemctl stop interface-client.service
  echo " done"
fi

# Disable mouse cursor
echo -n "Disabling mouse cursor..."
sudo sed -i '/#xserver-command=X/c\xserver-command=X -nocursor -s 0 dpms' /etc/lightdm/lightdm.conf
sudo sed -i '/xserver-command=X -nocursor/c\xserver-command=X -nocursor -s 0 dpms' /etc/lightdm/lightdm.conf
echo " done"

echo -n "Complete! rebooting in 10 seconds..."
echo -n " "

sleep 10
sudo reboot