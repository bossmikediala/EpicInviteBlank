# EpicInvite Deployment Guide

EpicInvite projects use the following free-tier services:

- **GitHub** for source control and repository hosting
- **Vercel** for application hosting and automatic deployments
- **Supabase** for the database, authentication, storage, and other backend services

GitHub repository:

[bossmikediala/EpicInviteBlank](https://github.com/bossmikediala/EpicInviteBlank)

## Deployment Flow

```text
Local development
       |
       v
GitHub repository
       |
       v
Vercel deployment <---- Supabase backend
```

Pushing changes to the production branch on GitHub should trigger an automatic Vercel deployment.

## 1. GitHub Setup

If the local workspace has not yet been initialized:

```bash
git init
git branch -M main
git remote add origin https://github.com/bossmikediala/EpicInviteBlank.git
```

Create the first commit and push it:

```bash
git add .
git commit -m "Initialize EpicInvite"
git push -u origin main
```

GitHub authentication is required for pushing changes. Use the connected GitHub account, GitHub CLI, or a personal access token when prompted.

Do not commit passwords, private keys, service-role keys, or local environment files.

## 2. Supabase Setup

1. Sign in to [Supabase](https://supabase.com/).
2. Create a new project using the free plan.
3. Choose a secure database password and store it safely.
4. Open the project's API settings.
5. Copy the project URL and publishable key.
6. Add the required values to the repository root environment file. All client projects share this Supabase configuration.

Typical environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The exact variable names may change based on the framework selected for EpicInvite.

The publishable key may be used in the browser when Row Level Security policies are configured correctly. Never expose the Supabase service-role key in browser code or commit it to GitHub.

Database schema changes and Row Level Security policies should be documented and version-controlled using Supabase migrations once the application is initialized.

## 3. Vercel Setup

1. Sign in to [Vercel](https://vercel.com/) using the GitHub account that can access the repository.
2. Select **Add New Project**.
3. Import `bossmikediala/EpicInviteBlank`.
4. Confirm the detected framework, build command, output directory, and project root.
5. Add the Supabase environment variables under the Vercel project settings.
6. Apply the variables to Production, Preview, and Development as appropriate.
7. Deploy the project.

Vercel should create:

- A production deployment from the `main` branch
- Preview deployments for supported branches and pull requests
- A generated Vercel domain, with the option to add a custom domain later

## 4. Environment Files

Keep local secrets in the framework's supported environment file, commonly:

```text
.env.local
```

Make sure secret-bearing environment files are included in `.gitignore`.

Commit an example file containing names but no real values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

This may be saved as `.env.example` after the application framework is chosen.

## 5. Standard Release Process

1. Develop and test locally.
2. Commit the changes to Git.
3. Push the working branch to GitHub.
4. Review the Vercel preview deployment when available.
5. Merge or push the approved changes to `main`.
6. Verify the production deployment.
7. Confirm that Supabase authentication, database access, storage, and security policies work correctly.

## Deployment Checklist

- [ ] Local Git repository initialized
- [ ] GitHub remote configured
- [ ] Initial code pushed to GitHub
- [ ] Supabase free project created
- [ ] Database and Row Level Security configured
- [ ] Local environment variables configured
- [ ] Secret environment files ignored by Git
- [ ] GitHub repository imported into Vercel
- [ ] Vercel environment variables configured
- [ ] Preview deployment tested
- [ ] Production deployment tested

## Free-Tier Note

GitHub, Vercel, and Supabase offer free plans suitable for initial development and smaller projects. Their usage limits and plan terms can change, so review each provider's current limits before launching a high-traffic invitation.
