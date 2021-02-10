FROM python:3.7

COPY . /app
WORKDIR /app

RUN pip install --upgrade pip
RUN pip install -r Requirements.txt

ENV FLASK_APP=route_service.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
#ENV FLASK_ENV=development
ENV TZ=Asia/Calcutta

EXPOSE 5000

CMD ["flask","run"]