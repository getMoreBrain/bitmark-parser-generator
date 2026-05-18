FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install shared build and runtime dependencies
COPY .devcontainer/docker/install-deps.sh /tmp/install-deps.sh
RUN /tmp/install-deps.sh && rm /tmp/install-deps.sh

# Import Node.js release signing keys for GPG verification
# https://github.com/nodejs/node#release-keys
# Required for mise to install Node.js versions
# gpg keys are used to verify the integrity of downloaded Node.js binaries
USER vscode
RUN gpg --keyserver hkps://keys.openpgp.org --recv-keys \
  4ED778F539E3634C779C87C6D7062848A1AB005C \
  141F07595B7B3FFE74309A904F0EEBB37E0E2C14 \
  74F12602B6F1C4E913FAA37AD3A89613643B6201 \
  DD792F573C6DE52C432CBDAC77ABFA00DDBF2B7C \
  CC68F5A3106FF448322E48ED27F5E38D5B0A215F \
  8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
  C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  890C08DB8579162FEE0DF9DB8BEAB4DFCF555EF4 \
  C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C \
  108F52B48DB57BB0CC439B2997B01419BD92F80A \
  A363A499291CBBC940AE88276104A21DB7A5B203
USER root

# Install mise and activate it in bash and zsh
RUN curl https://mise.jdx.dev/install.sh | MISE_INSTALL_PATH=/usr/local/bin/mise sh \
  && echo 'eval "$(mise activate bash)"' >> /home/vscode/.bashrc \
  && echo 'eval "$(mise activate zsh)"' >> /home/vscode/.zshrc
