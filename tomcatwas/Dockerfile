# Builder 단계
FROM ubuntu:20.04 AS builder

# 필수 패키지 설치 (openjdk8, curl, dpkg)
RUN apt-get update && apt-get install -y openjdk-8-jre curl dpkg

# Tomcat 다운로드
RUN curl -f -O https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.89/bin/apache-tomcat-9.0.89.tar.gz

# Tomcat 압축 해제
RUN mkdir -p /usr/local/tomcat && \
    tar -xzf apache-tomcat-9.0.89.tar.gz -C /usr/local/tomcat --strip-components=1

# MySQL Connector/J .deb 패키지 다운로드
RUN curl -f -O https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java_8.0.29-1ubuntu20.04_all.deb

# .deb 파일 설치
RUN dpkg -i mysql-connector-java_8.0.29-1ubuntu20.04_all.deb || apt-get install -f

# 불필요한 파일 제거
RUN rm -f mysql-connector-java_8.0.29-1ubuntu20.04_all.deb

# 불필요한 Tomcat 예제 파일들 제거
RUN rm -rf /usr/local/tomcat/webapps/examples /usr/local/tomcat/webapps/docs /usr/local/tomcat/webapps/manager /usr/local/tomcat/webapps/host-manager

# 필요한 권한 설정
RUN chmod +x /usr/local/tomcat/bin/*.sh

# 파일 복사 (빌드 컨텍스트 내 경로 사용)
COPY ./post/server.js /usr/local/tomcat/webapps/ROOT/
COPY ./webapps/ROOT/ /usr/local/tomcat/webapps/ROOT/


# Tomcat의 context.xml 파일을 MySQL 연결 설정이 포함된 파일로 대체
COPY context.xml /usr/local/tomcat/conf/

# 최종 단계: 실제 컨테이너에 필요한 구성만 복사
FROM ubuntu:20.04

RUN apt-get update && apt-get install -y openjdk-8-jre && \
    rm -rf /var/cache/apt/*

# JAVA_HOME 및 CATALINA_HOME 환경 변수 설정
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV CATALINA_HOME=/usr/local/tomcat
ENV PATH="$JAVA_HOME/bin:$CATALINA_HOME/bin:$PATH"


# 빌더 단계에서 준비한 Tomcat과 필요한 파일을 복사
COPY --from=builder /usr/local/tomcat /usr/local/tomcat

# Tomcat 포트 노출
EXPOSE 8080

# Tomcat 서버 실행
CMD ["catalina.sh", "run"]

