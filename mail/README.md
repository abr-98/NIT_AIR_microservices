# This docker image is for Mail Service.

............Steps to build and run this docker container..................
## Power-shell should be in this directory

1. Build the image
    + docker build -f Dockerfile -t mail . 

    # {this will build the image according to the "Dockerfile" in here and name the image "mail" & the "." is important}

2. Run the image
    + docker run --name=mail -d mail
    + while deploying add a aurgument --restart=always to make the container restart itself after a reboot

    # {this will run docker image "mail",also name the running container as "mail" and don expose port 5000 to 1234 at localhost(for Crawler module) and to its local network & we need to connect to docker network later and this is to be called from other containers for mail requests. #No port forwarding in deployment

3. Connect to Internal Software Network (network name: mynetwork)
    + docker network connect --alias=mail mynetwork mail

    # {this will connect the container to the internal soft-network with hostname= "mail" so we can send emailing requests to the container from other containers in the same network}


# Example EMAIL Send Request.
mail:5000/notify?emails=abcdef@gmail.com_ghijk@gmail.com&message=hello this is a test email