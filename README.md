# RecipesGo – Web Project

RecipesGo is a collaborative DevOps project focused on building, testing, and deploying a full-stack web application using modern DevOps practices.  


---

##  Team Members
| Name | Role | GitHub Username |
|------|------|----------------|
| **Adam Ali** | DevOps Engineer / Project Lead | [2alia](https://github.com/2alia) |
| **David** | DevOps Engineer| [dayv-exe](https://github.com/dayv-exe) |
| **Dafe** | DevOps Engineer| [Beastly12](https://github.com/Beastly12) |
| **Daniel** |  DevOps Engineer| [danielsauuce](https://github.com/danielsauuce) |
| **Zhihan** | DevOps Engineer| [2LIUZ98](https://github.com/2LIUZ98) |

---

##  Project Overview
RecipesGo is a recipe-sharing platform where users can view, add, and manage recipes.  
While the app itself is simple, the focus of this project is on **DevOps pipeline design**, **team collaboration**, and **deployment automation**.

---

##  Tech Stack

### **Frontend**
- React (Vite)
- Tailwind CSS
- Node.js
- Deployed on **AWS S3 + CloudFront**

### **Backend**
- Go (Golang)
- AWS Lambda + API Gateway
- Deployed using **AWS SAM**
- RESTful API structure

### **Database**
- AWS DynamoDB

### **DevOps & Tools**
- **GitHub Actions** – CI/CD automation  
- **Docker** – containerised builds  
- **AWS SAM CLI** – serverless deployment  
- **AWS CloudWatch** – logs and metrics  
- **GitHub Projects** – Kanban & sprint management  

---

##  CI/CD Workflow

### **Trigger Conditions**
- **Pull Requests:** Run unit tests for backend and frontend  
- **Push to `develop`:** Deploys to the **test** environment  
- **Push to `main`:** Deploys to the **production** environment  

### **Pipeline Stages**
1. **Build:**  
   - Backend binaries compiled in Docker  
   - Frontend built with Node (Vite)
2. **Test:**  
   - Unit tests run for Go backend modules  
   - Linting and component checks for React frontend
3. **Deploy:**  
   - Backend deployed via AWS SAM  
   - Frontend synced to S3 and distributed via CloudFront

---

##  Example Workflow File

```yaml
name: RecipesGo CI/CD

on:
  push:
    branches: [develop, main]
  pull_request:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Build backend
        run: go build ./backend

      - name: Run backend tests
        run: go test ./backend/... -v

      - name: Build frontend
        run: |
          cd frontend
          npm install
          npm run build

      - name: Deploy with AWS SAM
        run: |
          sam deploy \
            --template-file template.yaml \
            --stack-name recipego-stack \
            --region eu-west-2 \
            --capabilities CAPABILITY_IAM


