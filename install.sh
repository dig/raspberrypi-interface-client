#!/bin/bash

# Configure display
echo -n "Configuring display..."

export DISPLAY=:0
xset -dpms
xset s noblank
xset s off

echo " done"

# Dependencies
echo -n "Installing dependencies..."
sudo apt-get install --no-install-recommends chromium-browser
echo " done"

# Configure chromium
echo -n "Configuring chromium..."

sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences

echo " done"

# React dependencies
echo -n "Installing react dependencies..."
sudo npm install
echo " done"

# Build react app
echo -n "Building react app..."
sudo npm run build
echo " done"

echo -n "Please rename .env.default to .env and fill out the fields inside before starting."
