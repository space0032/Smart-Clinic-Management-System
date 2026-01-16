# ==============================================================================
# Smart Clinic Management System - Dockerfile
# Multi-stage build for Spring Boot application
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: BUILD
# This stage compiles the Spring Boot application using Maven
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy Maven wrapper files for dependency caching
# This allows Docker to cache dependencies when pom.xml doesn't change
COPY backend/mvnw ./
COPY backend/.mvn ./.mvn
COPY backend/pom.xml ./

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download all dependencies (this layer will be cached)
# -B flag enables batch mode for less verbose output
RUN ./mvnw dependency:go-offline -B

# Copy the application source code
COPY backend/src ./src

# Build the application JAR file
# -DskipTests skips running tests during the build
RUN ./mvnw package -DskipTests

# ------------------------------------------------------------------------------
# Stage 2: RUNTIME
# This stage creates a minimal image to run the application
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine

# Set the working directory for the runtime container
WORKDIR /app

# Copy the built JAR file from the build stage
# The wildcard (*) matches any JAR file in the target directory
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 for the Spring Boot application
# This documents which port the application uses
EXPOSE 8080

# Set the entry point to run the Spring Boot application
# Using exec form for proper signal handling
ENTRYPOINT ["java", "-jar", "app.jar"]
