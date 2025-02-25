#!/bin/bash

# Exit on error
set -e

# Configuration
STAGE=${1:-dev}
BUCKET_NAME="algovis-frontend-$STAGE"
DISTRIBUTION_ID="YOUR_CLOUDFRONT_DISTRIBUTION_ID"
REGION="us-east-1"

echo "Deploying frontend to $STAGE environment..."

# Build the frontend
cd ../frontend
echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

# Create S3 bucket if it doesn't exist
if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 > /dev/null; then
  echo "Creating S3 bucket..."
  aws s3 mb "s3://$BUCKET_NAME" --region $REGION
  
  # Enable static website hosting
  aws s3 website "s3://$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html

  # Configure bucket policy for public access
  echo '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
      }
    ]
  }' | aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///dev/stdin
fi

# Sync build files to S3
echo "Uploading files to S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME" \
  --delete \
  --cache-control "max-age=31536000,public" \
  --exclude "*.html" \
  --exclude "asset-manifest.json"

# Upload HTML and asset manifest with different cache settings
aws s3 sync dist/ "s3://$BUCKET_NAME" \
  --delete \
  --cache-control "no-cache,no-store,must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "asset-manifest.json"

# Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$DISTRIBUTION_ID" ]; then
  echo "Invalidating CloudFront cache..."
  aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*"
fi

echo "Frontend deployment complete!" 