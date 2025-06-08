module.exports = {
    default: {
        require: ['./e2e/hooks/form-runner/hooks.js','./e2e/steps/form-runner/*.js'], // Path to step definitions
        format: ['progress'], // Output format
        timeout: 250 // Set timeout to 250ms        
    },
};