from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os.path
import markdown
# from .routers.cook import router as cook_router

app = FastAPI()
# app.include_router(cook_router, prefix="/cook")

templates = Jinja2Templates(directory="templates")
# app.mount("/", StaticFiles(directory="ui", html=True), name="ui")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/page/{page_name}", response_class=HTMLResponse)
async def show_page(request: Request, page_name: str):
    filename = f"{page_name}.md"
    filepath = os.path.join("pages/", filename)
    with open(filepath, "r", encoding="utf-8") as input_file:
        text = input_file.read()
    html = markdown.markdown(text)
    print(html)
    return templates.TemplateResponse("page.html", {"request": request, "data": {"content": html}})


@app.get("/cook", response_class=HTMLResponse)
def cook_page(request: Request):
    new_time = ""
    return templates.TemplateResponse("cook.html", context={'request': request, 'new_time': new_time})

@app.post('/cook/convert', response_class=HTMLResponse)
def convert(request: Request, orig_temp: int = Form(...), orig_time_in_mins: int = Form(...),  new_temp: int = Form(...),):
    new_time = orig_time_in_mins * (orig_temp / new_temp)
    return templates.TemplateResponse('cook.html', context={'request': request, "new_temp": new_temp, 'new_time': int(new_time)})