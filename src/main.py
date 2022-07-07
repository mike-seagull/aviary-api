from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
import os.path
import markdown
import hashlib
import random
# from .routers.cook import router as cook_router

app = FastAPI()
# app.include_router(cook_router, prefix="/cook")

templates = Jinja2Templates(directory="templates")
# app.mount("/", StaticFiles(directory="ui", html=True), name="ui")

@app.get("/")
async def root():
    return RedirectResponse("/docs")

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

urls = {}
tags = {}
@app.get("/rd")
def redirect_page(request: Request):
    return templates.TemplateResponse(name="redirect.html", context={'request': request})

@app.post("/rd", response_class=HTMLResponse)
def create_tag(request: Request, url: str = Form(...) ):
    
    if url not in urls:
        # generate tag
        tag = ""
        while 1:
            TAG_LENGTH = 6
            tag = list(url)
            random.shuffle(tag)
            tag = "".join(tag)
            tag = hashlib.md5(tag.encode("utf-8")).hexdigest()[:TAG_LENGTH] # generate tags
            print(tag)
            if tag not in tags:
                # add url and tag to db
                tags[tag] = url
                urls[url] = tag
                break
    else: # use the old tag
        tag = urls[url]
    return templates.TemplateResponse(name="redirect.html", context={'request': request, "tag": tag})

@app.get("/rd/{tag}")
def redirect(tag: str, request: Request):
    # connect to db
    # return 500 if no tag is found
    try:
        url = tags[tag] # get url from tag
        return RedirectResponse(url)
    except KeyError:
        return HTTPException(status_code=404, detail="Invalid URL")