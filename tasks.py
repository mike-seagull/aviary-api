from invoke import task
from invoke import tasks
import invoke

@task(aliases=["config"])
def configure_system(c):
    c.run("pyenv install $(cat .python-version)")

@task(aliases=["venv"])
def create_venv(c):
    cmds = [
        "python -m venv .venv",
        "source .venv/bin/activate"  
    ]
    for cmd in cmds: c.run(cmd)

@task(aliases=["deps"])
def install_deps(c):
    c.run("pip install -r requirements.txt")

@task
def clean(c):
    c.run("rm -rf .venv")

@task(clean, create_venv, install_deps)
def build(c):
    pass

@task
def docker_build(c):
    c.run("docker build . --tag aviary:latest")

@task
def docker_run(c):
    c.run("docker run --name aviary --detach --rm aviary:latest")
