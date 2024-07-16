FROM python:3.9-slim

WORKDIR /app

COPY dfiles/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install vim -y

EXPOSE 8000

COPY ./srcs .

CMD ["python", "pong_project/manage.py", "runserver", "0.0.0.0:8000"] 
