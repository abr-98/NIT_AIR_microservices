from flask import Flask,request,jsonify
from Extrapolator import get_database_record
app=Flask(__name__)


@app.route("/")
def home():
    return "Hello from the Crawler"

    
@app.route("/crawl")
def data():
    date=request.args.get('date')
    hour=request.args.get('hour')

    dev_list,record=get_database_record(date,hour)
    print(dev_list)
    return jsonify(record)