FROM python:3.9-slim

WORKDIR /app

COPY dfiles/requirements.txt .

COPY .env .

RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install vim -y

COPY .hostname.txt .

RUN echo "" >> .env; \
    echo -n "REDIRECT_URI='http://" >> .env; \ 
    cat .hostname.txt >> .env; \
    echo ":8000/callback'" >> .env; \
    echo -n "HOST=" >> .env; \
    cat .hostname.txt >> .env; echo "" >> .env

EXPOSE 8000

COPY ./srcs .

RUN python pong_project/manage.py makemigrations; \
    python pong_project/manage.py migrate

CMD ["python", "pong_project/manage.py", "runserver", "0.0.0.0:8000"] 
