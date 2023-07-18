# Use a base image with Java and Maven pre-installed
FROM maven:3.8.4-openjdk-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file to the container
COPY pom.xml .

# Download the project dependencies
RUN mvn dependency:go-offline -B

# Copy the source code to the container
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Use a new base image with Java only
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from the builder stage to the container
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Set the command to run the application when the container starts
CMD ["java", "-jar", "app.jar"]
