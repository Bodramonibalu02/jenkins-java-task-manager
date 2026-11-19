# Stage 1: compile the Java app and run its automated tests.
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B test package

# Stage 2: copy only the runnable JAR into a smaller Java runtime image.
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/taskmanager.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
