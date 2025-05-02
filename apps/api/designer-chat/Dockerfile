# Use the official Python image as the base image
FROM python:3.12-slim

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libc-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.in file to the container
COPY requirements.in ./

# Install pip-tools to handle requirements compilation
RUN pip install pip-tools && pip-compile requirements.in && pip install --use-pep517 -r requirements.txt && pip cache purge

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80"]