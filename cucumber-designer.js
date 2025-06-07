module.exports = {
    default: {
        require: ['./e2e/hooks/form-designer/hooks.js','./e2e/steps/form-designer/*.js'], // Path to step definitions
        paths: ['./e2e/features/form-designer/*.feature'], // Path to feature files
        format: ['progress'], // Output format
        timeout: 250 // Set timeout to 250ms        
    },
};