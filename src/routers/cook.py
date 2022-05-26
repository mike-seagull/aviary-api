from fastapi import APIRouter

cook_route = APIRouter()

@cook_route.get('/')
def convert():
    return "in cook"