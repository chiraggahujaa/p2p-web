# GitHub Workflows

This directory contains GitHub Actions workflows for automated CI/CD processes.

## Workflows

### `ci-cd.yml` - Main CI/CD Pipeline
**Triggers:**
- Push to any branch (quality checks)
- PRs to main, staging, production
- Manual workflow dispatch

**Jobs:**
1. **Security Scan** - Vulnerability scanning with Trivy
2. **Test & Lint** - TypeScript check, ESLint, unit tests (if configured)
3. **Build & Performance** - Application build and artifact upload
4. **E2E Tests** - End-to-end testing (if Playwright configured)
5. **Deploy Staging** - Auto-deploy when pushing to `staging` branch
6. **Deploy Production** - Auto-deploy when pushing to `production` branch

### `claude-code-review.yml` - Code Review
Automated code review using Claude for pull requests.

## Required Secrets

Add these to your GitHub repository secrets:

```
VERCEL_TOKEN          # Vercel deployment token
ORG_ID               # Vercel organization ID  
PROJECT_ID           # Vercel project ID
TEAM_ID              # Vercel team ID (if using teams)
CLAUDE_CODE_OAUTH_TOKEN  # For Claude code reviews
```

## Branch Strategy

- **Any Branch** → Quality checks (security, lint, build)
- **`staging`** → Deploys to staging environment
- **`production`** → Deploys to production environment
- **PRs** → Full pipeline without deployment

## Usage

1. Push code to any branch for quality checks
2. Push to `staging` branch for staging deployment
3. Push to `production` branch for production deployment
4. Create PRs for code review and testing