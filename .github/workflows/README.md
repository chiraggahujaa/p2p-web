# GitHub Workflows

Automated CI/CD workflows for quality assurance, deployment, and code review.

## Workflows

### `ci-cd.yml` - Main CI/CD Pipeline
**Triggers:** Push to any branch, PRs to main/staging/production, manual dispatch
**Jobs:**
1. **Security Scan** - Trivy vulnerability scanning and dependency audit
2. **Test & Lint** - TypeScript checks, ESLint, unit tests across Node.js 18/20/22
3. **Build & Performance** - Application build with performance validation
4. **E2E Tests** - Playwright tests for PRs and deployment branches

### `claude-code-review.yml` - Automated Code Review
**Triggers:** Pull request open/sync
**Purpose:** Claude-powered code review focusing on bugs and security issues

### `claude.yml` - Interactive Claude Assistant
**Triggers:** Issue comments, PR comments, new issues mentioning @claude
**Purpose:** On-demand Claude assistance via GitHub comments

### `scheduled-deployment.yml` - Daily Production Deploy
**Triggers:** Daily at 9 PM UTC, manual dispatch with force option
**Purpose:** Automated main→production deployments with conflict detection and rollback protection

## Required Secrets

```
CLAUDE_CODE_OAUTH_TOKEN  # For Claude code reviews and assistance
```

## Branch Strategy

- **Any Branch** → Quality checks (security, lint, build)
- **`production`** → Automatic Vercel deployment
- **PRs** → Full pipeline + code review