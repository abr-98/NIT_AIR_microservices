FROM python:3.7

COPY . /app
WORKDIR /app

RUN pip install --upgrade pip
RUN pip install -r Requirements.txt

ENV TZ=Asia/Calcutta

CMD ["python","-W","ignore","-u","report_scheduler.py"]