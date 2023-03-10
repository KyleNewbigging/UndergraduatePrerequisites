Run the test_installing.sh script file

This will download the neccessities to run the testing.

Navigate to package.json 
    make sure that under the "scripts" tab there exists "test": "playwright test",    if test is anything else, change it to playwright test

    also make sure dev dependicies includes "@playwright/test": "^1.20.1"
        this should have been done by the install script

to test if everything is working, run 'npx playwright test' which should manually complete the test as well as give you any errors -- such as missing dependency files.. in that case just follow the on screen prompts to fix them

to start automated testing run the command:
                nohup python3 -u ./scheduleTests.py &

to kill the automated process run: 
                ps ax | grep scheduleTests.py
        and then kill the process called 'python3 -u ./scheduleTests.py' using sudo kill -9 <pid>

you can also use the above 'ps ax' command to even see if the automated testing is running, as sometimes emails are delayed due to the slowness of the server


When you kill the process... erase the contents in /home/sysadmin/nohup.out before restarting the next test
	either way it gets reset every time a test is done, just in case the process died mid test.
