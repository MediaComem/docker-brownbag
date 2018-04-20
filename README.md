# Docker Brown Bag

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Requirements](#requirements)
- [What is Docker?](#what-is-docker)
- [Running containers](#running-containers)
  - [Make sure Docker is working](#make-sure-docker-is-working)
  - [Run a container from an image](#run-a-container-from-an-image)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



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



## Running containers

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

### Run a container from an image

Pull the [official Ubuntu image][hub-ubuntu] from the [Docker Hub][hub].

```bash
$> docker pull ubuntu
Using default tag: latest
latest: Pulling from library/ubuntu
d3938036b19c: Pull complete
a9b30c108bda: Pull complete
67de21feec18: Pull complete
817da545be2b: Pull complete
d967c497ce23: Pull complete
Digest: sha256:9ee3b83bcaa383e5e3b657f042f4034c92cdd50c03f73166c145c9ceaea9ba7c
Status: Downloaded newer image for ubuntu:latest
```

An image is a **blueprint** which form the basis of containers.
This `ubuntu` image contains a headless Ubuntu operating system.

You can list available images with `docker images`:

```bash
$> docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              latest              c9d990395902        7 days ago          113MB
hello-world         latest              e38bc07ac18e        8 days ago          1.85kB
```

Run a **container** based on that image with `docker run <image> [command...]`:

```bash
$> docker run ubuntu echo "hello from ubuntu"
hello from ubuntu
```

This runs an Ubuntu container.

Running a container means **executing the specified command**, in this case `echo "hello from ubuntu"`, starting from an image, in this case the Ubuntu image.
The `echo` binary that is executed is the one provided by the Ubuntu OS in the image, not your machine.

If you list the running containers with `docker ps`, you will see that the container we just ran is not running any more.
A container **stops as soon as its command is done**.
Since `echo` is not a long-running command, the container stopped right away.

```bash
$> docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

You can see the stopped container with `docker ps -a`, which lists all containers regardless of their status:

```bash
$> docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                      PORTS               NAMES
3431b4ff3eb0        ubuntu              "echo 'hello from ub…"   51 seconds ago      Exited (0) 54 seconds ago                       frosty_jepsen
```

You can remove a stopped container with `docker rm`, using either its ID or its name:

```bash
$> docker rm frosty_jepsen
frosty_jepsen
$> docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

You can also use the `--rm` option with `docker run` to automatically remove the container when it stops:

```bash
$> docker run --rm ubuntu echo "hello from ubuntu"
hello from ubuntu
```

No new container should appear in the list:

```bash
$> docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                      PORTS               NAMES
3431b4ff3eb0        ubuntu              "echo 'hello from ub…"   2 minutes ago       Exited (0) 2 minutes ago                        frosty_jepsen
```

### Run multiple commands in a container

You can run commands more complicated than `echo`.
For example, let's run a [Bash shell][bash].

Since this is an interactive command, add the `-i` (interactive) and `-t` (pseudo-TTY) options to `docker run`:

```bash
$> docker run -it ubuntu bash
root@e07f81d7941d:/#
```

```bash
root@e07f81d7941d:/# cat << EOF > /usr/local/bin/clock.sh
#!/bin/bash
trap "exit" SIGKILL SIGTERM SIGHUP SIGINT EXIT
while true; do
  echo It is \$(date)
  sleep 1
done
EOF
```

```bash
root@e07f81d7941d:/# chmod +x /usr/local/bin/clock.sh
```

```bash
root@e07f81d7941d:/# clock.sh
It is Fri Apr 20 14:22:05 UTC 2018
It is Fri Apr 20 14:22:06 UTC 2018
It is Fri Apr 20 14:22:07 UTC 2018
It is Fri Apr 20 14:22:08 UTC 2018
It is Fri Apr 20 14:22:09 UTC 2018
It is Fri Apr 20 14:22:11 UTC 2018
It is Fri Apr 20 14:22:12 UTC 2018
```

Use Ctrl-C to stop the script.

```bash
root@e07f81d7941d:/# exit
```



## Creating images

### Committing a container's state to an image manually

```bash
$> docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                        PORTS               NAMES
e07f81d7941d        ubuntu              "bash"              8 minutes ago       Exited (130) 18 seconds ago                       clever_hermann
```

```bash
$> docker commit clever_hermann clock:1.0
sha256:2228d4cc8a5d01bd99eb48cafb24d31072d17439fe1b523c355069df556cb7d0
```

```bash
$> docker images
REPOSITORY          TAG                 IMAGE ID            CREATED                  SIZE
clock               1.0                 2228d4cc8a5d        Less than a second ago   113MB
clock               latest              2228d4cc8a5d        Less than a second ago   113MB
ubuntu              latest              c9d990395902        7 days ago               113MB
hello-world         latest              e38bc07ac18e        8 days ago               1.85kB
```

```bash
$> docker run --rm clock clock.sh
It is Fri Apr 20 14:31:08 UTC 2018
It is Fri Apr 20 14:31:09 UTC 2018
It is Fri Apr 20 14:31:10 UTC 2018
```

Use Ctrl-C to stop the script.

```bash
root@c34111c82c9b:/# apt-get update
Get:1 http://security.ubuntu.com/ubuntu xenial-security InRelease [102 kB]
...
Fetched 25.1 MB in 2s (12.3 MB/s)
Reading package lists... Done
```

```bash
root@c34111c82c9b:/# apt-get install -y cowsay
Reading package lists... Done
Building dependency tree
Reading state information... Done
The following additional packages will be installed:
  cowsay-off ifupdown iproute2 isc-dhcp-client isc-dhcp-common libatm1 libdns-export162 libgdbm3 libisc-export160 libmnl0 libperl5.22 libtext-charwidth-perl libxtables11 netbase perl perl-base
  perl-modules-5.22 rename
Suggested packages:
  filters ppp rdnssd iproute2-doc resolvconf avahi-autoipd isc-dhcp-client-ddns apparmor perl-doc libterm-readline-gnu-perl | libterm-readline-perl-perl make
The following NEW packages will be installed:
  cowsay cowsay-off ifupdown iproute2 isc-dhcp-client isc-dhcp-common libatm1 libdns-export162 libgdbm3 libisc-export160 libmnl0 libperl5.22 libtext-charwidth-perl libxtables11 netbase perl perl-modules-5.22
  rename
The following packages will be upgraded:
  perl-base
1 upgraded, 18 newly installed, 0 to remove and 4 not upgraded.
Need to get 9432 kB of archives.
After this operation, 44.8 MB of additional disk space will be used.
Get:1 http://archive.ubuntu.com/ubuntu xenial-updates/main amd64 perl-base amd64 5.22.1-9ubuntu0.3 [1286 kB]
...
Fetched 9432 kB in 0s (19.5 MB/s)
debconf: delaying package configuration, since apt-utils is not installed
(Reading database ... 4768 files and directories currently installed.)
Preparing to unpack .../perl-base_5.22.1-9ubuntu0.3_amd64.deb ...
Unpacking perl-base (5.22.1-9ubuntu0.3) over (5.22.1-9ubuntu0.2) ...
Setting up perl-base (5.22.1-9ubuntu0.3) ...
...
```

```bash
root@e07f81d7941d:/# cat << EOF > /usr/local/bin/clock.sh
#!/bin/bash
trap "exit" SIGKILL SIGTERM SIGHUP SIGINT EXIT
while true; do
  echo It is \$(date)
  /usr/games/fortune | /usr/games/cowsay
  sleep 5
done
EOF
```

```bash
$> docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                       PORTS               NAMES
c34111c82c9b        clock               "bash"              9 minutes ago       Exited (130) 3 minutes ago                       youthful_chaplygin
e07f81d7941d        ubuntu              "bash"              14 minutes ago      Exited (130) 5 minutes ago                       clever_hermann
```

```bash
$> docker commit youthful_chaplygin clock:2.0
sha256:eac74c6f407736a82ff7f4442c33d116030cb0d255507edf0923da0de7f67289
```

```bash
$> docker images
REPOSITORY          TAG                 IMAGE ID            CREATED                  SIZE
clock               2.0                 eac74c6f4077        3 minutes ago            204MB
clock               1.0                 2228d4cc8a5d        Less than a second ago   113MB
clock               latest              eac74c6f4077        Less than a second ago   113MB
ubuntu              latest              c9d990395902        7 days ago               113MB
hello-world         latest              e38bc07ac18e        8 days ago               1.85kB
```

```bash
$> docker run --rm clock clock.sh
It is Fri Apr 20 14:44:54 UTC 2018
 _______________________________________
/ You can create your own opportunities \
| this week. Blackmail a senior         |
\ executive.                            /
 ---------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
It is Fri Apr 20 14:44:59 UTC 2018
 ___________________________________
/ Repartee is something we think of \
| twenty-four hours too late.       |
|                                   |
\ -- Mark Twain                     /
 -----------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

Use Ctrl-C to stop the script (and the container).

Note that your previous image is still available under the `1.0` version.
You can run it again:

```bash
$> docker run --rm clock:1.0 clock.sh
It is Fri Apr 20 14:51:25 UTC 2018
It is Fri Apr 20 14:51:26 UTC 2018
It is Fri Apr 20 14:51:27 UTC 2018
```

Exit with Ctrl-C, then re-run the `2.0` version:

```bash
$> docker run --rm clock:2.0 clock.sh
It is Fri Apr 20 14:51:31 UTC 2018
 _____________________________________
/ Your goose is cooked. (Your current \
\ chick is burned up too!)            /
 -------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

Exit with Ctrl-C.



## TODO

* file system isolation
* incremental file system
* dockerfile
* network
* docker compose
* docker swarm



## References

* [What is Docker?][what-is-docker]
* [What is a Container?][what-is-a-container]



[bash]: https://en.wikipedia.org/wiki/Bash_(Unix_shell)
[docker-ce]: https://www.docker.com/community-edition
[git-bash]: https://git-scm.com/downloads
[hub]: https://hub.docker.com
[hub-ubuntu]: https://hub.docker.com/_/ubuntu/
[what-is-a-container]: https://www.docker.com/what-container
[what-is-docker]: https://www.docker.com/what-docker
[wsl]: https://docs.microsoft.com/en-us/windows/wsl/install-win10
