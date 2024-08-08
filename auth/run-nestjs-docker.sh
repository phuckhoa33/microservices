# Check if the container is exist
if [ "$(docker ps -a -q -f name=investor-be)" ]; then
    # Check is the container is running
    if [ "$(docker ps -q -f name=investor-be)" ]; then
        echo "Stopping the container..."
        docker stop investor-be
    fi
    
    echo "Removing the container..."
    docker rm investor-be
fi

# Build the image
echo "Building the image..."
docker build -f "NestJs.Stagging.Dockerfile" -t investor-be:latest .

# Run the container
echo "Running the container..."
docker run -d -p 3001:3001 --name investor-be investor-be:latest