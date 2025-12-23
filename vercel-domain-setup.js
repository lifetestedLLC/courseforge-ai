#!/usr/bin/env node

/**
 * Vercel Domain Setup Helper
 * This script helps you get the correct DNS records for your domain
 */

const https = require('https');

async function getVercelDNSRecords(domain) {
  console.log(`🔍 Getting DNS records for ${domain} from Vercel...`);
  
  // This is a helper script - you'll need to get the actual records from Vercel dashboard
  console.log(`\n📋 Instructions to get your Vercel DNS records:`);
  console.log(`1. Go to: https://vercel.com/dashboard`);
  console.log(`2. Select your CourseForge AI project`);
  console.log(`3. Go to Settings → Domains`);
  console.log(`4. Click "Add Domain"`);
  console.log(`5. Enter: ${domain}`);
  console.log(`6. Copy the DNS records Vercel shows you`);
  
  console.log(`\n📝 Typical Vercel DNS records:`);
  console.log(`A Record: @ → 76.76.19.61`);
  console.log(`CNAME: www → cname.vercel-dns.com`);
  
  console.log(`\n🔄 Alternative: Transfer nameservers to Vercel:`);
  console.log(`ns1.vercel-dns.com`);
  console.log(`ns2.vercel-dns.com`);
}

// Run the script
const domain = process.argv[2] || 'courseforgeai.org';
getVercelDNSRecords(domain);

console.log(`\n📞 If you need help:`);
console.log(`- Vercel Docs: https://vercel.com/docs/concepts/projects/custom-domains`);
console.log(`- Stellar Support: Submit ticket asking for DNS update`);
console.log(`- Next.js Docs: https://nextjs.org/docs/deployment`);