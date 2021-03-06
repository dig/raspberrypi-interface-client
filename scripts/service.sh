#!/bin/bash

export DISPLAY=:0
xset -dpms
xset s noblank
xset s off

start_kiosk() {
  chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --touch-events --kiosk "http://localhost:3000"
}

start_kiosk_test() {
  chromium-browser --touch-events "http://localhost:3000"
}

stop_kiosk() {
  sudo pkill -o chromium
}

kiosk_check() {
  if pgrep -x "chromium" > /dev/null
  then
    echo "Running"
  else
    stop_kiosk
    # start_kiosk_test
    start_kiosk
  fi
}

serve_interface() {
  cd ~/interface-client
  npm run serve > /dev/null &
}

serve_interface
sleep 10

while true; do 
  kiosk_check
  sleep 10
done