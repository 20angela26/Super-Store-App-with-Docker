FROM python:3.10-slim

WORKDIR /app

COPY server.py .  
COPY respuestas.json .  

RUN pip install flask flask-cors

EXPOSE 3020

CMD ["python", "server.py"]

