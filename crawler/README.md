# This docker image is for Crawler Service.

............Steps to build and run this docker container..................
## Power-shell should be in this directory

1. Build the image
    + docker build -f Dockerfile -t crawler . 

    # {this will build the image according to the "Dockerfile" in here and name the image "crawler" & the "." is important}

2. Create the image
    + docker create --name=crawler -v ${pwd}:/app  --privileged crawler
      # for testing volume is mounted
    + while deploying add a aurgument --restart=always to make the container restart itself after a reboot

    # {this will run docker image "crawler",also name the running container as "crawler" and do not expose any port to localhost & to its local network its a automatic crawlling service.

3. Connect to Internal Software Network (network name: mynetwork)
    + docker network connect --alias=crawler mynetwork crawler

    # {this will connect the container to the internal soft-network with hostname= "crawler" so it can send emailing requests to "mail" container in the same network and store data in "mongo" container}

4. Run the image
    + docker start crawler

    # {run the container ....after it connect to the network....}