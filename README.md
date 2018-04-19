# Docker Brown Bag

<!-- START doctoc -->
<!-- END doctoc -->



## Requirements

* [Docker Community Edition (CE)][docker-ce] (the latest version is `18.03.0-ce` at the time of
  writing)
* A UNIX command line (on Windows, use [Git Bash][git-bash] or the [Windows Subsystem for
  Linux][wsl])



## What is Docker?

Docker is the company driving the **container movement**.  Today's businesses are under pressure to
digitally transform but are constrained by existing applications and infrastructure while
rationalizing an **increasingly diverse portfolio of clouds, datacenters and application
architectures**.  Docker enables true **independence between applications and infrastructure** and
developers and IT ops to unlock their potential and creates a model for better collaboration and
innovation.

* [What is a Container?][what-is-a-container]



## Docker by Example

### Make sure Docker is working

Run the `hello-world` container to make sure everything is installed correctly:

```bash
$> docker run hello-world

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
9bb5a5d4561a: Pull complete
Digest: sha256:f5233545e43561214ca4891fd1157e1c3c563316ed8e237750d59bde73361e77
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/engine/userguide/
```



## References

* [What is Docker?][what-is-docker]
* [What is a Container?][what-is-a-container]



[docker-ce]: https://www.docker.com/community-edition
[git-bash]: https://git-scm.com/downloads
[what-is-a-container]: https://www.docker.com/what-container
[what-is-docker]: https://www.docker.com/what-docker
[wsl]: https://docs.microsoft.com/en-us/windows/wsl/install-win10
