# RecipesGo

RecipeGo is a full-stack, social recipe sharing platform built with a modern, serverless architecture. It demonstrates a DevOps pratice and production ready development workflow emphasizing scalability, testing, and automated deployment.

(./assets/homepage figma.png)

# Prerequisites
To develop or run RecipeShare locally, ensure you have:
Node.js ≥ 18, npm ≥ 8, Docker ≥ 20
An AWS account with:
A configured Cognito User Pool
A DynamoDB table
Amplify app configured (optional for local dev)

# RecipesGO link
- https://prepify-nu.vercel.app

## 👥 Collaborators

| Name | Username |
|------|----------------|
| **Adam Ali** | [2alia](https://github.com/2alia) |
| **David A** | [dayv-exe](https://github.com/dayv-exe) |
| **Dafe** | [Beastly12](https://github.com/Beastly12) |
| **Daniel** | [danielsauuce](https://github.com/danielsauuce) |
| **Zhihan** | [2LIUZ98](https://github.com/2LIUZ98) |

---
## 🧱 Technology Stack

| Component      | Tech Stack        |
|----------------|-------------------|
| Frontend       | React             |
| Styling        | Tailwind CSS      |
| Authentication | AWS Cognito       |
| Database       | AWS DynamoDB      |
| Deployment     | Vercel            |
| E2E Testing    | Cypress           |

## 🔑 Authentication

Authentication was handled using **AWS Cognito**, providing secure user sign-up, sign-in, and access control across the application.

## 🛠️ Development Workflow
Our team follows a standard **fork-and-pull-request** workflow to ensure clean collaboration and code quality:

1. **Fork** the repository to your personal GitHub account.  
2. **Create a feature branch** in your fork and commit your changes.  
3. **Push your branch** and open a Pull Request (PR) to the `main` branch of the upstream repository.  
4. Ensure **all merge conflicts are resolved** before requesting a review.  
5. A team member will review and approve the PR before it is merged into `main`.  


# 🧹 Code Linting & Formatting

| Command | Purpose |
|---------|----------|
| `npm run lint` | Checks code and style quality. Runs during development but does not break on errors. |
| `npm run format` | Automatically fixes common linting and formatting issues. |

# 🌑 Dark Mode Support
This project natively supports Dark Mode styling. By default, the application adheres to the user's color preference as set on their operating system or device.
### **DevOps & Tooling**

Our development and deployment pipeline leverages a modern DevOps toolchain to ensure reliability, consistency, and automation across the project:

- **GitHub Actions** – Continuous integration and delivery workflows  
- **Docker** – Containerised development and production environments  
- **AWS SAM CLI** – Infrastructure-as-code and serverless application deployment  
- **AWS CloudWatch** – Centralised logging, monitoring, and metrics  
- **GitHub Projects** – Agile planning, Kanban tracking, and sprint coordination  
- **Cypress** – Automated end-to-end testing for frontend quality assurance

## 📊 Repository Visualization

![Repository Visualization](./assets/repo visualization.png)



