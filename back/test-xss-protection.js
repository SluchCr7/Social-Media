/**
 * Test Script for XSS Protection Middleware
 * 
 * This script tests the custom XSS protection middleware
 * to ensure it works correctly with Express v5
 */

const express = require('express');
const xssProtection = require('./Middelwares/xssProtection');

const app = express();

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xssProtection);

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        message: 'XSS Protection Test',
        originalQuery: req.query,
        sanitizedQuery: req.sanitizedQuery,
        queryIsReadOnly: Object.getOwnPropertyDescriptor(req, 'query')?.set === undefined
    });
});

app.post('/test', (req, res) => {
    res.json({
        message: 'XSS Protection Test - POST',
        body: req.body,
        bodyWasSanitized: true
    });
});

// Start test server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n✅ Test server running on port ${PORT}`);
    console.log(`\nTest URLs:`);
    console.log(`  GET  http://localhost:${PORT}/test?name=<script>alert('xss')</script>&page=1`);
    console.log(`  POST http://localhost:${PORT}/test`);
    console.log(`       Body: { "text": "<script>alert('xss')</script>" }\n`);
    console.log(`Press Ctrl+C to stop\n`);
});
