#!/bin/bash

# Check for root / sudo
if [[ $EUID -ne 0 ]]; then
  echo "Please run this script either as root or with sudo." 
  exit 1
fi

HOME_PATH="/home/pi"

# Update raspberry
echo -n "Updating raspberry..."
apt-get update && apt-get -y upgrade &> /dev/null
echo " done"

# Dependencies
echo -n "Installing dependencies..."
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - &> /dev/null
apt-get -y install nodejs git &> /dev/null
apt-get -y install --no-install-recommends chromium-browser &> /dev/null
echo " done"

# Configure chromium
echo -n "Configuring chromium..."
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' "$HOME_PATH/.config/chromium/Local State"
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' "$HOME_PATH/.config/chromium/Default/Preferences"
echo " done"

# Download interface files
echo -n "Downloading interface files..."
rm -rf "$HOME_PATH/interface-client-temp"
git clone https://github.com/dig/raspberrypi-interface-client.git "$HOME_PATH/interface-client-temp" &> /dev/null

mkdir -p "$HOME_PATH/interface-client"
cp -r "$HOME_PATH/interface-client-temp"/* "$HOME_PATH/interface-client"
rm -rf "$HOME_PATH/interface-client-temp"

cd "$HOME_PATH/interface-client"
echo " done"

# Wait for .env
chown -R pi:pi "$HOME_PATH/interface-client"
echo -n "Please copy .env.default to .env and configure. Waiting..."
while [ ! -f "$HOME_PATH/interface-client/.env" ]; do sleep 1; done
echo " done"

# Node dependencies
echo -n "Installing node dependencies..."
npm run setup &> /dev/null
echo " done"

# Build react app
echo -n "Building react app..."
npm run build &> /dev/null
echo " done"

# Disable bluetooth
echo -n "Disabling bluetooth..."
systemctl stop bluetooth
systemctl disable bluetooth
echo " done"

# Fix permissions
echo -n "Fixing permissions..."
chown -R pi:pi "$HOME_PATH/interface-client"
chmod +x "$HOME_PATH/interface-client/scripts/service.sh"
chmod +x "$HOME_PATH/interface-client/scripts/install.sh"

if cat /etc/sudoers | grep -q 'pi ALL=(ALL) NOPASSWD:ALL'; then
  echo "pi already has sudo, skipping..."
else
  echo 'pi ALL=(ALL) NOPASSWD:ALL' | sudo EDITOR='tee -a' visudo
fi

echo " done"

# Install service
if systemctl --all --type service | grep -q "interface-client.service"; then
  echo "Service exists, skipping..."
else
  echo -n "Installing service..."
  ln -s "$HOME_PATH/interface-client/service/interface-client.service" /lib/systemd/system/interface-client.service
  systemctl daemon-reload
  systemctl enable interface-client.service
  systemctl stop interface-client.service
  echo " done"
fi

# Disable mouse cursor
echo -n "Disabling mouse cursor..."
sed -i '/#xserver-command=X/c\xserver-command=X -nocursor -s 0 dpms' /etc/lightdm/lightdm.conf
sed -i '/xserver-command=X -nocursor/c\xserver-command=X -nocursor -s 0 dpms' /etc/lightdm/lightdm.conf
echo " done"

echo -n "Complete! rebooting in 10 seconds..."

sleep 10
sudo reboot