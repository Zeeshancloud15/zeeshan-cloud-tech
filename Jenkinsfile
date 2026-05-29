pipeline {

    agent any

    environment {

        DOCKER_HUB_USER = 'zeeshancloud15'

        BUILD_NUMBER_TAG = "${BUILD_NUMBER}"

        FRONTEND_IMAGE = "zeeshancloud15/frontend:${BUILD_NUMBER_TAG}"

        USER_IMAGE = "zeeshancloud15/user-service:${BUILD_NUMBER_TAG}"

        SUPPORT_IMAGE = "zeeshancloud15/support-service:${BUILD_NUMBER_TAG}"

        AI_IMAGE = "zeeshancloud15/ai-service:${BUILD_NUMBER_TAG}"

        K8S_SERVER = 'ubuntu@13.51.250.216'
    }

    stages {

        stage('Checkout Code') {

            steps {

                git branch: 'main',
                url: 'https://github.com/Zeeshancloud15/zeeshan-cloud-tech.git'
            }
        }

        stage('Install Node Modules') {

            steps {

                sh '''
                    cd user-service && npm install

                    cd ../support-service && npm install

                    cd ../ai-service && npm install
                '''
            }
        }

        stage('Docker Build') {

            steps {

                sh '''
                    docker build -t ${FRONTEND_IMAGE} ./frontend

                    docker build -t ${USER_IMAGE} ./user-service

                    docker build -t ${SUPPORT_IMAGE} ./support-service

                    docker build -t ${AI_IMAGE} ./ai-service
                '''
            }
        }

        stage('Docker Login & Push') {

            steps {

                withCredentials([

                    usernamePassword(

                        credentialsId: 'dockerhub-cred',

                        usernameVariable: 'DOCKER_USER',

                        passwordVariable: 'DOCKER_PASS'
                    )

                ]) {

                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                        docker push ${FRONTEND_IMAGE}

                        docker push ${USER_IMAGE}

                        docker push ${SUPPORT_IMAGE}

                        docker push ${AI_IMAGE}
                    '''
                }
            }
        }

        stage('Update Kubernetes YAML') {

            steps {

                sh """

                    sed -i 's|image:.*frontend.*|image: ${FRONTEND_IMAGE}|g' k8s/frontend-deployment.yaml

                    sed -i 's|image:.*user-service.*|image: ${USER_IMAGE}|g' k8s/user-deployment.yaml

                    sed -i 's|image:.*support-service.*|image: ${SUPPORT_IMAGE}|g' k8s/support-deployment.yaml

                    sed -i 's|image:.*ai-service.*|image: ${AI_IMAGE}|g' k8s/ai-deployment.yaml
                """
            }
        }

        stage('Deploy Ingress Controller') {

            steps {

                sshagent(['k8s-ssh1']) {

                    sh """

                    ssh -o StrictHostKeyChecking=no ${K8S_SERVER} '

                    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

                    kubectl patch svc ingress-nginx-controller -n ingress-nginx -p "{\"spec\":{\"type\":\"NodePort\"}}"

                    '
                    """
                }
            }
        }

        stage('Deploy To Kubernetes') {

            steps {

                sshagent(['k8s-ssh1']) {

                    sh """

                    scp -o StrictHostKeyChecking=no k8s/* ${K8S_SERVER}:~/

                    ssh -o StrictHostKeyChecking=no ${K8S_SERVER} '

                    kubectl apply -f frontend-deployment.yaml

                    kubectl apply -f frontend-service.yaml

                    kubectl apply -f user-deployment.yaml

                    kubectl apply -f user-service.yaml

                    kubectl apply -f support-deployment.yaml

                    kubectl apply -f support-service.yaml

                    kubectl apply -f ai-deployment.yaml

                    kubectl apply -f ai-service.yaml

                    kubectl apply -f ingress.yaml

                    kubectl rollout status deployment/frontend

                    kubectl rollout status deployment/user

                    kubectl rollout status deployment/support

                    kubectl rollout status deployment/ai
                    '
                    """
                }
            }
        }

        stage('Verify Website') {

            steps {

                sh '''
                    curl http://zeeshan.agency:32234
                '''
            }
        }
    }

    post {

        success {

            echo 'SUCCESS'
        }

        failure {

            echo 'FAILED'
        }
    }
}
