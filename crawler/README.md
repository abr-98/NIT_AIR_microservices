# This docker image is for Crawler Service.

............Steps to build and run this docker container..................
## Power-shell should be in this directory

1. Build the image
    + docker build -f Dockerfile -t crawler . 

    # {this will build the image according to the "Dockerfile" in here and name the image "crawler" & the "." is important}

2. Run the image
    + docker run --name=crawler -d -p 5000:5000 -v ${pwd}:/app  --privileged crawler
    + while deploying add a aurgument --restart=always to make the container restart itself after a reboot

    # {this will run docker image "crawler",also name the running container as "crawler" and do expose port 5000 to localhost & to its local network & we need to connect to docker network later and this is to be called from other containers for crawl requests & database connectivity.

3. Connect to Internal Software Network (network name: mynetwork)
    + docker network connect --alias=crawler mynetwork crawler

    # {this will connect the container to the internal soft-network with hostname= "crawler" so we can send emailing requests to the container from other containers in the same network}