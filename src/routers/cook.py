from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")
router = APIRouter()

@router.get("/", response_class=HTMLResponse)
def cook_page(request: Request):
    print("in cook")
    result = "Type a number"
    return templates.TemplateResponse("cook.html", context={'request': request, 'result': result})

@router.post('/convert', response_class=HTMLResponse)
def convert(request: Request, number: int = Form(...)):
    result = number + 2
    return templates.TemplateResponse('twoforms.html', context={'request': request, 'result': result, 'yournum': number})
