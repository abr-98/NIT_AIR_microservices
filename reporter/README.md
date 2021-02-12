# This docker image is for Reporter Service.

............Steps to build and run this docker container..................
## Power-shell should be in this directory

1. Build the image
    + docker build -f Dockerfile -t reporter . 

    # {this will build the image according to the "Dockerfile" in here and name the image "reporter" & the "." is important}

2. Create the image
    + docker create --name=reporter reporter 
      # for deployment no port is forwarded

    + while deploying add a aurgument --restart=always to make the container restart itself after a reboot

    # {this will run docker image "reporter",also name the running container as "reporter" and do not expose any port to its local network & we need to just let this container run to get daily device availablity reports send to admins.

3. Connect to Internal Software Network (network name: mynetwork)
    + docker network connect --alias=reporter mynetwork reporter

    # {this will connect the container to the internal soft-network with hostname= "reporter" so It can send mailing requests to the mail container and get data from mongo container in the same network}

4. Run the image
    + docker start reporter

    # {run the container ....after it connect to the network....}