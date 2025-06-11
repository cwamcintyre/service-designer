module.exports = {
    default: {
        require: ['./tests/e2e/hooks/form-runner/hooks.js','./tests/e2e/steps/form-runner/*.js'], // Path to step definitions
        format: ['progress'], // Output format
        timeout: 250 // Set timeout to 250ms        
    },
};