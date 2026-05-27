pipeline {

    agent any

    environment {

        DOCKER_HUB_USER = 'zeeshancloud15'

        BUILD_NUMBER_TAG = "${BUILD_NUMBER}"

        FRONTEND_IMAGE = "zeeshancloud15/frontend:${BUILD_NUMBER_TAG}"

        USER_IMAGE = "zeeshancloud15/user-service:${BUILD_NUMBER_TAG}"

        SUPPORT_IMAGE = "zeeshancloud15/support-service:${BUILD_NUMBER_TAG}"

        AI_IMAGE = "zeeshancloud15/ai-service:${BUILD_NUMBER_TAG}"

        K8S_SERVER = 'ubuntu@13.50.106.43'

        S3_BUCKET = 'zeeshanagency'
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

        stage('Upload Backup To S3') {

            steps {

                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',

                    credentialsId: 'aws-id',

                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',

                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {

                    sh '''
                        aws s3 cp frontend/ s3://${S3_BUCKET}/frontend/ --recursive

                        aws s3 cp user-service/ s3://${S3_BUCKET}/user-service/ --recursive

                        aws s3 cp support-service/ s3://${S3_BUCKET}/support-service/ --recursive

                        aws s3 cp ai-service/ s3://${S3_BUCKET}/ai-service/ --recursive

                        aws s3 cp k8s/ s3://${S3_BUCKET}/k8s/ --recursive
                    '''
                }
            }
        }

        stage('Update Kubernetes YAML Files') {

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
                        scp -o StrictHostKeyChecking=no ingress/ingress-controller.yaml ${K8S_SERVER}:~/

                        ssh -o StrictHostKeyChecking=no ${K8S_SERVER} '

                        kubectl apply -f ingress-controller.yaml

                        kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
                        '
                    """
                }
            }
        }

        stage('Deploy To Kubernetes') {

            steps {

                sshagent(['k8s-ssh1']) {

                    sh """
                        scp -o StrictHostKeyChecking=no k8s/frontend-deployment.yaml ${K8S_SERVER}:~/

                        scp -o StrictHostKeyChecking=no k8s/frontend-service.yaml ${K8S_SERVER}:~/

                        scp -o StrictHostKeyChecking=no k8s/user-deployment.yaml ${K8S_SERVER}:~/

                        scp -o StrictHostKeyChecking=no k8s/user-service.yaml ${K8S_SERVER}:~/

                        scp -o StrictHostKeyChecking=no k8s/support-deployment.yaml ${K8S_SERVER}:~/

                        scp -o StrictHostKeyChecking=no k8s/support-service.yaml ${K8S_SERVER}:~/

                        scp -o StrictHostKeyChecking=no k8s/ai-deployment.yaml ${K8S_SERVER}:~/

                        scp -o StrictHostKeyChecking=no k8s/ai-service.yaml ${K8S_SERVER}:~/

                        scp -o StrictHostKeyChecking=no k8s/ingress.yaml ${K8S_SERVER}:~/

                        ssh -o StrictHostKeyChecking=no ${K8S_SERVER} '

                        kubectl apply -f frontend-deployment.yaml &&

                        kubectl apply -f frontend-service.yaml &&

                        kubectl apply -f user-deployment.yaml &&

                        kubectl apply -f user-service.yaml &&

                        kubectl apply -f support-deployment.yaml &&

                        kubectl apply -f support-service.yaml &&

                        kubectl apply -f ai-deployment.yaml &&

                        kubectl apply -f ai-service.yaml &&

                        kubectl apply -f ingress.yaml &&

                        kubectl rollout status deployment/frontend &&

                        kubectl rollout status deployment/user-service &&

                        kubectl rollout status deployment/support-service &&

                        kubectl rollout status deployment/ai-service
                        '
                    """
                }
            }
        }

        stage('Monitoring Verification') {

            steps {

                sshagent(['k8s-ssh1']) {

                    sh """
                        ssh -o StrictHostKeyChecking=no ${K8S_SERVER} '

                        echo "===== NODES ====="

                        kubectl get nodes

                        echo "===== PODS ====="

                        kubectl get pods -o wide

                        echo "===== DEPLOYMENTS ====="

                        kubectl get deployments

                        echo "===== SERVICES ====="

                        kubectl get svc

                        echo "===== INGRESS ====="

                        kubectl get ingress
                        '
                    """
                }
            }
        }

        stage('Verify Website') {

            steps {

                sh '''
                    curl http://zeeshan.agency
                '''
            }
        }
    }

    post {

        success {

            echo 'SUCCESS 🚀 Full Microservices CI/CD + Docker + S3 + Kubernetes + Ingress Completed'
        }

        failure {

            echo 'FAILED ❌ Check Jenkins Logs'
        }

        always {

            cleanWs()
        }
    }
}
