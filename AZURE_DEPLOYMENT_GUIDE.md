# Azure Deployment Guide for ASP.NET Core Backend & MySQL

## Step-by-Step Instructions

### 1. Prepare Azure Resources

#### a. Create Azure App Service (Windows)
- Go to Azure Portal > App Services > Create.
- Select Windows as the OS, choose a region, and select a plan (use your credits).
- Set up deployment (GitHub Actions recommended).

#### b. Create Azure Database for MySQL
- Go to Azure Portal > Azure Database for MySQL > Create.
- Choose Flexible Server, select region, and configure admin credentials.
- Set firewall rules to allow access from App Service.

#### c. (Optional) Create Azure Key Vault
- Store database credentials and other secrets securely.

### 2. Update Backend API Configuration
- Change connection string in `appsettings.json` or environment variables to use Azure MySQL endpoint.
- Use Key Vault references in App Service configuration for secrets.

### 3. Automate Deployment (CI/CD)
- Use GitHub Actions or Azure DevOps:
  - Build and publish your ASP.NET Core project.
  - Deploy to Azure App Service using the `azure/webapps-deploy` GitHub Action.
  - Example workflow:
    ```yaml
    name: Deploy ASP.NET Core to Azure Web App
    on:
      push:
        branches:
          - main
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v3
        - name: Setup .NET
          uses: actions/setup-dotnet@v3
          with:
            dotnet-version: '8.0.x'
        - name: Build
          run: dotnet build --configuration Release
        - name: Publish
          run: dotnet publish -c Release -o ./publish
        - name: Deploy to Azure WebApp
          uses: azure/webapps-deploy@v2
          with:
            app-name: <your-app-service-name>
            publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE }}
            package: ./publish
    ```
- Store your Azure publish profile in GitHub Secrets.

### 4. Migrate Data (if needed)
- Use Azure Database Migration Service or export/import tools to move existing data to Azure MySQL.

### 5. Test & Monitor
- Access your deployed API endpoint.
- Use Azure Monitor and Application Insights for health and performance.

## Additional Tips
- Scale App Service and MySQL as needed using your credits.
- Set up alerts for downtime or performance issues.
- Review Azure cost management to track credit usage.

---

## References
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Database for MySQL Documentation](https://docs.microsoft.com/en-us/azure/mysql/)
- [GitHub Actions for Azure](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions)

---

## Automation Scripts
- Use the provided GitHub Actions workflow for automated deployment.
- For database migration, use Azure Portal or CLI tools as needed.

---

## Contact
For support, contact your Azure admin or development team.
