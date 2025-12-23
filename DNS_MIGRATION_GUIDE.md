# DNS Migration Guide: Stellar → Vercel

## Current Situation
- Your domain: `courseforgeai.org` is registered with Stellar
- Your Next.js app is deployed on Vercel (working perfectly)
- You want to point your domain to Vercel instead of Stellar hosting

## Why Not GitHub Pages?
Your CourseForge AI application requires:
- ✅ Database connections (Prisma)
- ✅ Server-side API routes (Next.js API)
- ✅ Authentication (NextAuth)
- ✅ Payment processing (Stripe)
- ✅ AI integration (OpenAI)

GitHub Pages only supports static HTML/CSS/JavaScript and would break all these features.

## Solution: Point Stellar Domain to Vercel

### Option 1: Update DNS Records (Keep Stellar as Registrar)
Keep your domain registered with Stellar but point it to Vercel servers.

### Option 2: Transfer Nameservers (Let Vercel Handle DNS)
Transfer DNS management to Vercel for easier management.

---

## Option 1: Update DNS Records (Recommended)

### Step 1: Get Vercel DNS Information

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your CourseForge AI project**
3. **Go to Settings → Domains**
4. **Click "Add Domain"**
5. **Enter**: `courseforgeai.org`
6. **Copy the DNS records** (Vercel will show you specific records)

**Typical Vercel records:**
```
A Record: @ → 76.76.19.61
CNAME: www → cname.vercel-dns.com
```

### Step 2: Update Stellar DNS

1. **Log into Stellar Client Area**: https://clients.stellarwebsystems.com
2. **Go to Services → My Services**
3. **Find your domain/cPanel service**
4. **Click "Login to cPanel"**
5. **Find "Zone Editor"** (under Domains section)
6. **Update these records:**

**Delete old records:**
- Delete A record for `@` (currently points to 199.188.205.227)
- Delete A record for `www` (currently points to 199.188.205.227)

**Add new records:**
- **A Record**: `@` → `76.76.19.61` (or whatever Vercel shows)
- **CNAME**: `www` → `cname.vercel-dns.com`

### Step 3: Verify Changes

```bash
# Check DNS after 30 minutes
nslookup courseforgeai.org
# Should show 76.76.19.61 instead of 199.188.205.227

# Check www subdomain
nslookup www.courseforgeai.org
# Should show cname.vercel-dns.com
```

---

## Option 2: Transfer Nameservers to Vercel

### Step 1: Get Vercel Nameservers

Vercel nameservers:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

### Step 2: Update Nameservers in Stellar

1. **Log into Stellar Client Area**
2. **Find Domain Management** (not cPanel)
3. **Look for "Nameservers"**
4. **Change from Stellar nameservers to:**
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

### Step 3: Configure Domain in Vercel

1. **Vercel Dashboard → Your Project → Settings → Domains**
2. **Add Domain**: `courseforgeai.org`
3. **Vercel will automatically configure DNS**

---

## Step-by-Step Instructions for Stellar

### Method 1: Through cPanel

1. **Access Stellar**: https://clients.stellarwebsystems.com
2. **Services → My Services → Manage → Login to cPanel**
3. **Find "Zone Editor"** (under Domains section)
4. **Select your domain**: courseforgeai.org
5. **Delete current A records**
6. **Add new records from Vercel**

### Method 2: Through Client Area (If cPanel not available)

1. **Services → My Services**
2. **Find domain registration (not hosting)**
3. **Look for "DNS Management" or "Nameservers"**
4. **Update DNS records**

### Method 3: Support Ticket (If you can't find DNS settings)

**Submit ticket to Stellar:**
```
Subject: DNS Update Request for courseforgeai.org

Hi,

I need to update DNS records for courseforgeai.org to point to Vercel hosting.

Please update:
- A record for @: 76.76.19.61 (or current Vercel IP)
- CNAME for www: cname.vercel-dns.com

Alternatively, you can change nameservers to:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

I have the exact records from Vercel if needed.

Thank you!
```

---

## Verification Steps

### Immediate (After making changes)
```bash
# Check if changes are saved
nslookup courseforgeai.org
```

### After 30 minutes (DNS propagation)
```bash
# Check DNS propagation
nslookup courseforgeai.org
dig courseforgeai.org

# Check from multiple locations
https://www.whatsmydns.net/#A/courseforgeai.org
```

### Final verification
- Visit: https://courseforgeai.org
- Should show your CourseForge AI app (not WordPress)
- SSL certificate should work automatically

---

## Troubleshooting

### "Can't find DNS settings"
- Contact Stellar support - they can do it for you
- Look for "Domain Manager" instead of cPanel
- Check if you have separate domain and hosting accounts

### "Changes not working"
- Wait 30 minutes for propagation
- Clear browser cache and DNS cache
- Check if changes were actually saved

### "Site still shows WordPress"
- DNS may not have propagated yet
- Check from different device/network
- Verify you're checking the right domain

---

## Timeline

- **DNS Changes**: 5 minutes
- **Propagation**: 15-30 minutes
- **Total**: Less than 1 hour

---

## Next Steps After DNS Migration

1. **Verify domain works with Vercel**
2. **Test all functionality** (payments, auth, etc.)
3. **Cancel Stellar hosting** (keep domain registration)
4. **Set up monitoring** for uptime
5. **Configure email forwarding** if needed

**Ready to start? First, get your Vercel DNS records from the Vercel dashboard, then update them in Stellar.**