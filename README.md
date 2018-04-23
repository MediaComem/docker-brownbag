# Docker Brown Bag

This document describes a step-by-step procedure that you can follow to learn the basics of Docker,
from running a hello world container to running a multi-machine swarm.

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



## Containers & images

### Make sure Docker is working

Run a `hello-world` container to make sure everything is installed correctly:

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

An **image** is a **blueprint** which form the basis of containers.
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

Running a container means **executing the specified command**, in this case `echo "hello from ubuntu"`, starting from an **image**, in this case the Ubuntu image.
The `echo` binary that is executed is the one provided by the Ubuntu OS in the image, not your machine.

If you list the running containers with `docker ps`, you will see that the container we just ran is *not running*.
A container **stops as soon as the process started by its command is done**.
Since `echo` is not a long-running command, the container stopped right away.

```bash
$> docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

You can see the stopped container with `docker ps -a`, which lists all containers regardless of their status:

```bash
$> docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                      PORTS               NAMES
d042ed58ef63        ubuntu              "echo 'hello from ub…"   10 seconds ago      Exited (0) 11 seconds ago                       relaxed_galileo
02bbe5e66c15        hello-world         "/hello"                 42 seconds ago      Exited (0) 42 seconds ago                       jovial_jones
```

You can remove a stopped container or containers with `docker rm`, using either its ID or its name:

```bash
$> docker rm relaxed_galileo 02bbe5e66c15
relaxed_galileo
02bbe5e66c15
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
```

### Container isolation

Docker containers are very similar to [LXC containers][lxc] which provide many
[security][docker-security] features.  When you start a container with `docker run`, you get:

* **Process isolation:** processes running within a container cannot see, and even less
  affect, processes running in another container, or in the host system.

  See the difference between running `ps -e` and `docker run --rm ubuntu ps -e`, which will show you
  all running processes on your machine, and the same as seen from within a container, respectively.
* **File system isolation:** a container has its own file system separate from your machine's.

  See the difference between running `ls -la /` and `docker run --rm ubuntu ls -la /`, which will
  show you all files at the root of your file system, and all files at the root of the container's
  file system, respectively.
* **Network isolation:** a container doesn’t get privileged access to the sockets or interfaces of
  another container. Of course, can interact with each other through their respective network
  interface, just like they can interact with external hosts. We will see examples of this later.

### Run multiple commands in a container

You can run commands more complicated than `echo`.
For example, let's run a [Bash shell][bash].

Since this is an interactive command, add the `-i` (interactive) and `-t` (pseudo-TTY) options to `docker run`:

```bash
$> docker run -it ubuntu bash
root@e07f81d7941d:/#
```

You can now run any command you want within the running container:

```bash
root@e07f81d7941d:/# date
Fri Apr 20 13:20:32 UTC 2018
```

You can make changes to the container. Since this is an Ubuntu container, you can install packages.
Update of the package lists first with `apt-get update`:

```bash
root@e07f81d7941d:/# apt-get update
Get:1 http://archive.ubuntu.com/ubuntu xenial InRelease [247 kB]
...
Fetched 25.1 MB in 1s (12.9 MB/s)
Reading package lists... Done
```

Install the `fortune` package:

```bash
root@e07f81d7941d:/# apt-get install -y fortune
Reading package lists... Done
Building dependency tree
Reading state information... Done
Note, selecting 'fortune-mod' instead of 'fortune'
The following additional packages will be installed:
  fortunes-min librecode0
Suggested packages:
  fortunes x11-utils bsdmainutils
The following NEW packages will be installed:
  fortune-mod fortunes-min librecode0
0 upgraded, 3 newly installed, 0 to remove and 5 not upgraded.
Need to get 625 kB of archives.
After this operation, 2184 kB of additional disk space will be used.
Get:1 http://archive.ubuntu.com/ubuntu xenial/main amd64 librecode0 amd64 3.6-22 [523 kB]
...
Fetched 625 kB in 0s (3250 kB/s)
...
```

The [`fortune`][fortune] command prints a quotation/joke such as the ones found in fortune cookies
(hence the name):

```bash
root@e07f81d7941d:/# /usr/games/fortune
Your motives for doing whatever good deed you may have in mind will be
misinterpreted by somebody.
```

Let's create a fortune clock that tells the time and a fortune every 5 seconds. Run the following
multiline command to save a bash script to `/usr/local/bin/clock.sh`:

```bash
root@e07f81d7941d:/# cat << EOF > /usr/local/bin/clock.sh
#!/bin/bash
trap "exit" SIGKILL SIGTERM SIGHUP SIGINT EXIT
while true; do
  echo It is \$(date)
  /usr/games/fortune
  echo
  sleep 5
done
EOF
```

Make the script executable:

```bash
root@e07f81d7941d:/# chmod +x /usr/local/bin/clock.sh
```

Make sure it works:

```bash
root@e07f81d7941d:/# clock.sh
It is Mon Apr 23 08:47:37 UTC 2018
You have no real enemies.

It is Mon Apr 23 08:47:42 UTC 2018
Beware of a dark-haired man with a loud tie.

It is Mon Apr 23 08:47:47 UTC 2018
If you sow your wild oats, hope for a crop failure.
```

Use Ctrl-C to stop the clock script. Then use `exit` to stop the Bash shell:

```bash
root@e07f81d7941d:/# exit
```

Since the Bash process has exited, the container has stopped:

```bash
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                       PORTS               NAMES
f6b9fa680789        ubuntu              "bash"              13 minutes ago      Exited (130) 4 seconds ago                       goofy_shirley
```

### Committing a container's state to an image manually

Retrieve the name or ID of the previous container, in this case `goofy_shirley`.  You can create a
new image based on that container's state with the `docker commit <container> <repository:tag>`
command:

```bash
$> docker commit goofy_shirley fortune-clock:1.0
sha256:407daed1a864b14a4ab071f274d3058591d2b94f061006e88b7fc821baf8232e
```

You can see the new image in the list of images:

```bash
$> docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
fortune-clock       1.0                 407daed1a864        9 seconds ago       156MB
ubuntu              latest              c9d990395902        10 days ago         113MB
hello-world         latest              e38bc07ac18e        11 days ago         1.85kB
```

That image contains the `/usr/local/bin/clock.sh` script we created, so we can run it directly with
`docker run <image> <command>`:

```bash
$> docker run --rm fortune-clock:1.0 clock.sh
It is Mon Apr 23 08:55:54 UTC 2018
You will have good luck and overcome many hardships.

It is Mon Apr 23 08:55:59 UTC 2018
While you recently had your problems on the run, they've regrouped and
are making another attack.
```

Use Ctrl-C to stop the script (the container will stop and be removed automatically thanks to the
`--rm` option).

That's nice, but let's create a fancier version of our clock. Run a new Bash shell based on our
`fortune-clock:1.0` image:

```bash
$> docker run -it fortune-clock:1.0 bash
root@4b38e523336c:/#
```

Install the `cowsay` package:

```bash
root@4b38e523336c:/# apt-get install -y cowsay
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
Fetched 9432 kB in 0s (17.5 MB/s)
...
```

Overwrite the clock script with this multiline command. The output of the `fortune` command is now
piped into the `cowsay` command:

```bash
root@4b38e523336c:/# cat << EOF > /usr/local/bin/clock.sh
#!/bin/bash
trap "exit" SIGKILL SIGTERM SIGHUP SIGINT EXIT
while true; do
  echo It is \$(date)
  /usr/games/fortune | /usr/games/cowsay
  echo
  sleep 5
done
EOF
```

Test our improved clock script:

```bash
root@4b38e523336c:/# clock.sh
It is Mon Apr 23 09:02:21 UTC 2018
 ____________________________________
/ Look afar and see the end from the \
\ beginning.                         /
 ------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

It is Mon Apr 23 09:02:26 UTC 2018
 _______________________________________
/ One of the most striking differences  \
| between a cat and a lie is that a cat |
| has only nine lives.                  |
|                                       |
| -- Mark Twain, "Pudd'nhead Wilson's   |
\ Calendar"                             /
 ---------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

Much better. Exit Bash to stop the container:

```bash
root@4b38e523336c:/# exit
```

You should now have to stopped container. The one in which we created the original clock script, and
the newest one we just stopped:

```bash
$> docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                        PORTS               NAMES
4b38e523336c        fortune-clock:1.0   "bash"              4 minutes ago       Exited (130) 21 seconds ago                       peaceful_turing
f6b9fa680789        ubuntu              "bash"              27 minutes ago      Exited (130) 13 minutes ago                       goofy_shirley
```

Let's create an image from that latest container, in this case `peaceful_turing`:

```bash
$> docker commit peaceful_turing fortune-clock:2.0
sha256:92bfbc9e4c4c68a8427a9c00f26aadb6f7112b41db19a53d4b29d1d6f68de25f
```

As before, the image is available in the list of images:

```bash
$> docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
fortune-clock       2.0                 92bfbc9e4c4c        24 seconds ago      205MB
fortune-clock       1.0                 407daed1a864        11 minutes ago      156MB
ubuntu              latest              c9d990395902        10 days ago         113MB
hello-world         latest              e38bc07ac18e        11 days ago         1.85kB
```

You can run it as before:

```bash
$> docker run --rm fortune-clock:2.0 clock.sh
It is Mon Apr 23 09:06:21 UTC 2018
 ________________________________________
/ Living your life is a task so          \
| difficult, it has never been attempted |
\ before.                                /
 ----------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

Use Ctrl-C to stop the script (and the container).

Your previous image is still available under the `1.0` tag.
You can run it again:

```bash
$> docker run --rm fortune-clock:1.0 clock.sh
It is Mon Apr 23 09:08:04 UTC 2018
You attempt things that you do not even plan because of your extreme stupidity.
```

### Running containers in the background

Until now we've only run containers **in the foreground**, meaning that they take control of our
console and use it to print their output.

You can run a container **in the background** by adding the `-d` or `--detach` option.  Let's also
use the `--name` option to give it a specific name instead of using the default randomly generated
one:

```bash
$> docker run -d --name clock fortune-clock:2.0 clock.sh
06eb72c218051c77148a95268a2be45a57379c330ac75a7260c16f89040279e6
```

This time, the `docker run` command simply prints the ID of the container it
has launched, and exits immediately.  But you can see that the container is
indeed running with `docker ps`, and that it has the correct name:

```bash
$> docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
06eb72c21805        fortune-clock:2.0   "clock.sh"          6 seconds ago       Up 9 seconds                            clock
```

### Accessing container logs

You can use the `docker logs <container>` command to see the output of a
container running in the background:

```bash
$> docker logs clock
It is Mon Apr 23 09:12:06 UTC 2018
 _____________________________________
< Excellent day to have a rotten day. >
 -------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
...
```

Add the `-f` option to keep following the log output in real time:

```bash
$> docker logs -f clock
It is Mon Apr 23 09:13:36 UTC 2018
 _________________________________________
/ I have never let my schooling interfere \
| with my education.                      |
|                                         |
\ -- Mark Twain                           /
 -----------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

Use Ctrl-C to stop following the logs.

### Stopping and restarting containers

You may stop a container running in the background with the `docker stop <container>` command:

```bash
$> docker stop clock
clock
```

You can check that is has indeed stopped:

```bash
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                        PORTS               NAMES
06eb72c21805        fortune-clock:2.0   "clock.sh"          2 minutes ago       Exited (0) 1 second ago                           clock
4b38e523336c        fortune-clock:1.0   "bash"              17 minutes ago      Exited (130) 13 minutes ago                       peaceful_turing
f6b9fa680789        ubuntu              "bash"              40 minutes ago      Exited (130) 27 minutes ago                       goofy_shirley
```

You can restart it with the `docker start <container>` command. This will re-execute the command
that was originally given to `docker run <container> <command>`, in this case `clock.sh`:

```bash
$> docker start clock
clock
```

It's running again:

```bash
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
06eb72c21805        fortune-clock:2.0   "clock.sh"          3 minutes ago       Up 1 second                             clock
```

You can follow its logs again:

```bash
$> docker logs -f clock
It is Mon Apr 23 09:14:50 UTC 2018
 _________________________________
< So you're back... about time... >
 ---------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

Stop following the logs with Ctrl-C.

You can **stop and remove** a container in one command by adding the `-f` or `--force` option to
`docker rm`. Beware that it will *not ask for confirmation*:

```bash
$> docker rm -f clock
clock
```

No containers should be running any more:

```bash
$> docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

### Running multiple containers

Since containers have isolated processes, networks and file systems, you can of course run more than
one at the same time:

```bash
$> docker run -d --name old-clock fortune-clock:1.0 clock.sh
25c9016ce01f93c3e073b568e256ae7f70223f6abd47bb6f4b31606e16a9c11e
$> docker run -d --name new-clock fortune-clock:2.0 clock.sh
4e367ffdda9829482734038d3eb71136d38320b6171dda31a5b287a66ee4b023
```

You can see that both are indeed running:

```bash
$> docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
4e367ffdda98        fortune-clock:2.0   "clock.sh"          20 seconds ago      Up 24 seconds                           new-clock
25c9016ce01f        fortune-clock:1.0   "clock.sh"          23 seconds ago      Up 27 seconds                           old-clock
```

Each container is running based on the correct image, as you can see by their output:

```bash
$> docker logs old-clock
It is Mon Apr 23 09:39:18 UTC 2018
Too much is just enough.
                -- Mark Twain, on whiskey
...

$> docker logs new-clock
It is Mon Apr 23 09:40:36 UTC 2018
 ____________________________________
/ You have many friends and very few \
\ living enemies.                    /
 ------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
...
```

### Image layers

A Docker image is built up from a series of layers. Each layer contains set of differences from the
layer before it:

![Docker: Image Layers](images/layers.jpg)

You can list those layers by using the `docker inspect` command with an image name or ID. Let's see
what layers the `ubuntu` image has:

```bash
$> docker inspect ubuntu
...
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:fccbfa2912f0cd6b9d13f91f288f112a2b825f3f758a4443aacb45bfc108cc74",
                "sha256:e1a9a6284d0d24d8194ac84b372619e75cd35a46866b74925b7274c7056561e4",
                "sha256:ac7299292f8b2f710d3b911c6a4e02ae8f06792e39822e097f9c4e9c2672b32d",
                "sha256:a5e66470b2812e91798db36eb103c1f1e135bbe167e4b2ad5ba425b8db98ee8d",
                "sha256:a8de0e025d94b33db3542e1e8ce58829144b30c6cd1fff057eec55b1491933c3"
            ]
        }
...
```

Each layer is identified by a hash based on previous layer's hash and the state when the layer was
created. This is similar to commit hashes in a Git repository.

Let's check the layers of our first `fortune-clock:1.0` image:

```bash
$> docker inspect fortune-clock:1.0
...
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:fccbfa2912f0cd6b9d13f91f288f112a2b825f3f758a4443aacb45bfc108cc74",
                "sha256:e1a9a6284d0d24d8194ac84b372619e75cd35a46866b74925b7274c7056561e4",
                "sha256:ac7299292f8b2f710d3b911c6a4e02ae8f06792e39822e097f9c4e9c2672b32d",
                "sha256:a5e66470b2812e91798db36eb103c1f1e135bbe167e4b2ad5ba425b8db98ee8d",
                "sha256:a8de0e025d94b33db3542e1e8ce58829144b30c6cd1fff057eec55b1491933c3",
                "sha256:3539c048e45e973cf477148af3c9c91885950e77d10e77e1db1097bd20b16129"
            ]
        },
...
```

Note that the layers are the same as the `ubuntu` image, with an additional one at the end (starting
with `3539c048e`). This additional layer contains the changes we made compared to the original
`ubuntu` image, i.e.:

* Update the package lists with `apt-get update`
* Install the `fortune` package with `apt-get install`
* Create the `/usr/local/bin/clock.sh` script

The new hash (starting with `3539c048e`) is based both on these changes and the previous hash
(starting with `a8de0e025`), and it **uniquely identifies this layer**.

Take a look at the layers of our second `fortune-clock:2.0` image:

```bash
$> docker inspect fortune-clock:2.0
...
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:fccbfa2912f0cd6b9d13f91f288f112a2b825f3f758a4443aacb45bfc108cc74",
                "sha256:e1a9a6284d0d24d8194ac84b372619e75cd35a46866b74925b7274c7056561e4",
                "sha256:ac7299292f8b2f710d3b911c6a4e02ae8f06792e39822e097f9c4e9c2672b32d",
                "sha256:a5e66470b2812e91798db36eb103c1f1e135bbe167e4b2ad5ba425b8db98ee8d",
                "sha256:a8de0e025d94b33db3542e1e8ce58829144b30c6cd1fff057eec55b1491933c3",
                "sha256:3539c048e45e973cf477148af3c9c91885950e77d10e77e1db1097bd20b16129",
                "sha256:5dbae8ae43cba9e34980fd6076156503814c916453a5582646a6a34c02c68546"
            ]
        },
...
```

Again, we see the same layers, including the `3539c048e` layer from the `fortune-clock:1.0` image,
and an additional layer (starting with `5dbae8ae4`). This layer contains the following changes we
made based on the `fortune-clock:1.0` image:

* Install the `cowsay` package with `apt-get install`
* Overwrite the `/usr/local/bin/clock.sh` script

#### The top writable layer of containers

When you create a new container, you add a new **writable layer** on top of the image's underlying
layers. All changes made to the running container (i.e. creating, modifying, deleting files) are
written to this thin writable container layer.  When the container is deleted, the writable layer is
also deleted, unless it was committed to an image.

The layers belonging to the image used as a base for your container are never modified–they are
**read-only**. Docker uses a [union file system][union-fs] to make it work: when you write file in
the top writable layer, the previous version(s) of the file in previous layers still exist, but are
"hidden" by the file system; only the most recent version is seen.

![Docker: Sharing Layers](images/sharing-layers.jpg)

Multiple containers can therefore use the same read-only image layers, as they only modify their own
writable top layer.

#### Total image size

What we've just learned about layers has several implications:

* You **cannot delete files from previous layers to reduce total image size**. Assume that an
  image's last layer contains a 1GB file. Creating a new container from that image, deleting that
  file, and saving that state as a new image will not reclaim that gigabyte. The total image size
  will still be the same, as the file is still present in the previous layer.

  This is also similar to a Git repository, where committing a file deletion does not reclaim its
  space from the repository's object database (as the file is still referenced by previous commits
  in the history).
* Since layers are read-only and incrementally built based on previous layers, **the size of common
  layers shared by several images is only taken up once**.

  If you take a look at the output of `docker images`, naively adding the displayed sizes adds up to
  447MB, but that is **not** the size that is actually occupied by these images on your file system.

  ```bash
  $> docker images
  REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
  fortune-clock       2.0                 92bfbc9e4c4c        2 hours ago         205MB
  fortune-clock       1.0                 407daed1a864        2 hours ago         156MB
  ubuntu              latest              c9d990395902        10 days ago         113MB
  hello-world         latest              e38bc07ac18e        11 days ago         1.85kB
  ```

  Let's add the `-s` or `--size` option to `docker ps` to display the size of our containers' file
  systems:

  ```bash
  $> docker ps -as
  CONTAINER ID   IMAGE               COMMAND      CREATED             STATUS                     PORTS   NAMES                    SIZE
  4e367ffdda98   fortune-clock:2.0   "clock.sh"   About an hour ago   Up About an hour                   new-clock                0B (virtual 205MB)
  25c9016ce01f   fortune-clock:1.0   "clock.sh"   About an hour ago   Up About an hour                   old-clock                0B (virtual 156MB)
  4b38e523336c   fortune-clock:1.0   "bash"       2 hours ago         Exited (130) 2 hours ago           peaceful_turing          48.7MB (virtual 205MB)
  f6b9fa680789   ubuntu              "bash"       2 hours ago         Exited (130) 2 hours ago           goofy_shirley            43MB (virtual 156MB)
  ```

  The `SIZE` column shows the size of the top writable container layer, and the total virtual size
  of all the layers (including the top one) in parentheses.  If you look at the virual sizes, you
  can see that:

  * The virtual size of the `goofy_shirley` container is 156MB, which corresponds to the size of the
    `fortune-clock:1.0` image, since we committed that image based on that container's state.
  * Similarly, the virtual size of the `peaceful_turing` container is 205MB, which corresponds to
    the size of the `fortune-clock:2.0` image.
  * The `old-clock` and `new-clock` containers also have the same virtual sizes since they are based
    on the same images.

  Taking a look at the sizes of the top writable container layers, we can see that:

  * The size of the `goofy_shirley` container's top layer is 43MB. This corresponds to the space
    taken up by the package lists, the `fortune` package and its dependencies, and the `clock.sh`
    script.

    The virtual size of 156MB corresponds to the 113MB of the `ubuntu` base image, plus the 43MB of
    the top layer. As we've seen above, this is also the size of the `fortune-clock:1.0` image.
  * The size of the `peaceful_turing` container's top layer is 48.7MB. This corresponds to the space
    taken up by the `cowsay` package and its dependencies, and the new version of the `clock.sh`
    script.

    The virtual size of 205MB corresponds to the 156MB of the `fortune-clock:1.0` base image, plus
    the 48.7MB of the top layer. As we've seen above, this is also the size of the
    `fortune-clock:2.0` image.
  * The size of the `old-clock` and `new-clock` containers' top layers is 0 bytes, since no file was
    modified in these containers. Their virtual size correspond to their base images' size.

  Using all that we've learned, we can determine the total size taken up on your machine's file
  system:

  * The 113MB of the `ubuntu` image's layers, even though they are used by 3 images (the `ubuntu`
    image itself and the `fortune-clock:1.0` and `fortune-clock:2.0` images), are taken up only
    once.
  * Similarly, the 43MB of the `fortune-clock:1.0` image's additional layer are taken up only once,
    even though the layer is used by 2 images (the `fortune-clock:1.0` image itself and the
    `fortune-clock:2.0` image).
  * Finally, the 48.7MB of the `fortune-clock:2.0` image's additional layer are also taken up once.

  Therefore, the `ubuntu`, `fortune-clock:1.0` and `fortune-clock:2.0` images take up only 205MB of
  space on your file system, not 447MB. Basically, it's the same size as the `fortune-clock:2.0`
  image, since it re-uses the `fortune-clock:1.0` and `ubuntu` images' layers, and the
  `fortune-clock:1.0` image also re-uses the `ubuntu` image's layers.

  The `hello-world` image takes up an additional 1.85kB on your file system, since it has no layers
  in common with any of the other images.



## TODO

* dockerfile
* network
* docker compose
* docker swarm



## References

* [What is Docker?][what-is-docker]
* [What is a Container?][what-is-a-container]



[bash]: https://en.wikipedia.org/wiki/Bash_(Unix_shell)
[docker-ce]: https://www.docker.com/community-edition
[docker-security]: https://docs.docker.com/engine/security/security/
[docker-storage-drivers]: https://docs.docker.com/storage/storagedriver/
[fortune]: https://en.wikipedia.org/wiki/Fortune_(Unix)
[git-bash]: https://git-scm.com/downloads
[hub]: https://hub.docker.com
[hub-ubuntu]: https://hub.docker.com/_/ubuntu/
[lxc]: https://linuxcontainers.org
[union-fs]: https://en.wikipedia.org/wiki/UnionFS
[what-is-a-container]: https://www.docker.com/what-container
[what-is-docker]: https://www.docker.com/what-docker
[wsl]: https://docs.microsoft.com/en-us/windows/wsl/install-win10
