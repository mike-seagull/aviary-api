from fastapi import FastAPI
from ..routers.cook import cook_router

app = FastAPI()
app.include_router(cook_router, prefix="/cook")

@app.get("/")
async def root():
    return {"message": "Hello World"}
