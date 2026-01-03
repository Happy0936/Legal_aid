FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python manage.py collectstatic --noinput


COPY . .

EXPOSE 8000

CMD ["gunicorn", "wsgi:application", "--bind", "0.0.0.0:8000"]

