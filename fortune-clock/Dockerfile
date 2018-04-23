FROM ubuntu

RUN apt-get update
RUN apt-get install -y fortune
RUN apt-get install -y cowsay

COPY clock.sh /usr/local/bin/clock.sh

RUN chmod +x /usr/local/bin/clock.sh
