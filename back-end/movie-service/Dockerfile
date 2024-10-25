# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Add the jar file to the container
COPY target/movie-service-0.0.1-SNAPSHOT.jar movie-service.jar

# Expose the port the app runs on
EXPOSE 8272

# Run the jar file
ENTRYPOINT ["java", "-jar", "movie-service.jar"]