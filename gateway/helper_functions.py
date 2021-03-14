import pymongo
from pymongo import MongoClient
import datetime

print("Connecting to mongoDB Server")

client = MongoClient('mongo', 27017)
db_mongo=client['mydb']
table=db_mongo['data']





#Helper functions#####################################################################################################
def get_pred_by_day(date):
    record=table.find({"date":date},
                           {'_id':0, 
                            'date':0,
                            'hour':0, 
                            'timezone':0, 
                            'all_pos_feat':0, 
                            'labels':0, 
                            'data_quality':0, 
                            'active_devices':0, 
                            'accuracy':0})
    return record

def get_dates(date,num): 
    date_end = datetime.date(int(date.split('-')[0]),int(date.split('-')[1]),int(date.split('-')[2]))
    dates=[dates for dates in (date_end - datetime.timedelta(n) for n in range(int(num)))]
    
    return dates

def get_hour_wise(grid,date):
    records=get_pred_by_day(date)
    
    date_aqi={1:0,2:0,3:0,4:0,5:0}
    for record in records:
        class_=record['predictions'][grid]
        date_aqi[class_]+=1
    return date_aqi
        

def get_percentage_from_dict(dic):
    d=dic.copy()
    sum_=sum(d.values())
    for k in d.keys():
        d[k]=round((d[k]/sum_)*100,1)
    return list(d.values())


def get_hour_wise_all(date):
    records=get_pred_by_day(date)
    date_aqi={1:0,2:0,3:0,4:0,5:0}
    for record in records:
        total_rec=record['predictions']
        for rec in total_rec:
            class_=rec
            date_aqi[class_]+=1
    return list(date_aqi.values())


def format_data_for_group_bar_chart(data):
    dic={
            "days":list(data.keys()),
            "AQI1": [List[0] for List in data.values()],
            "AQI2": [List[1] for List in data.values()],
            "AQI3": [List[2] for List in data.values()],
            "AQI4": [List[3] for List in data.values()],
            "AQI5": [List[4] for List in data.values()]
        }
    return dic

#######################################################################################################################

#ENDPOINTS###

#### Get Prediction by hour and date (MAP heatmap) **Endpoint**
def get_pred_by_hour_day(date,hour):
    record=table.find_one({"date":date,"hour":hour},
                           {'_id':0, 
                            'date':0,
                            'hour':0, 
                            'timezone':0, 
                            'all_pos_feat':0, 
                            'labels':0, 
                            'data_quality':0, 
                            'active_devices':0, 
                            'accuracy':0})
    pred=record['predictions']
    return pred


#### Monthly, weekly and daily grid wise aqi percentage  (Grid_Click_table) **Endpoint**
def get_pred_by_grid(grid,date):
    count=1
    dates=get_dates(date,30)
    monthly_aqi={1:0,2:0,3:0,4:0,5:0}
    for date in dates:
 
        date_aqi=get_hour_wise(grid,str(date))

        for key in date_aqi:
            monthly_aqi[key]+=date_aqi[key]
        if count<=1:
            day_aqi=monthly_aqi.copy()
        if count<=7:
            week_aqi=monthly_aqi.copy()
        count+=1
    
    return_={"daily":get_percentage_from_dict(day_aqi),
             "weekly":get_percentage_from_dict(week_aqi),
             "monthly":get_percentage_from_dict(monthly_aqi)}
    return return_


# #### Weekly Grid Wise (Barchart when grid is selected) **Endpoint**
def get_pred_by_grid_weekly(grid,date):
    count=1
    dates=get_dates(date,7)
    monthly_aqi={1:0,2:0,3:0,4:0,5:0}
    return_={}
    for date in reversed(dates):
        date_aqi=list(get_hour_wise(grid,str(date)).values())
        return_[str(date)]=date_aqi
    return return_
        
    

#### Weekly All  (Barchart when All is selected)  **Endpoint**
def get_pred_all_weekly(date):
    count=1
    dates=get_dates(date,7)
    monthly_aqi={1:0,2:0,3:0,4:0,5:0}
    return_={}
    for date in reversed(dates):
        date_aqi=get_hour_wise_all(str(date))
        return_[str(date)]=date_aqi
    return return_


# #### Daily count (PIE chart of daily AQIs) **Endpoint**
def get_daily(date):
    records=get_pred_by_day(date)
    
    date_aqi={1:0,2:0,3:0,4:0,5:0}
    for record in records:
        record_daily=record['predictions']
        for class_ in record_daily:
            date_aqi[class_]+=1
    return list(date_aqi.values())