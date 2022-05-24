from fastapi import APIRouter

router = APIRouter()


@router.get("/cook", tags=["cook"])
async def get_cook():
    return "in cook"

@router.post("/cook", tags=["cook"])
async def post_post():
    return ""