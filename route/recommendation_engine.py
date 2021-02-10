import numpy as np
import pandas as pd
import json
from PIL import Image

#parameters
START_LONG=87.269568
START_LAT=23.534924
END_LONG=87.321653
END_LAT=23.565774
ACTIONS=8
N=16

#..............#
MAX_AQI=5
MIN_AQI=1

################HELPER FUNCTIONS###################################
#HELPER Functions
def create_divisions(N):
    Y_Axis=np.linspace(START_LAT,END_LAT,N)
    X_Axis=np.linspace(START_LONG,END_LONG,N)
    Longitudes,Latitudes=np.meshgrid(X_Axis,Y_Axis)
    df_lat_long=pd.DataFrame(list(zip(Latitudes.flatten(),Longitudes.flatten())),columns=['Latitudes','Longitudes'])
    return df_lat_long

def euclidean_distance(x1,y1,x2,y2):
    return ((x1-x2)**2+(y1-y2)**2)**0.5


def add_reward_pollution_column(pollution_prediction,N,destination):
    df_lat_long=create_divisions(N)
    
    #### Goal state defined
    GOAL_STATE=np.argmin(df_lat_long[['Latitudes','Longitudes']].apply(lambda tup: euclidean_distance(tup[0],tup[1],destination[0],destination[1]),axis=1).values)
    
    ### Defined aqi rewards(+ve)
    df_lat_long['Pol_rewards']=np.flipud(np.array(Image.fromarray(pollution_prediction).resize((N,N),Image.NEAREST))).flatten()
    
    ## Defined goal state rewards as 10
    df_lat_long.loc[GOAL_STATE,'Pol_rewards']=10
    
    return df_lat_long

#Add AQI information to the environment model
def return_combined_data(pollution_prediction,N,destination,alpha):
    matrix=[]
    df_state_details=add_reward_pollution_column(pollution_prediction,N,destination)
    with open('./logs/Recorded_details.json', 'r') as openfile: 
        fixed_data = json.load(openfile)
    for i in range(N):
        for j in range(N):
            point_det=[]
            data=fixed_data.get(str(N*i+j))
            point_det.append(data['Id'])
            for action in range(ACTIONS):
                if data['directions'][str(action)]['distance']!=0:
                    if df_state_details.iloc[data['directions'][str(action)]['id']]['Pol_rewards']!=10:
                        data['directions'][str(action)]['cost']=\
                                            alpha*(data['directions'][str(action)]['cost'])-\
                                            (1-alpha)*((df_state_details.iloc[data['directions'][str(action)]['id']]['Pol_rewards']-MIN_AQI)/(MAX_AQI-MIN_AQI))
                                            #cost=alpha*C_d(-ve) - (1-alpha)*(norm(AQI_pol_rewd)(+ve this is why - is needed))
                    else:
                        data['directions'][str(action)]['cost']=10
                        #if goal state cost is updated as 10
                else:
                    data['directions'][str(action)]['cost']=\
                                            -1*((df_state_details.iloc[data['directions'][str(action)]['id']]['Pol_rewards']-MIN_AQI)/(MAX_AQI-MIN_AQI))
                                            #if corner state and self-loop occur then cost = - norm(AQI_pol_rewd)
            
            point_det.append(data['directions'])
            matrix.append(point_det)
            
    df_matrix=pd.DataFrame(matrix,columns=['Id','directions'])
    df_state_details=pd.concat([df_matrix,df_state_details],axis=1)
    return df_state_details

#### ALGORITHM
def policy_iteration(P,R,STATES):
    Q=np.zeros((ACTIONS,STATES,1))
    Q_bk=np.random.random((ACTIONS,STATES,1))
    V=np.zeros((STATES,1))
    gamma=0.99
    while(np.sqrt(np.square(Q-Q_bk).sum())>0.001):
        Q_bk=Q.copy()
        Q=R+gamma*np.matmul(P,V)
        V=np.max(Q,axis=0)
        
    policy=np.argmax(Q,axis=0)
    return policy

### ALGORITHM EXECUTER
def return_policy(pollution_prediction,destination,N,alpha):
    df_state_details=return_combined_data(pollution_prediction,N,destination,alpha)
    STATES=N*N #no of states
    
    P=np.zeros((ACTIONS,STATES,STATES))
    R=np.zeros((ACTIONS,STATES,1))

    for state in range(STATES):
        mapping=df_state_details.iloc[state]['directions']
        for action in range(ACTIONS):
            move=mapping.get(str(action))
            P[action,state,move['id']]=1
            R[action,state]=move['cost']
            
    policy=policy_iteration(P,R,STATES)
    return policy,df_state_details 

#GIVE PATHS ACCORDING TO POLICY
def get_path_from_source_to_destination(source,destination,pollution_prediction,N,alpha,explore=0): 
    policy,df_state=return_policy(pollution_prediction,destination,N,alpha)    
    SOURCE_STATE=np.argmin(df_state[['Latitudes','Longitudes']].apply(lambda tup: euclidean_distance(tup[0],tup[1],source[0],source[1]),axis=1).values)
    GOAL_STATE=np.argmin(df_state[['Latitudes','Longitudes']].apply(lambda tup: euclidean_distance(tup[0],tup[1],destination[0],destination[1]),axis=1).values)
    
    path=[]
    AQI=0
    Distance=0
    
    state=SOURCE_STATE #stating from source point

    while state!=GOAL_STATE: #go till goal is reached
        action= np.random.randint(0,8) if np.random.random()<=explore else policy[state][0] #selecting action from policy or randomly
        
        path.extend(df_state.iloc[state]['directions'][str(action)]['Tuples_list']) #adding new path points to the list
        AQI+=df_state.iloc[state]['Pol_rewards'] #keep running sum of aqi exposed
        Distance+=df_state.iloc[state]['directions'][str(action)]['distance'] #keep running sum of distance travelled
        
        state=df_state.iloc[state]['directions'][str(action)]['id'] #changing to next selected state
    
    map_to_return={}
    #map_to_return['alpha']=alpha #adding alpha used
    #map_to_return['Explore']=explore #adding exploration used
    map_to_return['distance']=Distance #adding total distance travelled
    map_to_return['AQI']=float(AQI) #adding total aqi exposed
    map_to_return['lat_longs']=path  #adding total path from source to destination
    
    return map_to_return

########################################END HELPERS#####################################

#MAIN HANDELER TO CALL TO THE RECOMMENDATION ENGINE
def get_paths_recommended_defaults(source,destination,pollution_prediction):

    path_configs={
        'path1':{'alpha':0,'explore':0.,'sc':'orange','pc':'orange','symbol':'+'}, #depends on AQI only
        'path2':{'alpha':0.5,'explore':0.,'sc':'blue','pc':'blue','symbol':'+'}, #depends on AQI & distance
        'path3':{'alpha':1,'explore':0.,'sc':'red','pc':'red','symbol':'+'} #depends on distance only
    }

    for path_no in path_configs.keys():
        path_configs[path_no]['path']=get_path_from_source_to_destination( source,
                                                                        destination,
                                                                        pollution_prediction,
                                                                        N,
                                                                        alpha=path_configs[path_no]['alpha'],
                                                                        explore=path_configs[path_no]['explore'] )

    return path_configs

def get_paths_recommended_on_alpha(source,destination,pollution_prediction,alpha):
    #higher alpha means more importance to distance
    #alpha-->distance
    #(1-alpha)-->AQI
    
    path_configs={
        'path_req':{'alpha':alpha,'explore':0,'sc':'green','pc':'green','symbol':'+'} #custom alpha is given
    }

    for path_no in path_configs.keys():
        path_configs[path_no]['path']=get_path_from_source_to_destination( source,
                                                                        destination,
                                                                        pollution_prediction,
                                                                        N,
                                                                        alpha=path_configs[path_no]['alpha'],
                                                                        explore=path_configs[path_no]['explore'] )

    return path_configs