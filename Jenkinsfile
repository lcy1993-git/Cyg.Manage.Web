pipeline{
  agent any 
  parameters {
      choice(
      description: 'dev1:开发环境1 \n dev2:开发环境2 \n dev3:生产环境',
      name: 'environment',
      choices: ['dev1', 'dev2', 'dev3']
    )

    choice(
        description: '执行操作(发布|回滚)',
        name: 'operation', 
        choices: ['develop', 'rollback']
    )

    choice(
        description: '分支名',
        name: 'branchName', 
        choices: ['master']
    )

    string(
        name: 'tag', 
        defaultValue: '', 
        description: '版本tag'
    )

  }

    stages
    {
    stage('Prepare') {
         steps {  
           script{
                echo "1.Prepare Stage"
	    	        echo "当前环境${params.environment}"
	            	if(params.operation=='develop')
	              	{
	              	 checkout scm
                   script {
                             build_tag = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                              if (env.BRANCH_NAME != 'master') {
                              build_tag = "${env.BRANCH_NAME}-${build_tag}"
                              }
                         }
              		}
	            	else{
                   build_tag="${params.tag}"
		                }
                }
           }
    }
    stage('Test') {
                  steps {  
                     script{
                        echo "2.Test Stage"
                      }
                    }
     
    }
    stage('Build') {
                    steps { 
                      script{
                        echo "3.Build Docker Image Stage"
                      	if(params.operation=='develop')
	                      	{
                              nodejs("nodejs") {
                                
                              }
							                sh "npm install --unsafe-perm=true --allow-root" 
                              sh "rm -rf ./dist/*"
                              sh "npm run build"                            
	                      	    sh "docker build -t 10.6.1.45:10242/cyg/manageweb:${build_tag} ."
                      		}      
                        }
                      }
                    }
        
	
    stage('Push') {
                    steps { 
                      script{
                       echo "4.Push Docker Image Stage"
                          withCredentials([usernamePassword(credentialsId: 'harbor', passwordVariable: 'harborPassword', usernameVariable: 'harborUser')]) {
                           sh "docker login -u ${harborUser} -p ${harborPassword} 10.6.1.45:10242"
	                        	if(params.operation=='develop')
	                          	{ 
                                 sh "docker push 10.6.1.45:10242/cyg/manageweb:${build_tag}"
                              }
	                      	}
                        }
                      }

        
		
      
    }
    stage('Deploy') {

                    steps { 
                      script{
                         echo "5. Deploy Stage"
                          if(params.environment=='test')
	                        	{
		                           input "确认要部署线上环境吗？"
                          	} 
                            sh "sed -i 's/<BUILD_TAG>/${build_tag}/' k8s_manageweb.yaml"
                            sh "sed -i 's/<BRANCH_NAME>/${env.BRANCH_NAME}/' k8s_manageweb.yaml"
                            sh "sed -i 's/<NAMESPACES>/${params.environment}/' k8s_manageweb.yaml"
                            sh "kubectl apply -f k8s_manageweb.yaml --record"
                        }
                      }
    }
  }
}