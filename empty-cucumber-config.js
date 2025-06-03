module.exports = {
    default: {
        require: ['./e2e/hooks.js','./e2e/steps/**/*.js'], // Path to step definitions
        format: ['progress'], // Output format
        timeout: 250 // Set timeout to 250ms        
    },
};