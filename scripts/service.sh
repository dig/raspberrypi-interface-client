#!/bin/bash

export DISPLAY=:0

start_kiosk() {
  chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --kiosk "http://localhost:3000"
}

start_kiosk_test() {
  chromium-browser "http://localhost:3000"
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
  sleep 5
}

unclutter -idle 0 > /dev/null &
serve_interface

while true; do 
  kiosk_check
  sleep 10
done