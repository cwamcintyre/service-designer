#!/bin/sh

# remove the existing config.js if it exists
if [ -f /app/build/client/config.js ]; then
    echo "Removing existing /app/build/client/config.js"
    rm /app/build/client/config.js
fi

# Generate the config.js file in the /app folder using environment variables
cat <<EOL > /app/build/client/config.js
    window.RUNTIME_CONFIG = {
        VITE_APP_API_URL: "${VITE_APP_API_URL}",
        VITE_APP_RUNNER_URL: "${VITE_APP_RUNNER_URL}",
        VITE_APP_CHAT_URL: "${VITE_APP_CHAT_URL}",
        VITE_OIDC_CALLBACK: "${VITE_OIDC_CALLBACK}",
        VITE_OIDC_CLIENT_ID: "${VITE_OIDC_CLIENT_ID}",
        VITE_OIDC_CLIENT_AUTHORITY: "${VITE_OIDC_CLIENT_AUTHORITY}",
    };
EOL

echo "Generated /app/build/client/config.js with runtime environment variables."

# Start the application
serve -s /app/build/client -l 443