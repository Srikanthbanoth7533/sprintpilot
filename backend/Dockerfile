# ==========================================
# SprintPilot Backend Multi-stage Dockerfile
# ==========================================

# Stage 1: Build JAR with Maven Wrapper
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy Maven Wrapper and POM file first to leverage Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
# Download dependencies offline
RUN ./mvnw dependency:go-offline -B

# Copy source code and package application
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal Production Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Run as non-root user for enterprise security
RUN groupadd -r sprintpilot && useradd -r -g sprintpilot sprintpilot

COPY --from=build /app/target/*.jar app.jar
RUN chown sprintpilot:sprintpilot app.jar

USER sprintpilot

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
