FROM python:3.9-slim

WORKDIR /app

COPY dfiles/requirements.txt .

RUN pip install --update && pip install --no-cache-dir -r ./dfiles/requirements.txt

RUN apt-get update && apt-get install vim -y

COPY ./srcs .

EXPOSE 8000


CMD ["python", "transcendence/pong_project/manage.py", "runserver", "0.0.0.0:8000"] 
