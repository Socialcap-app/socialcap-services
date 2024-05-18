#
# The "base" docker image used by all other docker instances
#

# For more information, please refer to https://aka.ms/vscode-docker-python
FROM ubuntu:22.04

RUN apt-get update
RUN apt -y upgrade 
RUN apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_20.x > install-node.sh
RUN sh install-node.sh
RUN apt install -y nodejs

# Install the App
WORKDIR /services
COPY ./ /services
COPY ./.env /services/.env

RUN cd /services
RUN npm i 
RUN npm i @socialcap/contracts
RUN npm i @socialcap/contracts-lib@0.1.17
RUN npm i @socialcap/batch-voting
RUN npm i @socialcap/claim-voting

RUN npx prisma generate
#RUN npx prisma migrate dev

RUN npm run build

# we do not start any process here
