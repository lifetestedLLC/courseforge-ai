# GitHub Setup Guide for CourseForge AI

## Authentication Setup Options

### Option 1: Personal Access Token (Recommended)

1. **Create a Personal Access Token on GitHub:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Click "Generate new token"
   - Give it a name like "CourseForge AI"
   - Select scopes: `repo`, `workflow` (for CI/CD)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. **Configure Git to use the token:**
   ```bash
   # Remove the current remote
   git remote remove origin
   
   # Add remote with token (replace YOUR_TOKEN and YOUR_USERNAME)
   git remote add origin https://YOUR_TOKEN@github.com/lifetestedLLC/courseforge-ai.git
   
   # Set the remote URL for push
   git remote set-url --push origin https://YOUR_TOKEN@github.com/lifetestedLLC/courseforge-ai.git
   ```

### Option 2: SSH Key (More Secure)

1. **Generate an SSH key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub:**
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your key and give it a title

3. **Update the remote URL:**
   ```bash
   git remote remove origin
   git remote add origin git@github.com:lifetestedLLC/courseforge-ai.git
   ```

### Option 3: GitHub CLI (Easiest)

1. **Install GitHub CLI:**
   ```bash
   # On macOS
   brew install gh
   
   # On Ubuntu/Debian
   sudo apt install gh
   ```

2. **Authenticate with GitHub:**
   ```bash
   gh auth login
   ```

3. **The push should work automatically after authentication**

## Push Your Changes

After setting up authentication, push your changes:

```bash
# Push to GitHub
git push origin main

# If you get any errors, try force push (be careful!)
git push origin main --force
```

## Verify the Push

Check if your changes are on GitHub:

```bash
# Check remote status
git remote -v

# Check recent commits
git log --oneline -5

# Check GitHub repository
open https://github.com/lifetestedLLC/courseforge-ai
```

## Troubleshooting

### Common Issues:

1. **"Could not read Username" error:**
   - This means Git can't authenticate
   - Use one of the authentication methods above

2. **"Permission denied" error:**
   - Check if you have write access to the repository
   - Verify your authentication method is working

3. **"Repository not found" error:**
   - Check if the repository URL is correct
   - Verify you have access to the repository

### Test Your Authentication:

```bash
# Test SSH authentication
ssh -T git@github.com

# Test HTTPS authentication
git ls-remote https://github.com/lifetestedLLC/courseforge-ai.git
```

## Next Steps After Authentication

Once you've successfully pushed:

1. **Check GitHub repository** - All your files should be visible
2. **Review the README** - It should render properly on the repository page
3. **Test the workflows** - They should trigger on your next push
4. **Create an issue** - Test the issue templates we created

## Security Notes

- **Never commit sensitive data** like API keys, passwords, or tokens
- **Use environment variables** for all sensitive configuration
- **Rotate your tokens** regularly
- **Use different tokens** for different projects when possible
- **Store tokens securely** - consider using a password manager

## Additional Resources

- [GitHub Authentication Documentation](https://docs.github.com/en/authentication)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [SSH Key Setup Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)