# Use an official Maven image to build the project
FROM maven:3.8.6-openjdk-8 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy the rest of the project files and build the application
COPY src ./src
RUN mvn package -DskipTests

# Use an OpenJDK image to run the application
FROM openjdk:8-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/project-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the port on which the app will run
EXPOSE 8080

# Command to run the JAR file
ENTRYPOINT ["java", "-jar", "/app/app.jar"]