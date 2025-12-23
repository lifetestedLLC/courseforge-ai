const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'src/components/button.tsx',
  'src/components/card.tsx',
  'src/components/use-toast-impl.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/use-toast.ts',
];

let ok = true;
filesToCheck.forEach((f) => {
  const p = path.join(__dirname, '..', f);
  if (!fs.existsSync(p)) {
    console.error('MISSING:', f);
    ok = false;
    return;
  }
  const content = fs.readFileSync(p, 'utf8');
  // Very simple content checks
  if (f.includes('button') && !/export\s+const\s+Button/.test(content) && !/export\s+\{\s*Button\s*\}/.test(content)) {
    console.error('CHECK FAILED (Button export):', f);
    ok = false;
  }
  if (f.includes('card') && !/export\s+const\s+Card/.test(content) && !/export\s+\{\s*Card/.test(content)) {
    console.error('CHECK FAILED (Card export):', f);
    ok = false;
  }
  if (f.includes('use-toast') && !/useToast/.test(content)) {
    console.error('CHECK FAILED (useToast):', f);
    ok = false;
  }
});

if (!ok) {
  console.error('\nSmoke check failed');
  process.exit(2);
}

console.log('Smoke check passed');
process.exit(0);
