#!/bin/bash

# Exit on error
set -e

# Configuration
STAGE=${1:-dev}
REGION="us-east-1"

echo "Deploying backend to $STAGE environment..."

# Create Python virtual environment
echo "Creating virtual environment..."
python -m venv .venv
source .venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r ../backend/requirements.txt

# Create deployment package
echo "Creating deployment package..."
mkdir -p python
pip install -r ../backend/requirements.txt -t python/

# Copy backend and algorithms to the deployment package
cp -r ../backend/* python/
cp -r ../algorithms python/

# Create layer archive
echo "Creating Lambda layer..."
zip -r python-deps.zip python/
aws s3 cp python-deps.zip "s3://algovis-deployment-$STAGE/layers/"
rm -rf python/ python-deps.zip

# Deploy using Serverless Framework
echo "Deploying with Serverless Framework..."
serverless deploy --stage $STAGE --region $REGION --verbose

echo "Backend deployment complete!" 