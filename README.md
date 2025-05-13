1. Enable Kubernetes in Docker Desktop

2. Clone the project into your local drive

3. Build and Push Docker Image

        docker build -t disuru0120/calculator-app:v3 . 
        docker push disuru0120/calculator-app:v3 
      

4. Apply all yaml files in Deployment

        kubectl apply -f deployment/

5. Port Forwarding

        kubectl port-forward svc/calculator-service 3040:80

6. Test Application

        http://localhost:30036/add?num1=10&num2=5

7. API End Points
   
GET - /add - Add two numbers
GET - /subtract - Subtract two numbers
GET - /multiply - Multiply two numbers
GET - /divide - Divide two numbers
GET - /history - Show all stored operations
PUT - /calculation/:id - Update result
DELETE - /calculation/:id - Delete a calculation entry


 
