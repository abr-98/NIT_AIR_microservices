# This docker image is for Route Service.

............Steps to build and run this docker container..................
## Power-shell should be in this directory

1. Build the image
    + docker build -f Dockerfile -t route . 

    # {this will build the image according to the "Dockerfile" in here and name the image "route" & the "." is important}

2. Create the image
    + docker create --name=route -p 5000:5000 route 
      # for testing port is forwarded
    + while deploying add a aurgument --restart=always to make the container restart itself after a reboot

    # {this will run docker image "route",also name the running container as "route" and do expose port 5000 to its local network & we need to connect to docker network later and this is to be called from other containers for route-recomm requests.

3. Connect to Internal Software Network (network name: mynetwork)
    + docker network connect --alias=route mynetwork route

    # {this will connect the container to the internal soft-network with hostname= "route" so we can send route-recommendation requests to the container from other containers in the same network}

4. Run the image
    + docker start route

    # {run the container ....after it connect to the network....}