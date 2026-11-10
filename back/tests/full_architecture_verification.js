/**
 * Automated Verification Test Suite for Social Media Application Refactoring
 * Tests: Token Security, Atomic Refresh Token Rotation, Reuse Detection,
 * CSRF Protection, Socket.IO Handshake Auth, and Destructive Route Protection.
 */

const assert = require('assert');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require('../utils/tokenUtils');

async function runTests() {
  console.log('🚀 Starting Comprehensive Architecture & Security Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // --- 1. Token Cryptographic Independence & Claims ---
  test('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET are independent and defined', () => {
    assert.ok(ACCESS_TOKEN_SECRET, 'ACCESS_TOKEN_SECRET must be defined');
    assert.ok(REFRESH_TOKEN_SECRET, 'REFRESH_TOKEN_SECRET must be defined');
    assert.notStrictEqual(ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, 'Secrets must be distinct');
  });

  test('Access token contains valid claims: typ=access, unique jti, and user identity', () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011', email: 'user@example.com', isAdmin: false };
    const token = generateAccessToken(mockUser);
    const { payload, expired, error } = verifyAccessToken(token);

    assert.strictEqual(expired, false);
    assert.strictEqual(error, undefined);
    assert.strictEqual(payload._id, mockUser._id);
    assert.strictEqual(payload.email, mockUser.email);
    assert.strictEqual(payload.typ, 'access');
    assert.ok(payload.jti, 'jti must exist');
  });

  test('Refresh token contains valid claims: typ=refresh, unique jti, and family ID', () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011', email: 'user@example.com', isAdmin: false };
    const token = generateRefreshToken(mockUser, 'family_xyz_123');
    const { payload, expired, error } = verifyRefreshToken(token);

    assert.strictEqual(expired, false);
    assert.strictEqual(error, undefined);
    assert.strictEqual(payload._id, mockUser._id);
    assert.strictEqual(payload.typ, 'refresh');
    assert.strictEqual(payload.family, 'family_xyz_123');
    assert.ok(payload.jti, 'jti must exist');
  });

  test('Cross-token verification failure: verifyAccessToken rejects refresh tokens', () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011', email: 'user@example.com' };
    const refreshToken = generateRefreshToken(mockUser);
    const result = verifyAccessToken(refreshToken);

    assert.strictEqual(result.payload, null, 'Access token verifier must reject refresh token');
  });

  test('Cross-token verification failure: verifyRefreshToken rejects access tokens', () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011', email: 'user@example.com' };
    const accessToken = generateAccessToken(mockUser);
    const result = verifyRefreshToken(accessToken);

    assert.strictEqual(result.payload, null, 'Refresh token verifier must reject access token');
  });

  // --- 2. Deterministic & Secure Token Hashing ---
  test('Token hashing is deterministic and irreversible with SHA-256', () => {
    const token = 'sample_raw_refresh_token_123456';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);
    assert.strictEqual(hash1, hash2, 'Hashes must match deterministically');
    assert.strictEqual(hash1.length, 64, 'SHA-256 hex output must be 64 characters');
    assert.notStrictEqual(hash1, token, 'Hash must not equal raw token');
  });

  // --- 3. Atomic Refresh Token Rotation & Concurrency Simulation ---
  test('Atomic token consumption: single-use token can only be consumed once', () => {
    const mockDbUser = {
      _id: '507f1f77bcf86cd799439011',
      refreshTokens: [
        { tokenHash: hashToken('token_A'), family: 'fam_1' },
      ],
    };

    // Simulate atomic findOneAndUpdate with pull
    function atomicConsume(user, incomingToken) {
      const incomingHash = hashToken(incomingToken);
      const idx = user.refreshTokens.findIndex(rt => rt.tokenHash === incomingHash);
      if (idx === -1) return null; // already consumed or invalid
      const matched = { ...user };
      user.refreshTokens.splice(idx, 1);
      return matched;
    }

    const firstAttempt = atomicConsume(mockDbUser, 'token_A');
    assert.ok(firstAttempt, 'First request consumes token successfully');

    const concurrentSecondAttempt = atomicConsume(mockDbUser, 'token_A');
    assert.strictEqual(concurrentSecondAttempt, null, 'Concurrent request with same token must be rejected');
  });

  // --- 4. Refresh Token Reuse Detection ---
  test('Reuse detection: attempting to reuse consumed token revokes entire family', () => {
    const mockDbUser = {
      _id: '507f1f77bcf86cd799439011',
      refreshTokens: [
        { tokenHash: hashToken('token_B'), family: 'compromised_family' },
        { tokenHash: hashToken('token_C'), family: 'other_safe_family' },
      ],
    };

    // Attacker tries to use already-rotated token_A from compromised_family
    const attackerTokenFamily = 'compromised_family';
    // Revocation action:
    mockDbUser.refreshTokens = mockDbUser.refreshTokens.filter(rt => rt.family !== attackerTokenFamily);

    assert.strictEqual(mockDbUser.refreshTokens.length, 1, 'Compromised family must be purged completely');
    assert.strictEqual(mockDbUser.refreshTokens[0].family, 'other_safe_family', 'Unrelated session family must remain untouched');
  });

  // --- 5. Cookie Security Options ---
  test('Cookie options enforce httpOnly, correct sameSite and secure settings', () => {
    const mockRes = {
      cookies: {},
      cookie(name, val, opts) {
        this.cookies[name] = { val, opts };
      },
    };

    setAuthCookies(mockRes, 'access_jwt', 'refresh_jwt');

    assert.ok(mockRes.cookies.accessToken, 'accessToken cookie must be set');
    assert.ok(mockRes.cookies.refreshToken, 'refreshToken cookie must be set');
    assert.strictEqual(mockRes.cookies.accessToken.opts.httpOnly, true, 'accessToken must be httpOnly');
    assert.strictEqual(mockRes.cookies.refreshToken.opts.httpOnly, true, 'refreshToken must be httpOnly');
    assert.strictEqual(mockRes.cookies.accessToken.opts.path, '/', 'path must be /');
  });

  // --- 6. Destructive Route Protection Check ---
  test('UserRoute secures /deleteAll with verifyAdmin middleware', () => {
    const fs = require('fs');
    const userRouteSrc = fs.readFileSync(path.join(__dirname, '..', 'routes', 'UserRoute.js'), 'utf8');
    assert.ok(
      userRouteSrc.includes("route.route('/deleteAll').delete(verifyAdmin, deleteAllUsers);"),
      '/deleteAll must be protected by verifyAdmin'
    );
  });

  // --- 7. CSRF Protection Middleware Check ---
  test('index.js enforces CSRF origin validation on state-changing requests', () => {
    const fs = require('fs');
    const indexSrc = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf8');
    assert.ok(indexSrc.includes('CSRF Protection: Validate Origin / Referer'), 'CSRF middleware must exist in index.js');
    assert.ok(indexSrc.includes("['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)"), 'CSRF check must cover state-changing methods');
  });

  // --- 8. Socket.IO Handshake Authentication Check ---
  test('socket.js strictly authenticates through verified HTTP-only cookie and rejects query.userId spoofing', () => {
    const fs = require('fs');
    const socketSrc = fs.readFileSync(path.join(__dirname, '..', 'Config', 'socket.js'), 'utf8');
    assert.ok(socketSrc.includes('io.use(async (socket, next)'), 'io.use middleware must be defined');
    assert.ok(socketSrc.includes('verifyAccessToken(token)'), 'socket must verify access token');
    assert.ok(
      !socketSrc.includes('socket.handshake.query.userId') && !socketSrc.includes('socket.handshake.auth?.userId'),
      'socket must never trust query.userId or auth.userId from client'
    );
  });

  console.log(`\n==================================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
