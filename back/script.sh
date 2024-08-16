#!/bin/bash

sleep 20;

python pong_project/manage.py makemigrations;
python pong_project/manage.py migrate

python create_superuser.py

python pong_project/manage.py runserver 0.0.0.0:8000
