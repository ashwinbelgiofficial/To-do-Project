#!/usr/bin/env bash
set -o errexit

pip install -r backend/requirements.txt

python backend/manage.py collectstatic --no-input

python backend/manage.py migrate

python backend/manage.py shell -c "
import os
from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get('ADMIN_USERNAME')
email = os.environ.get('ADMIN_EMAIL')
password = os.environ.get('ADMIN_PASSWORD')

if username and password:
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'email': email or '',
            'is_staff': True,
            'is_superuser': True,
        }
    )

    if created:
        user.set_password(password)
        user.save()
        print('Admin user created successfully.')
    else:
        print('Admin user already exists.')
"