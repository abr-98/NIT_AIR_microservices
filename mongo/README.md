# This is the Docker image for MongoDB setup

............Steps to build and run this docker container..................
## Power-shell should be in this directory

1. Build the image
    + docker build -f Dockerfile -t mongo . 

    # {this will build the image according to the "Dockerfile" in here and name the image "mongo" & the "." is important}

2. Run the image
    + docker run --name=mongo -d -p 27017:27017 -v ${pwd}/mydata:/data/db mongo
    + while deploying add a aurgument --restart=always to make the container restart itself after a reboot

    # {this will run docker image "mongo",also name the running container as "mongo" and expose port 27017 to localhost for checking in Mongo Compass. It mount the "mydata" directory as the database storage volume for data persistance,So the data remains even if we delete the image and rebuilt it}

3. Connect to Internal Software Network (network name: mynetwork)
    + docker network connect --alias=mongo mynetwork mongo

    # {this will connect the container to the internal soft-network with hostname= "mongo" so we can send R/W requests to the database from other containers in the same network}



4. (ONLY FOR FIRST TIME {IF DATA VOLUME WAS EMPTY})[** FRESH START ONLY **]
    + docker exec -it mongo bash
        - mongo
        - use mydb
        - db.createCollection("data")
        - {exit from the bash terminal}

    # {Go to bash shell of the mongo container and create a mongo database named "mydb" and create a Collection named "data" for initilize the base database}

# DONE
to stop run-- docker stop mongo
to remove container run-- docker rm mongo
to remove image run-- docker image rm mongo