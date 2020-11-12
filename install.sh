#!/bin/bash

# Dependencies
echo -n "Installing client dependencies..."
npm install
echo " done"

# Build react app
echo -n "Building react app..."
npm run build
echo " done"

echo -n "Please rename .env.default to .env and fill out the fields inside before starting."
