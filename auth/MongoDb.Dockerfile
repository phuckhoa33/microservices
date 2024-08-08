FROM mongo

# Set environment variables
# Root username
ENV MONGO_INITDB_ROOT_USERNAME=admin
# Root password
ENV MONGO_INITDB_ROOT_PASSWORD=PassW0rd@123

# Expose the port: 27017
EXPOSE 27017