import datetime
from time import sleep
import numpy as np
import requests
import pymongo
from pymongo import MongoClient
from recommendation_engine import get_paths_recommended_defaults,get_paths_recommended_on_alpha
from flask import Flask,request,jsonify

app = Flask(__name__) #Flask App

#MongoDB Database Handler
mongo_client=MongoClient("mongo",27017) #connects to soft-network's MongoDB host
mongo_db=mongo_client["mydb"]
mongo_db_collection=mongo_db["data"]


def get_current_date_hour():
    d=datetime.datetime.today()
    date=str(d.year)+"-"+str(d.month).zfill(2)+"-"+str(d.day).zfill(2) #yyyy-mm-dd
    hour=str(d.hour).zfill(2) #hh
    return date,hour

def get_db_record_pollution_prediction_for_now(): #return polution prediction from db for curr time
    data=None
    while data==None: #loop till data is None
        date,hour=get_current_date_hour()
        data=mongo_db_collection.find_one({'date':date,'hour':hour},{'_id':0,'all_pos_feat':0}) #break only data is crawled
        if data==None:
            app.logger.warning('Data still not crawled by the crawler container....sleeping for 1 min')
            sleep(1*60) #sleep for 1 min

    return np.array(data['predictions'],dtype=np.uint8).reshape(4,4) #data is reshaped and send

#END-POINTS................................................................

@app.route("/")
def home():
    return "Hello from Route Recommendation Server"

@app.route("/recomm")
def get_recommendation():
    source=[float(e) for e in request.args.get('source').split(",")]
    destination=[float(e) for e in request.args.get('destination').split(",")]
    alpha=float(request.args.get('alpha')) if request.args.get('alpha')!=None else None

    #here call to mongo will occur
    pollution_prediction=get_db_record_pollution_prediction_for_now()
    #np.array([[1,2,1,3],[2,3,1,3],[1,2,1,2],[2,2,3,3]],dtype=np.uint8)

    if alpha ==None: #if alpha not provided
        recomm=get_paths_recommended_defaults(source,destination,pollution_prediction) #Return defaults routes
    else:
        recomm=get_paths_recommended_on_alpha(source,destination,pollution_prediction,alpha) #Return required route
    
    return jsonify(recomm)