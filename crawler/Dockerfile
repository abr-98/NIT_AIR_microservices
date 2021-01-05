FROM python:3.7

COPY Requirements.txt Requirements.txt 
RUN pip install -r ./Requirements.txt 

COPY . /app

#installing google chrome
RUN apt install -y ./app/google-chrome.deb


ENV APP_HOME /app

ENV FLASK_APP=time_scheduler.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

WORKDIR ${APP_HOME}

EXPOSE 5000

CMD ["flask","run"]