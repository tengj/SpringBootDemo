FROM openjdk:8-jdk-alpine
MAINTAINER tengj <me@bingohuang.com>
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]