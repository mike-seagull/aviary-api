from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/cook")



@router.get("", response_class=HTMLResponse)
def cook_page(request: Request):
    new_time = ""
    return templates.TemplateResponse("cook.html", context={'request': request, 'new_time': new_time})

@router.post('/convert', response_class=HTMLResponse)
def convert_cook_time(request: Request, orig_temp: int = Form(...), orig_time_in_mins: int = Form(...),  new_temp: int = Form(...),):
    new_time = orig_time_in_mins * (orig_temp / new_temp)
    templates.TemplateResponse()
    return templates.TemplateResponse('cook.html', context={'request': request, "new_temp": new_temp, 'new_time': int(new_time)})
