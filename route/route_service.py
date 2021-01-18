import numpy as np
import requests
import pymongo
from pymongo import MongoClient
from recommendation_engine import get_paths_recommended_defaults,get_paths_recommended_on_alpha
from flask import Flask,request,jsonify

#MongoDB Database Handler
mongo_client=MongoClient("mongo",27017) #connects to soft-network's MongoDB host
mongo_db=mongo_client["mydb"]
mongo_db_collection=mongo_db["data"]


app = Flask(__name__)


@app.route("/")
def home():
    return "Hello from Route Recommendation Server"

@app.route("/recomm")
def get_recommendation():
    source=[float(e) for e in request.args.get('source').split(",")]
    destination=[float(e) for e in request.args.get('destination').split(",")]
    alpha=float(request.args.get('alpha')) if request.args.get('alpha')!=None else None

    #here call to mongo will occur
    pollution_prediction=np.array([[1,2,1,3],[2,3,1,3],[1,2,1,2],[2,2,3,3]],dtype=np.uint8)

    if alpha ==None: #if alpha not provided
        recomm=get_paths_recommended_defaults(source,destination,pollution_prediction) #Return defaults routes
    else:
        recomm=get_paths_recommended_on_alpha(source,destination,pollution_prediction,alpha) #Return required route
    
    return jsonify(recomm)
    

        



#app.run(debug=True)