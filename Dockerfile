FROM python:3.9
ARG port
WORKDIR /app

COPY . /app/
ENV PORT=$port
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
EXPOSE $PORT
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", $PORT]