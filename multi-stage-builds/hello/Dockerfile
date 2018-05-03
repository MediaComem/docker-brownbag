FROM golang:1.10-alpine

LABEL maintainer="mei-admin@heig-vd.ch"

WORKDIR /go/src/app
COPY . /go/src/app
RUN go install

ENTRYPOINT [ "/go/bin/app" ]
CMD [ "World" ]
