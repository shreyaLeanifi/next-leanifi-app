require('dotenv').config({ path: '.env.local' });
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'leanifi-super-secret-jwt-key-2024';

// Test token creation and verification
function testToken() {
  const testPayload = {
    userId: '68caf145680f3817042b05a7',
    role: 'Admin'
  };

  console.log('🔍 Testing JWT Token:');
  console.log('═══════════════════════════════════════');
  console.log('JWT Secret:', JWT_SECRET);
  console.log('Test Payload:', testPayload);

  try {
    // Create token
    const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Token created:', token.substring(0, 50) + '...');

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified:', decoded);

    // Test role conversion
    const userRole = decoded.role?.toLowerCase();
    console.log('✅ Role converted:', userRole);
    console.log('✅ Is admin?', userRole === 'admin');

  } catch (error) {
    console.error('❌ Token error:', error.message);
  }
}

testToken();
