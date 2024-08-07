FROM python:3.9-slim

WORKDIR /app

COPY dfiles/requirements.txt .

COPY .env .

RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install vim -y

COPY .hostname.txt .

RUN echo "" >> .env; \
    echo -n "HOST=" >> .env; \ 
    cat .hostname.txt >> .env 

EXPOSE 8000

COPY ./srcs .

RUN python pong_project/manage.py makemigrations; \
    python pong_project/manage.py migrate

# Create superuser
COPY create_superuser.py .
ENV DJANGO_SUPERUSER_USERNAME=admin
ENV DJANGO_SUPERUSER_EMAIL=admin@example.com
ENV DJANGO_SUPERUSER_PASSWORD=adminpass
ENV PYTHONPATH=/app/pong_project
RUN python create_superuser.py

CMD ["python", "pong_project/manage.py", "runserver", "0.0.0.0:8000"] 
