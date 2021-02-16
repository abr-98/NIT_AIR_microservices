import requests
from flask import Flask,request,jsonify
from flask_cors import CORS
from helper_functions import get_pred_by_hour_day,get_pred_by_grid,get_pred_by_grid_weekly,get_pred_all_weekly,get_daily,format_data_for_group_bar_chart


app = Flask(__name__) #Flask App
CORS(app)


@app.route("/")
def home():
    return "Weclome to GateWay"

@app.route("/pred_by_date_hour") #HEAT MAP Endpoint
def get_pred_by_date_hour_endpoint():#"http://127.0.0.1:5000/pred_by_date_hour?date=2021-01-22&hour=17"
    date=request.args.get('date')
    hour=request.args.get('hour')
    return jsonify(get_pred_by_hour_day(date,hour))

@app.route("/pred_table_data") #TABLE Endpoint
def get_pred_table_data_by_grid_endpoint():#"http://127.0.0.1:5000/pred_table_data?date=2021-01-22&grid=8"
    date=request.args.get('date')
    grid=int(request.args.get('grid'))
    return jsonify(get_pred_by_grid(grid,date))

                                    #GROUPED BAR CHART Endpoint
@app.route("/pred_aqi_count_weekly")#"http://127.0.0.1:5000/pred_aqi_count_weekly?date=2021-01-22&grid=8" OR 
def get_pred_aqi_count_weekly():    #"http://127.0.0.1:5000/pred_aqi_count_weekly?date=2021-01-22&grid=all"
    date=request.args.get('date')
    grid=None if request.args.get('grid')=="all" else int(request.args.get('grid'))

    if grid==None:
        data=get_pred_all_weekly(date)
        formated_data=format_data_for_group_bar_chart(data) #data is just formated here
        return jsonify(formated_data)
    else:
        data=get_pred_by_grid_weekly(grid,date)
        formated_data=format_data_for_group_bar_chart(data) #data is just formated here
        return jsonify(formated_data)
    

@app.route("/whole_grid_daily_aqi_count") #PIE CHART Endpoint
def whole_grid_aqi_count():       #"http://127.0.0.1:5000/whole_grid_daily_aqi_count?date=2021-01-22"
    date=request.args.get('date')
    return jsonify(get_daily(date))

                                    #ROute REcommendation Endpoint
@app.route("/route_recommendation") #"http://127.0.0.1:5000/route_recommendation?source=23.56568156877239,87.28445354827693&destination=23.538625544471684,87.29727109990786&alpha=0.7" OR
def route_recommendation():         #"http://127.0.0.1:5000/route_recommendation?source=23.56568156877239,87.28445354827693&destination=23.538625544471684,87.29727109990786"            
    source=request.args.get('source')
    destination=request.args.get('destination')
    alpha=request.args.get('alpha') if request.args.get('alpha')!=None else None
    
    if alpha==None:
        res=requests.get(f"http://route:5000/recomm?source={source}&destination={destination}")
        return res.content
    else:
        res=requests.get(f"http://route:5000/recomm?source={source}&destination={destination}&alpha={alpha}")
        return res.content

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify("NOT_FOUND"),404