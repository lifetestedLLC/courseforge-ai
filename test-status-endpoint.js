#!/usr/bin/env node

/**
 * Test script for the /api/status endpoint
 * Tests both unauthenticated and authenticated access
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

console.log('Testing /api/status endpoint...\n');

// Test 1: Unauthenticated request
async function testUnauthenticated() {
  console.log('Test 1: Unauthenticated request');
  console.log('-'.repeat(50));
  
  try {
    const response = await fetch(`${baseUrl}/api/status`);
    const data = await response.json();
    
    console.log('Status Code:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('\nExpected: authenticated: false');
    console.log('Actual:', data.authenticated === false ? '✅ PASS' : '❌ FAIL');
    console.log('System online:', data.system?.online ? '✅ PASS' : '❌ FAIL');
    
    return data.authenticated === false && data.system?.online === true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Note: For authenticated testing, we would need to:
// 1. Login via /api/auth/callback/credentials
// 2. Extract the session cookie
// 3. Make the request with the cookie
// This would require a running server instance

async function runTests() {
  console.log('='.repeat(50));
  console.log('STATUS ENDPOINT TEST SUITE');
  console.log('='.repeat(50));
  console.log('');
  
  const test1 = await testUnauthenticated();
  
  console.log('\n' + '='.repeat(50));
  console.log('TEST SUMMARY');
  console.log('='.repeat(50));
  console.log('Test 1 (Unauthenticated):', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('');
  console.log('Note: To test authenticated access, start the dev server with:');
  console.log('  npm run dev');
  console.log('Then access: http://localhost:3000/api/status');
}

// Check if we're trying to test against a running server
if (process.argv.includes('--server')) {
  runTests().catch(console.error);
} else {
  console.log('This test requires a running server.');
  console.log('Usage:');
  console.log('  1. Start the dev server: npm run dev');
  console.log('  2. In another terminal: node test-status-endpoint.js --server');
  console.log('\nOr use curl to test manually:');
  console.log('  curl http://localhost:3000/api/status');
}
