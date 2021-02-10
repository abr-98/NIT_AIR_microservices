import datetime
import requests
import pandas as pd
from time import sleep
from report_message_gen import get_dev_availability_string

#Wait for next day @ 12:01:40 AM to send report to admins
def wait_for_next_day_12am():
    now=datetime.datetime.today()

    next_day=now+datetime.timedelta(days=1)

    wait_seconds=round((pd.to_datetime(str(next_day.date()))-now).total_seconds()+100) #100sec delta is added!!!

    print(f"\n\nWaiting for {wait_seconds} Seconds....will continue in next day 0:01:40 AM...")
    sleep(wait_seconds)

#Get date of previous day to send the report of
get_previous_day=lambda :str((datetime.datetime.today()-datetime.timedelta(days=1)).date())


print("STARTING REPORTING SERVICE FOR DEVICE AVAILABLITY.......")
while True:
    wait_for_next_day_12am() #first wait for next day
    prev_day=get_previous_day() #get prev day
    print(f'Generating Report for previous day dated: {prev_day}')
    report=get_dev_availability_string(prev_day) #generate the report
    requests.get(f"http://mail:5000/notify?message={report}") #send via mailing service