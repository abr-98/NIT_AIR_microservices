import pymongo
from pymongo import MongoClient

print("Connecting to mongoDB server")
client = MongoClient('mongo', 27017)
db_mongo=client['mydb']
table=db_mongo['data']


###HELPER FUNCTIONS##########################################################################
def return_array(date):
    record=table.find({"date":date,},
                           {'_id':0, 
                            'date':0,
                            'timezone':0, 
                            'all_pos_feat':0, 
                            'labels':0,
                            'predictions':0,
                            'data_quality':0, 
                            'accuracy':0})
    arr_to_return=[]
    for data in record:
        arr_to_return.append((int(data['hour']),data['active_devices']))
    return arr_to_return
      
      
def get_dev_availability_string(date):
    arr_input=return_array(date)
    Report_String="Devices Report for "+(date)+":\n\n"
    Device_report={}
    for i in range(len(arr_input)):
        Device_report[arr_input[i][0]]=arr_input[i][1]
    for hour in range(0,24):
            if hour not in list(Device_report.keys()):
                if hour>11:
                    Device_report[hour]=str(hour-12 if hour-12!=0 else 12)+'PM'+'\t'+'XX\t'+'XX\t'+'XX\t'+'XX\t'+'XX\t'+'XX\t'+'XX\t' #to do for 8 devs add +'XX\t' at the end of this line
                else:
                    Device_report[hour]=str(hour if hour!=0 else 12)+'AM'+'\t'+'XX\t'+'XX\t'+'XX\t'+'XX\t'+'XX\t'+'XX\t'+'XX\t'#to do for 8 devs add +'XX\t' at the end of this line
                    
            else:
                if hour>11:
                    hour_report=str(hour-12 if hour-12!=0 else 12)+'PM'+'\t'
                else:
                    hour_report=str(hour if hour!=0 else 12)+'AM'+'\t'
                for device in range(1,8): #to do for 8 devs make 8->9
                    device_name='Device-'+str(device)
                    if device_name not in Device_report[hour]:
                        hour_report+='XX\t'
                    else:
                        hour_report+='OK\t'
                Device_report[hour]=hour_report
        
    Report_String+='HOUR\tD1\tD2\tD3\tD4\tD5\tD6\tD7\n'#to do for 8 devs add \tD8 before \n
    Report_String+='----------------------------------------------------------\n'#to do for 8 devs increase the '------'
    for hour in range(0,24):
        Report_String+=Device_report[hour]+'\n'+'----------------------------------------------------------\n'#to do for 8 devs increase the '------'
    return Report_String