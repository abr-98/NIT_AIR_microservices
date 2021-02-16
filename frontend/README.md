# This docker image is for frontend Service.

............Steps to build and run this docker container..................
## Power-shell should be in this directory

1. Build the image
    + docker build -f Dockerfile -t frontend . 

    # {this will build the image according to the "Dockerfile" in here and name the image "frontend" & the "." is important}

2. Create the image
    + docker create --name=frontend -p 3000:3000 frontend 
      # for deployment port is forwarded

    + while deploying add a aurgument --restart=always to make the container restart itself after a reboot

    # {this will run docker image "frontend",also name the running container as "frontend" and do expose port 3000 to its local network & we need to connect to docker network later and this is to be called from other containers for frontend deployment.

3. Connect to Internal Software Network (network name: mynetwork)
    + docker network connect --alias=frontend mynetwork frontend

    # {this will connect the container to the internal soft-network with hostname= "frontend" so we can send frontend requests to the container from other containers in the same network}

4. Run the image
    + docker start frontend

    # {run the container ....after it connect to the network....}