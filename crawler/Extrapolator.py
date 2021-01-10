import pickle
import numpy as np
import pandas as pd
from crawler import crawler
from email_list import report_emails
from sklearn.metrics import accuracy_score

eucledine=lambda a,b,c,d:round(((a-c)**2+(b-d)**2)**0.5,2)

with open("./logs/model.pickle","rb") as f:
    model=pickle.load(f)
   
    
feat_cols=[
        'Temperature',
        'Humidity',
        'Mean Sea Level Pressure  [MSL]',
        'Wind Speed  [10 m above gnd]',
        'High Cloud Cover  [high cld lay]',
        'Wind Direction  [10 m above gnd]',
        'Wind Gust  [sfc]'
]

#Device Cordinate Mappings
device_pos={'Device-1':(1,3),
            'Device-2':(0,0),
            'Device-3':(3,2),
            'Device-4':(2,1), #Till here every thing is OK below are arbtary location please confirm.
            
            'Device-5':(2,3), #check
            'Device-6':(3,0), #check
            'Device-7':(3,3)  #check
           }

#....................................................................................................#

#Helper Functions
#Get pre-Contributions vec according to distance from the active devices
def get_contribution_vec(grid_dev,x,y):
    try:
        device=grid_dev.index((x,y))
        #print('It is a device')
        vec=[0]*len(grid_dev) #creating the contribution vec
        vec[device]=1
    except ValueError:
        #print('Not a device')
        vec=[0]*len(grid_dev) #creating the contribution vec
        for i,(a,b) in enumerate(grid_dev):
            vec[i]=eucledine(a,b,x,y)
    return vec


#Extrapolation Function : inverse-Linear Extrapolation 
def Extrapolate(grid,dev,rc):

    #interpolating w.r.to distance vec for each point.

    extrapol=[]
    for g in grid:
        x=1/np.array(g).reshape(-1,1)
        x[x == np.inf] = 0

        extrapol.append((x*dev).sum(axis=0)/np.sum(x))

    #Interpolated features

    grid_extended_data=pd.DataFrame(extrapol) #Extrapolated data
    
    #*** Get Actual AQI values Here ^^^ from Dist (PM2.5) columns
    real_AQI=np.random.randint(1,4,16) #DUMMY....HAVE TO CAL FROM grid_extended['Dust (PM2.5)']...<<<<<<<<<

    #RandomForest Predictions
    grid_feat=grid_extended_data[feat_cols] #Extrapolated Features

    grid_wise_pred=rc.predict(grid_feat) #Predictions
    
    #Processing features As nested Dictionaries for db storage perpose
    grid_feat=grid_feat.round(2) #Roundind floats to 2 decimal points
    dev_feat = {}
    pre_processed=dict(grid_feat.T)
    for k, v in pre_processed.items():
        dev_feat[k] = dict(v)
    
    return (
            dev_feat,  #Actual Grid Features in nested dict format
            real_AQI.tolist(),  #DUMMY real AQI values
            np.array(grid_wise_pred,dtype="int").tolist() #Predicted AQI values
           )

#TimeZone Function: 6 hr Window
def timezone(hour):
    hour=int(hour)
    if hour<=5:
        return 'Early Morning'
    elif hour<=11:
        return 'Morning'
    elif hour<=17:
        return 'Afternoon'
    elif hour<=23:
        return 'Evening'

#Get database record object for a date & hour................................
def get_database_record(date,hour):

    #df=pd.read_csv('./logs/crawl_data_test.csv') #<--Here call the Crawler
    df=crawler(date+" "+hour)#.................................................
    

    grid_dev=[device_pos[d] for d in df.Device] #Current device positions which are active

    if len(grid_dev)<=3: #if 3 or less device active then quality=bad for extrapolaton
        DataQuality='bad'
    else:
        DataQuality='good'


    grid=[]
    for i in range(4):
        for j in range(4):
            grid.append(get_contribution_vec(grid_dev,i,j))

    dev_feat,real_AQI,pred_AQI=Extrapolate(grid,df.drop(columns=['Device']),model)

    database_record=\
    {
        'date':date,
        'hour':hour,
        'timezone':timezone(hour),
        'all_pos_feat':dev_feat,
        'labels':real_AQI,
        'predictions':pred_AQI,
        'data_quality':DataQuality,
        'active_devices':df.Device.values.tolist(),
        'accuracy':accuracy_score(real_AQI,pred_AQI)

    }
    return database_record #sending Extracted information (database record to store)