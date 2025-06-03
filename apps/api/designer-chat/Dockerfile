# Stage 1: Build dependencies
FROM python:3.12-slim AS builder

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libc-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the app-specific requirements.in
COPY apps/api/designer-chat/requirements.in ./apps/api/designer-chat/requirements.in

# Install pip-tools to handle requirements compilation
RUN pip install pip-tools && \
    pip-compile apps/api/designer-chat/requirements.in && \
    pip install --use-pep517 -r apps/api/designer-chat/requirements.in && \
    pip cache purge

# Stage 2: Production image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the application code
COPY apps/api/designer-chat/src ./apps/api/designer-chat/src

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "apps.api.designer-chat.src.main:app", "--host", "0.0.0.0", "--port", "8000"]