from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
import os.path
import markdown
from .routers import (
    cook,
    rd
)

app = FastAPI()
app.include_router(cook.router)
app.include_router(rd.router)

templates = Jinja2Templates(directory="templates")
# SwaggerUI @ /docs
# ReDoc @ /redoc
@app.get("/")
async def root():
    return RedirectResponse("/redoc")

@app.get("/page/{page_name}", response_class=HTMLResponse)
async def show_page(request: Request, page_name: str):
    filename = f"{page_name}.md"
    filepath = os.path.join("pages/", filename)
    with open(filepath, "r", encoding="utf-8") as input_file:
        text = input_file.read()
    html = markdown.markdown(text)
    print(html)
    return templates.TemplateResponse("page.html", {"request": request, "data": {"content": html}})
