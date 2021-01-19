import smtplib 
from flask import Flask,request

app = Flask(__name__)

sender="cityprobe.report@gmail.com"
password="cityprobe123#"

def get_emails_to_send_mail_to():
    with open('email_list.txt','r') as f:
        emails=f.read().split("\n")
    return emails


@app.route("/")
def home():
    return "Hello from Mail Server"


@app.route('/notify') #notify end-point
def send_email():
    emails=get_emails_to_send_mail_to()#emails are provided in email_list.txt file.
    msg=request.args.get('message') #parameter message

    #Connect to email server
    smtp = smtplib.SMTP('smtp.gmail.com', 587) 
    smtp.starttls()
    smtp.login(sender,password) 

    for email_id in emails:
        message=\
        f"From: {sender}\n"+\
        f"To: {email_id}\n"+\
        "Subject: URGENT: Environment Backend Warnings\n\n"+\
        f"{msg}"

        smtp.sendmail(sender, email_id, message) 
    #After sending all mails quit the connection
    app.logger.warning(f'mail has been send with msg: {msg} to {emails}')
    smtp.quit()
    return "Done"

app.run()