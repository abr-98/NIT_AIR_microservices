FROM python:3.7

COPY Requirements.txt Requirements.txt 
RUN pip install -r ./Requirements.txt 

COPY . /app

#installing google chrome
RUN apt-get update 
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils libgbm1

RUN dpkg -i /app/chrome/google-chrome.deb


ENV APP_HOME /app

ENV FLASK_APP=time_scheduler.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

WORKDIR ${APP_HOME}

EXPOSE 5000

CMD ["flask","run"]