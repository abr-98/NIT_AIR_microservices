import datetime
from time import sleep
import requests
import pymongo
from pymongo import MongoClient
from Extrapolator import get_database_record
from email_list import report_emails


mongo_client=MongoClient("mongo",27017)
mongo_db=mongo_client["mydb"]
mongo_db_collection=mongo_db["data"]



#date hour logger for past database store.
def logger(mode='write',timestamp=None):
    if mode=='write':
        f = open("./logs/ts_log.txt", "w")
        f.write(timestamp)
        f.close()
    elif mode=='read':
        f = open("./logs/ts_log.txt", "r")
        return f.read()

#get date hour
def get_date_hour_and_effective_date_hour():
    d=datetime.datetime.today()
    date=str(d.year)+"-"+str(d.month).zfill(2)+"-"+str(d.day).zfill(2) #yyyy-mm-dd
    hour=str(d.hour).zfill(2) #hh
    # converting 5 am call to 4:00-4:59am data range
    eff_d=(d-datetime.timedelta(hours=1))
    effective_date=str(eff_d.year)+"-"+str(eff_d.month).zfill(2)+"-"+str(eff_d.day).zfill(2) #yyyy-mm-dd works for 0th hour
    effective_hour=str(eff_d.hour).zfill(2) #hh-1
    return date,hour,effective_date,effective_hour

def wait_for_next_hour():
    d=datetime.datetime.today()
    sleep_time=(3600-((d.minute*60)+d.second))
    print(f"Sleeping for {sleep_time} Seconds")
    sleep(sleep_time)

def check_if_on_past_record_hour():
    date,hour,_,_=get_date_hour_and_effective_date_hour()
    if logger(mode='read')==(date+" "+hour): #yyyy-mm-dd hh
        print("Record Exist so shoud wait for new hour.")
        return True #if rerun on same hour then for skipping perpose return true
    else:
        print("Record need to be stored")
        return False #otherwise for new record don't skip


def store_to_db_and_log_to_file(date,hour,record):
    mongo_db_collection.insert(record)
    print("Data Recorded")
    logger(mode='write',timestamp=(date+" "+hour))
    print(f"Date {date} hour {hour} logged")


    
print("RUNNING FRESH CRAWLER & DATABASE STORE PROCEDURE.....\n\n")
while True:
    if check_if_on_past_record_hour()==False: #means this hour data is not stored previously
        date,hour,effective_date,effective_hour=get_date_hour_and_effective_date_hour()
        try:
            record=get_database_record(date,hour,effective_date,effective_hour)
        except:
            error_message="Some issue with Extrapolator or Crawler....please Fix soon...retrying for now"
            print(error_message)
            requests.get(f"mail:5000/notify?emails={report_emails}&message={error_message}")
            print("Wait for 10 mins to resolve")
            sleep(10*60) #wait for 10 minutes
            continue

        
        print(record) #stroe in db here
        store_to_db_and_log_to_file(date,hour,record)
        
    wait_for_next_hour()