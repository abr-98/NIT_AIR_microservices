import smtplib 
from flask import Flask,request

app = Flask(__name__)

sender="cityprobe.report@gmail.com"
password="cityprobe123#"

smtp = smtplib.SMTP('smtp.gmail.com', 587) 
smtp.starttls()
smtp.login(sender,password)    

@app.route("/")
def home():
    return "Hello from Mail Server"


@app.route('/notify') #notify end-point
def send_email():
    emails=request.args.get('emails').split('_') #provide email seperated by '_' > abc@d.com_efg@f.com_xyz@p.com
    msg=request.args.get('message') #parameter message

    for email_id in emails:
        message=\
        f"From: {sender}\n"+\
        f"To: {email_id}\n"+\
        "Subject: URGENT: Environment Backend Warnings\n\n"+\
        f"{msg}"
 
        smtp.sendmail(sender, email_id, message) 
    return "Done"