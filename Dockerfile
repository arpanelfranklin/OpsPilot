FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /backend
COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests
#-- stage 2 --
FROM eclipse-temurin:17-jre

WORKDIR /backend

COPY --from=builder /backend/target/*jar backend.jar

EXPOSE 8080

# allowing non root user
#un comment when using k8s non root security context
#RUN groupadd -r appgroup && \
#    useradd -r -g appgroup appuser \
#
#USER appuser

ENTRYPOINT  ["java", "-jar", "backend.jar"]
