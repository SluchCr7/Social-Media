const test = require('node:test');
const assert = require('node:assert/strict');
const { getCloudinaryConfig } = require('../Config/cloudinaryConfig');

test('prefers standard Cloudinary env vars and falls back to legacy names', () => {
  process.env.CLOUDINARY_CLOUD_NAME = 'std-cloud';
  process.env.CLOUDINARY_API_KEY = 'std-key';
  process.env.CLOUDINARY_API_SECRET = 'std-secret';
  delete process.env.CLOUDINARY_NAME;
  delete process.env.API_KEY;
  delete process.env.API_SECRET_KEY;

  assert.deepEqual(getCloudinaryConfig(), {
    cloud_name: 'std-cloud',
    api_key: 'std-key',
    api_secret: 'std-secret',
  });
});

test('falls back to legacy names when standard vars are absent', () => {
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
  process.env.CLOUDINARY_NAME = 'legacy-cloud';
  process.env.API_KEY = 'legacy-key';
  process.env.API_SECRET_KEY = 'legacy-secret';

  assert.deepEqual(getCloudinaryConfig(), {
    cloud_name: 'legacy-cloud',
    api_key: 'legacy-key',
    api_secret: 'legacy-secret',
  });
});
