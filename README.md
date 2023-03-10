Sprint 9

During this Sprint we added functionailty to be able to select a course on a graph to see if you were to drop that class what classes you could no longer take.
As well as, implementing Queen's into the options for Graphing, there was also css modified for styling and to make the web app responsive 

Our website can be found at:

https://131.104.49.103/  # This link is no longer active as it was hosted on school servers

At the top is a navigation bar, one of the choices is University Search. Here you can search all of the University of Guelph Courses by department, course code, semester, and credit.
The other choice is a University Graph Search. Here you can search by department or degree and graph linking all the courses will appear

The ReactUI component for the Search can be found in: ./src/UniSearch.js and ./src/GraphSearch.js

In order to build this project you must first follow our instructions from the previous three sprints that can be found below:

NGINX must be set up before attempting to install Flask and uWSGI. See instructions Below

This sprint contains information for configuring and setting up a NGINX server with REACT UI, JQuery, and CSS (bootstrap) integration.

To begin you must edit the "default" file contained in this directory. Within this file there are two instances of the variable server_name. They will need to be changed too include the IP of your machine.
For example:

```
server_name 131.104.49.103;
```

In order to get the IP address of your system you can execute the install script. To execute do the following command:

```
sudo bash ./get_ip.sh
```

**_OPTIONAL_** If you wish to point the server to the current repositories build folder you must also edit the "default" file root path for the NGINX server. There is a property "root" on line 18 of the "default" file. That must be the path name of the root folder in this repository. For example it could be:

```
root /home/sysadmin/Sprint5/sprint_five_react/build/;
```

Alternatively you can leave the root as:

```
root /var/www/html;
```

The install script "server_install.sh" will copy the build folder to that location.

Now that you have the IP and have input it into both instances of "server_name" in the "default" file, run the command:

```
sudo bash server_install.sh
```

This command will install NGINX with Self Signed HTTPS. It will also copy the contents of the "build" folder to the root of the server.

**_During the server install you will be asked to enter information for the certificate request. You can leave all feilds blank by pressing "enter" or enter appropriate properties. The Common Name would be the IP of the server_**

**_before running sudo bash flask_install.sh you must do the following_**

open flask_install.sh

- any place where you see /home/sysadmin/... replace sysadmin with your hostname

open the file in myproject_sites-available called myproject

- change each path where sysadmin is found to your hostname
- change the server_name: to the IP of your system

in the folder myproject there is a file: myproject.ini open it

- change the path from sysadmin to the hostname of your computer

open the file myproject.service

- change each path that contains sysadmin to your host name
- change the User to your hostname

Having completed these configuration steps you can do the following:

```
sudo bash flask_install.sh
```

Node needed libraryies:
npm install react-scripts
npm i dagre-d3-react --force
npm i playwright
npm install react-flow-renderer

Add for python tests:

pip install schedule
python3 scheduleTests.py

start with: nohup python3 -u ./scheduleTests.py &
