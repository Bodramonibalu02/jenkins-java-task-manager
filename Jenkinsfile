pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'PUSH_IMAGE',
            defaultValue: false,
            description: 'Push the built image to Docker Hub'
        )
        string(
            name: 'DOCKERHUB_REPO',
            defaultValue: 'balubodramoni/jenkins-task-manager',
            description: 'Docker Hub repository (username/repository)'
        )
    }

    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test and Package') {
            steps {
                echo 'Docker build stage runs Maven tests and packages the Java application.'
                sh 'docker build --target build -t jtm-build:${BUILD_NUMBER} backend'
            }
        }

        stage('Build Runtime Image') {
            steps {
                sh 'docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} backend'
                sh 'docker tag ${DOCKERHUB_REPO}:${IMAGE_TAG} ${DOCKERHUB_REPO}:latest'
            }
        }

        stage('Push to Docker Hub') {
            when {
                expression { return params.PUSH_IMAGE }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DOCKERHUB_CREDENTIALS',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh 'echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin'
                    sh 'docker push ${DOCKERHUB_REPO}:${IMAGE_TAG}'
                    sh 'docker push ${DOCKERHUB_REPO}:latest'
                    sh 'docker logout'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Review the stage logs above.'
        }
        always {
            echo 'Jenkins pipeline finished.'
        }
    }
}
