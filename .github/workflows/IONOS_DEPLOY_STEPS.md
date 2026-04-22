# IONOS VPX Deploy Steps

This file explains exactly what to do after adding `deploy-ionos.yml`.

## 1) Prepare the server (one time)

SSH into your server:

```bash
ssh root@YOUR_SERVER_IP
```

Install required tools:

```bash
apt update && apt upgrade -y
apt install -y git curl nginx
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs
npm i -g pm2
```

Create a deploy user (if you do not have one yet):

```bash
adduser deploy
usermod -aG sudo deploy
```

## 2) Clone project on server (one time)

Switch to deploy user and clone repo:

```bash
su - deploy
git clone https://github.com/YOUR_ORG/YOUR_REPO.git
cd YOUR_REPO
npm ci
npm run build
pm2 start npm --name inftour -- start
pm2 save
pm2 startup
```

Keep this path; you will use it as `APP_DIR` secret.
Example: `/home/deploy/YOUR_REPO`

## 3) Add SSH key for GitHub Actions (one time)

On your local machine, generate a key pair only for deploy (if you do not have one):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy"
```

- Public key (`.pub`) goes to server: `/home/deploy/.ssh/authorized_keys`
- Private key goes to GitHub secret: `SSH_PRIVATE_KEY`

On server, ensure permissions:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## 4) Add GitHub repository secrets (one time)

In GitHub repo:
`Settings -> Secrets and variables -> Actions -> New repository secret`

Create these secrets:

- `SSH_PRIVATE_KEY` = private key content
- `SSH_HOST` = server IP/domain
- `SSH_USER` = deploy username (example: `deploy`)
- `APP_DIR` = absolute app path on server (example: `/home/deploy/YOUR_REPO`)

## 5) Ensure branch name is correct

The workflow deploys from pushes to `main`.
If your production branch is different (for example `master`), edit:

```yaml
on:
  push:
    branches:
      - main
```

## 6) First deployment test

Option A: push a new commit to `main`.
Option B: run manually from GitHub `Actions -> Deploy to IONOS VPX -> Run workflow`.

Then check logs:

- GitHub Actions job output
- Server status:

```bash
pm2 status
pm2 logs inftour --lines 100
```

## 7) Optional: reverse proxy + SSL (recommended)

Use Nginx to proxy to app port (usually `3000`), then add SSL with Certbot:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 8) Normal future workflow

After this setup, your day-to-day flow is:

1. Change code locally
2. Commit + push to `main`
3. GitHub Actions deploys automatically

No need to manually SSH and deploy every time.
