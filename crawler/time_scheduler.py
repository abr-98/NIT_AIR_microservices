import datetime
from time import sleep
import requests
import pymongo
from pymongo import MongoClient
from Extrapolator import get_database_record

print('Connecting to mongo Server...')
mongo_client=MongoClient("mongo",27017)
mongo_db=mongo_client["mydb"]
mongo_db_collection=mongo_db["data"]


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
    print(f"Sleeping for {sleep_time} Seconds....will continue in next hour...\n\n")
    sleep(sleep_time)

def check_if_on_past_record_hour():
    date,hour,_,_=get_date_hour_and_effective_date_hour()
    data=mongo_db_collection.find_one({'date':date,'hour':hour},{'_id':0,'all_pos_feat':0}) #query db
    if data!=None: #if data is returned
        print("Record Exist so should wait for new hour...")
        return True #if rerun on same hour then for skipping perpose return true
    else: #if None is returned so, data not exist yet
        print("Record need to be stored...")
        return False #otherwise for new record don't skip


def store_to_db_and_log_to_file(date,hour,record):
    mongo_db_collection.insert(record) #record inserted
    print(f"Data Recorded to mongo DB...for Date {date} hour {hour}...")


    
print("RUNNING FRESH CRAWLER & DATABASE STORE PROCEDURE.....\n\n")
while True:
    if check_if_on_past_record_hour()==False: #means this hour data is not stored previously
        date,hour,effective_date,effective_hour=get_date_hour_and_effective_date_hour()
        try:
            record=get_database_record(date,hour,effective_date,effective_hour)
        except:
            error_message="Some issue with Extrapolator or Crawler....please Fix soon...retrying for now"
            print(error_message)
            requests.get(f"http://mail:5000/notify?message={error_message}")
            print("Wait for 10 mins to resolve")
            sleep(10*60) #wait for 10 minutes
            continue

        
        #print(record) #store in db here
        store_to_db_and_log_to_file(date,hour,record)
        
    wait_for_next_hour()