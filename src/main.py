from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from .routers.cook import cook_router

app = FastAPI()
app.include_router(cook_router, prefix="/cook")

templates = Jinja2Templates(directory="templates")
app.mount("/", StaticFiles(directory="ui", html=True), name="ui")

@app.get("/")
async def root():
    return {"message": "Hello World"}
