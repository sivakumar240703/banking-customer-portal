pipeline {

    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        APP_NAME = "customer-portal"
        GIT_URL = "https://github.com/sivakumar240703/banking-customer-portal.git"
        GIT_BRANCH = "main"
        GIT_CREDENTIALS = "banking-github-credentials"
        CONTAINER_NAME = "customer-portal-${BUILD_NUMBER}"
        IMAGE_NAME = "customer-portal:build-${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from Git...'

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${GIT_BRANCH}"]],
                    userRemoteConfigs: [[
                        url: "${GIT_URL}",
                        credentialsId: "${GIT_CREDENTIALS}"
                    ]]
                ])
            }
        }

        stage('Build') {
            steps {
                echo 'Installing application dependencies...'

                bat 'npm ci'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'

                bat 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}"

                bat "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Container Verification') {
            steps {
                echo 'Starting temporary container...'

                script {
                    env.HOST_PORT = (3100 + env.BUILD_NUMBER.toInteger()).toString()
                }

                bat "docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:3000 ${IMAGE_NAME}"

                bat 'timeout /t 5 /nobreak'

                echo 'Checking application health endpoint...'

                bat "curl.exe -f http://localhost:${HOST_PORT}/health"
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Removing temporary container...'

                bat "docker rm -f ${CONTAINER_NAME} 2>nul || exit /b 0"
            }
        }
    }

    post {
        always {
            echo 'Final cleanup check...'

            bat "docker rm -f ${CONTAINER_NAME} 2>nul || exit /b 0"
        }
    }
}