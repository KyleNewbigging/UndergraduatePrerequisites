import schedule
import time
import os
import smtplib, ssl, email.utils


# pip install paramiko
# pip install schedule

def send_mail(message):
    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = "team3.w22+p1@gmail.com"
    password = "TraceDabbling"
    receiver_email = "team3.w22+p2@gmail.com"
    # Create a secure SSL context
    context = ssl.create_default_context()

    # Try to log in to server and send email
    try:
        server = smtplib.SMTP(smtp_server,port)
        server.ehlo() # Can be omitted
        server.starttls(context=context) # Secure the connection
        server.ehlo() # Can be omitted
        server.login(sender_email, password)
        # TODO: Send email here
        server.sendmail(sender_email, receiver_email, message)

        server.quit()
    except Exception as e:
        # Print any error messages to stdout
        print(e)

def runTests():
    print("Test Starting")
    os.system('npx playwright test')
    checkTests()
    file = open("nohup.out","w")
    file.close()

def checkTests():
    file = open("nohup.out","r")
    passed = 0
    mes = ""
    contents = file.readlines()
    for line in contents:
      #  print("THIS IS PRINTING FROM PYTHON ---- " + line)
        if "test1 - Course Search" in line and passed != 2:
            if '31m' in line:
                mes = mes + "Test 1 - Course Search has FAILED\n\n"
            elif '32m' in line:
                mes = mes + "Test 1 - Course Search has PASSED\n\n"
                passed = passed + 1
        elif "test2 - Graph Search" in line and passed != 2:
            if '31' in line:
                mes = mes + "Test 2 - Graph Search has FAILED\n\n"
            elif '32' in line:
                mes = mes + "Test 2 - Graph Search has PASSED\n\n"
                passed = passed + 1
    if passed == 0:
        mes = "0 of 2 tests have passed\nServer is most likely down\n\n" + mes
    elif passed == 1:
        mes = "1 of 2 tests have passed\nCheck for memory issues on the server\nCheck for software changes\n\n" + mes
    elif passed == 2:
        mes = "2 of 2 tests have passed\nServer is working optimally\n" + mes
    
    file.close()
    send_mail(mes)

schedule.every(30).minutes.do(runTests)
while(1):
    schedule.run_pending()
    time.sleep(1)
