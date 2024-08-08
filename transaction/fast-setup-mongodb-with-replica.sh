# Description: This script is used to setup the replica set for mongo cluster
# Environments:
MONGDB_INIT_ROOT_USERNAME=mongoadmin
MONGDB_INIT_ROOT_PASSWORD=yeah-this-is-a-fu-secret-But-U-W0nT-Kn@w

# Check if the network created on docker
if docker network ls | grep -q mongo-cluster; then
    echo -e "\e[33mNetwork mongo-cluster already exists\e[0m"
else
    docker network create mongo-cluster
fi

# We will create 3 mongo instances, named mongoA, mongoB, mongoC
# Check if the container already exists, if true, notify the user and remove the container to create a new one
if docker ps -a | grep -q mongoA; then
    echo -e "\e[31mContainer mongoA already exists, removing the container\e[0m"
    docker rm -f mongoA
fi

if docker ps -a | grep -q mongoB; then
    echo -e "\e[31mContainer mongoB already exists, removing the container\e[0m"
    docker rm -f mongoB
fi

if docker ps -a | grep -q mongoC; then
    echo -e "\e[31mContainer mongoC already exists, removing the container\e[0m"
    docker rm -f mongoC
fi

# Set volume to persist the data
echo -e "\e[33mCreating mongoA, mongoB, mongoC\e[0m"
# Keyfile: -v ./keyfiles/keyfile:/data/keyfile
# Generate keyfile: openssl rand -base64 741 > ./keyfiles/keyfile
# After generate keyfile, should run: chmod 400 ./keyfiles/keyfile and chown 999:999 ./keyfiles/keyfile
docker run -d --name mongoA --network mongo-cluster --hostname mongoA -v mongoA-data:/data/db -v ./keyfiles/keyfile:/data/keyfile -p 37017:27017 -e MONGO_INITDB_ROOT_USERNAME=$MONGDB_INIT_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGDB_INIT_ROOT_PASSWORD mongo mongod --auth --replSet rs0 --keyFile /data/keyfile
docker run -d --name mongoB --network mongo-cluster --hostname mongoB -v mongoB-data:/data/db -v ./keyfiles/keyfile:/data/keyfile -p 37018:27017 -e MONGO_INITDB_ROOT_USERNAME=$MONGDB_INIT_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGDB_INIT_ROOT_PASSWORD mongo mongod --auth --replSet rs0 --keyFile /data/keyfile
docker run -d --name mongoC --network mongo-cluster --hostname mongoC -v mongoC-data:/data/db -v ./keyfiles/keyfile:/data/keyfile -p 37019:27017 -e MONGO_INITDB_ROOT_USERNAME=$MONGDB_INIT_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGDB_INIT_ROOT_PASSWORD mongo mongod --auth --replSet rs0 --keyFile /data/keyfile

echo -e "\e[32mWait 3s to container complete started\e[0m"
for i in {3..1}; do
    printf "  %s\r" "$i"
    sleep 1
done

# Initiate replica set
echo -e "\e[32mInitiating replica set\e[0m"
# use mongosh with username and password
docker exec -it mongoA mongosh -u $MONGDB_INIT_ROOT_USERNAME -p $MONGDB_INIT_ROOT_PASSWORD --eval "rs.initiate({
    _id: 'rs0',
    members: [
        { _id: 0, host: '27.71.232.11:37017' },
        { _id: 1, host: '27.71.232.11:37018' },
        { _id: 2, host: '27.71.232.11:37019' }
    ]
})"

# Check replica set status
echo -e "\e[32mChecking replica set status\e[0m"
docker exec -it mongoA mongosh -u $MONGDB_INIT_ROOT_USERNAME -p $MONGDB_INIT_ROOT_PASSWORD --eval "rs.status()"