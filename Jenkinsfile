pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'rama058'
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/backend-gestion-employe"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/frontend-gestion-employe"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Tests Backend') {
            steps {
                dir('backend-gestion-employe') {
                    sh '''
                        python3 -m venv .venv
                        . .venv/bin/activate
                        pip install -r requirements.txt
                        python -m pytest
                    '''
                }
            }
        }

        stage('Tests Frontend') {
            steps {
                dir('frontend-gestion-employe') {
                    sh '''
                        npm install
                        CI=true npm test
                    '''
                }
            }
        }

        stage('Analyse qualite (SonarQube)') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm --volumes-from jenkins -w "$WORKSPACE" \
                          -e SONAR_HOST_URL=http://host.docker.internal:9000 \
                          -e SONAR_TOKEN=$SONAR_TOKEN \
                          sonarsource/sonar-scanner-cli:latest \
                          -Dsonar.projectKey=gestion-employe \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=**/node_modules/**,**/.venv/**,**/venv/**
                    '''
                }
            }
        }

        stage('Build des images') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE:latest ./backend-gestion-employe'
                sh 'docker build -t $FRONTEND_IMAGE:latest ./frontend-gestion-employe'
            }
        }

        stage('Scan securite (Trivy)') {
            steps {
                sh '''
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --severity HIGH,CRITICAL --exit-code 0 \
                      $BACKEND_IMAGE:latest

                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --severity HIGH,CRITICAL --exit-code 0 \
                      $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                  usernameVariable: 'HUB_USER',
                                                  passwordVariable: 'HUB_PASS')]) {
                    sh '''
                        echo "$HUB_PASS" | docker login -u "$HUB_USER" --password-stdin
                        docker push $BACKEND_IMAGE:latest
                        docker push $FRONTEND_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploiement') {
            steps {
                sh '''
                    docker compose down || true
                    docker compose pull
                    docker compose up -d --no-build
                '''
            }
        }
    }
}