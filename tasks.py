from invoke import task
from invoke import tasks
import invoke

@task
def setup(c):
    cmds = [
        "pyenv install $(cat .python-version)",
        "python -m venv .venv",
        "source .venv/bin/activate",
        "pip install -r requirements.txt"
    ]
    for cmd in cmds: c.run(cmd)

@task
def test(c):
    c.run("echo 'test'")

@task(aliases=["tasks", "ls"])
def list(c):
    # tasks = ["list", "setup", "test"]
    # for t in tasks: print(t)
    print(dir(invoke.tasks))