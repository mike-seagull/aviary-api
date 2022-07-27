FROM ghcr.io/mike-seagull/gitpod-images:tailscale

RUN brew install pyinvoke
COPY .python-version .python-version
RUN pyenv install $(cat .python-version)