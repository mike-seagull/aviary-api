from fastapi import APIRouter

cook_router = APIRouter()

@cook_router.post('/')
def convert():
    return "in cook"