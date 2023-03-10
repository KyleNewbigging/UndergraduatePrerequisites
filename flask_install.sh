#!/bin/sh

sudo apt update
sudo apt install python3.7.3
sudo apt install python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools
sudo apt install python3-venv
mkdir /home/sysadmin/myproject
sudo cp -r myproject/. /home/sysadmin/myproject 
python3.7 -m venv /home/sysadmin/myproject/myprojectenv
source /home/sysadmin/myproject/myprojectenv/bin/activate
pip install wheel
pip install uwsgi flask
pip install -U flask-cors
deactivate
sudo cp myproject.service /etc/systemd/system
echo finished sudo cp myproject_sites-available/myproject /etc/nginx/sites-available
sudo systemctl daemon-reload
sudo systemctl start myproject
echo finished sudo systemctl start myproject
sudo systemctl enable myproject
echo finished sudo systemctl enable myproject
sudo systemctl status myproject
sudo cp myproject_sites-available/myproject /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
sudo chmod -R 777 /home/sysadmin/myproject

