FROM python:3.9
# ARG port
WORKDIR /app
COPY . /app/
ENV PORT=80
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
CMD uvicorn src.main:app --host 0.0.0.0 --port $PORT