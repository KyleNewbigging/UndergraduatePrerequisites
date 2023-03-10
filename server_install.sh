#!/bin/sh

apt update
apt install nginx
service nginx start
echo NGINX has been installed and started
echo installing net-tools to get host ip for server
apt install net-tools
echo this is the IP of the webiste:
ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'
mkdir /etc/nginx/ssl
chmod 700 /etc/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/example.key -out /etc/nginx/ssl/example.crt
cp /etc/nginx/sites-available/default default.old.txt
echo old configuration file saved to this directory in "default.old.txt"
cp default /etc/nginx/sites-available/
nginx -t
nginx -s reload
sudo cp -r build/. /var/www/html
