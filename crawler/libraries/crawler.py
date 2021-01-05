import os
import requests
import numpy as np
import pandas as pd
from selenium import webdriver
from .email_list import report_emails


curr_dir=os.getcwd()

meteoblue_path="\\download\\Meteoblue_data\\"
device_path="\\download\\IOT_data\\"

#Flush download folder
def flush_memo():
    fldrs=[meteoblue_path.replace("\\","/")[1:],device_path.replace("\\","/")[1:]]
    
    for fldr in fldrs:
        files=os.listdir(fldr)
        for file in files:
            #print("Deleting file: ",file)
            os.remove(fldr+'/'+file)


#Meteology Data Crawler
def crawler_meteoblue():
    chromeOptions=webdriver.ChromeOptions()
    
    prefs = {"download.default_directory" : curr_dir+meteoblue_path,
            "directory_upgrade": True}}
    
    chromeOptions.add_experimental_option("prefs",prefs)
    chromeOptions.add_argument("--headless")
    
    driver = webdriver.Chrome(executable_path='chrome/chromedriver.exe',
                              chrome_options=chromeOptions)
    
    driver.get("https://www.meteoblue.com/en/products/historyplus/download/durgapur_india_1272175")

    driver.find_element_by_xpath("/html/body/div[2]/div/form/div/input").click() #accept and continue

    button=driver.find_element_by_class_name("bloo")

    ######Click on checkbox#########
    
    def click_element(driver,e_xpath):
        i=0
        while True:
            try:
                i+=1 #no of click attampts
                elem=driver.find_element_by_xpath(e_xpath)
                elem.click()
                return
            except:
                if i>500:#max limit of clicking a button before haulting everything and shuts down the container.
                    error_message="No internet OR Meteoblue site Changed fix the crawler immediately and restart the container"
                    requests.get(f"http://localhost:1234/notify?emails={report_emails}&message={error_message}") 
                    #mail service is at this url @localhost
                    raise Exception(error_message)

    l=['//*[@id="params"]/optgroup[2]/option[3]',
       '//*[@id="params"]/optgroup[6]/option[1]',
       '//*[@id="params"]/optgroup[4]/option[1]',
       '//*[@id="params"]/optgroup[4]/option[2]',
       '//*[@id="params"]/optgroup[3]/option[2]',
       '//*[@id="params"]/optgroup[3]/option[4]',
       '//*[@id="params"]/optgroup[3]/option[3]']
    
    for e in l:
        click_element(driver,e)
            
    click_element(driver,'//*[@id="wrapper-main"]/div/main/div/div[2]/form/div[4]/div[3]/div/input')
    
    return driver

#Process downloaded meteoblueDATA
def pre_process_meteoblue(date_in):# i.e 2020-12-29 11
    file=os.listdir(curr_dir+meteoblue_path)[0]
    df=pd.read_excel(curr_dir+meteoblue_path+file)
    
    modified_columns=df.iloc[8,:].values[1:] #removing TimeStamp column
    data=df.iloc[9:,:].values

    columns=['timestamp'] #adding 'timestamp' at the front
    for column_name in modified_columns:
            columns.append(column_name[9:]) #Removing Durgapur prefix from names
            
    final=pd.DataFrame(data,columns=columns) #Reconstructing the dataframe
    final=final[final.timestamp.apply(lambda e:str(e)[:-6]==date_in)] #filtering by date_in i.e like '2020-12-27 12'
    
    required_columns=['Wind Speed [10 m]',#Only these columns are required as per the model
                      'Wind Direction [10 m]',
                      'Wind Gust',
                      'Cloud Cover High [high cld lay]',
                      'Mean Sea Level Pressure [MSL]']
    
    required_data=final[required_columns] #getting the required dataframe
    
    rename_columns=['Wind Speed  [10 m above gnd]',  #Renaming columns as per our modelling
                    'Wind Direction  [10 m above gnd]',
                    'Wind Gust  [sfc]',
                    'High Cloud Cover  [high cld lay]',
                    'Mean Sea Level Pressure  [MSL]']

    required_data.columns=rename_columns #Rename columns
    
    if len(required_data)==0:
        required_data.loc[0]=[np.nan]*5 #if entry not found then fill NaN
    
    return required_data.mean(axis=0)  #returns a Series Object


#SineTech IoT device DATA crawler
def crawler_IOT():
    chromeOptions=webdriver.ChromeOptions()
    
    prefs = {"download.default_directory" : curr_dir+device_path,
            "directory_upgrade": True}
    
    chromeOptions.add_experimental_option("prefs",prefs)
    chromeOptions.add_argument("--headless")
    
    driver = webdriver.Chrome(executable_path='chrome/chromedriver.exe',
                              chrome_options=chromeOptions)
    
    driver.get("http://iotbuilder.in/nit-dp/dashboard.php")
    button=driver.find_element_by_class_name("col-md-12")
    butt=button.find_element_by_class_name("text-center")
    links = driver.find_elements_by_link_text('Save')
    for link in links:
        link.click()
        
    while sum([os.path.exists(curr_dir+device_path+f'Device-{e}.xls') for e in range(1,8)])<7: #currently wait for 7
        pass #wait for the devices to complete download all 7 devices now may increase in future.
        
    return driver


#Process IoT Data
#~helper for single device
def process_device(folder,device,date_in):
    df=pd.read_html(folder+"/{}".format(device))[0]
    df=df[df.Date.apply(lambda e:e[:-6]==date_in)]
    if len(df)==0:
        df.loc[0]=[np.nan]*7
    
    required_columns=['Temperature','Humidity','Dust (PM2.5)']#,'Carbon Monoxide','Nitrogen Dioxide','Dust (PM10)']
    #required columns from the device part
    avg_data= df[required_columns].mean() #returns a Series Object
    
    with_device=pd.concat((pd.Series({'Device':device.split(".")[0]}),avg_data)) #Adding Device info
    
    return with_device

#For all devices
def preprocess_IOT(meteo_data,date_in):
    folder=device_path.replace("\\","/")[1:-1]
    devices=['Device-1.xls','Device-2.xls','Device-3.xls','Device-4.xls',
             'Device-5.xls','Device-6.xls','Device-7.xls'] #List for devices  ** increase if new devices are added
    
    result=\
    pd.concat((
            pd.DataFrame([process_device(folder,dev,date_in) for dev in devices]),
            pd.DataFrame([meteo_data]*len(devices))
          ),axis=1) #Concatinating dev & meteoblue data
    
    return result.dropna()#returning only devs wich are running...


#Overall Crawler function Only Need to call this
def crawler(date_in=None): #date_in ="yyyy-mm-dd hh"
    #1.
    flush_memo() #delete prev downloads
    
    #2.
    meteo_site=crawler_meteoblue() #download meteoble data
    
    #3.
    iot_dev_site=crawler_IOT() #download SineTech IoT device data
    
    #23~
    meteo_site.close() #close webdriver handler
    iot_dev_site.close() #close webdriver handler
    
    #4.
    meteo_data=pre_process_meteoblue(date_in) #processing meteoblue data
    
    #5.
    iot_dev_data=preprocess_IOT(meteo_data,date_in) #processing iot data &adding meteoblue data to it
    
    #6.
    return iot_dev_data #returning according to date hour