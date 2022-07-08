from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import hashlib
import random

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/rd")

urls = {}
tags = {}
@router.get("")
def redirect_page(request: Request):
    return templates.TemplateResponse(name="redirect.html", context={'request': request})

@router.post("", response_class=HTMLResponse)
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

@router.get("/{tag}")
def redirect(tag: str, request: Request):
    # connect to db
    # return 500 if no tag is found
    try:
        url = tags[tag] # get url from tag
        return RedirectResponse(url)
    except KeyError:
        return HTTPException(status_code=404, detail="Invalid URL")
