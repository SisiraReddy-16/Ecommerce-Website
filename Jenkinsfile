pipeline {
    agent any

    tools {
        jdk 'Java17'
        maven 'Maven-3.9.16'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SisiraReddy-16/Ecommerce-Website.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('ecommerce-backend') {
                    sh 'java -version'
                    sh 'mvn -version'
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
    }
}
