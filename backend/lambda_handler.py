import json
import os
import traceback
from typing import Any, Dict, Tuple, Union

from app import app

def create_response(
    status_code: int,
    body: Union[Dict[str, Any], str],
    headers: Dict[str, str] = None
) -> Dict[str, Any]:
    """Create a standardized API Gateway response."""
    if headers is None:
        headers = {}

    # Add CORS headers
    headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    })

    return {
        'statusCode': status_code,
        'headers': headers,
        'body': json.dumps(body) if isinstance(body, dict) else body
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """AWS Lambda handler function."""
    try:
        # Handle OPTIONS requests for CORS
        if event.get('httpMethod') == 'OPTIONS':
            return create_response(200, '')

        # Extract path and method
        path = event.get('path', '')
        http_method = event.get('httpMethod', '')
        
        # Parse query string parameters
        query_params = event.get('queryStringParameters', {}) or {}
        
        # Parse request body
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except json.JSONDecodeError:
                return create_response(400, {'error': 'Invalid JSON in request body'})

        # Create Flask request context
        with app.test_request_context(
            path=path,
            method=http_method,
            query_string=query_params,
            json=body
        ):
            try:
                # Process the request through Flask
                response = app.full_dispatch_request()
                return create_response(
                    response.status_code,
                    response.get_json() if response.is_json else response.get_data(as_text=True),
                    dict(response.headers)
                )
            except Exception as e:
                app.logger.error(f'Error processing request: {str(e)}')
                app.logger.error(traceback.format_exc())
                return create_response(500, {
                    'error': str(e),
                    'traceback': traceback.format_exc()
                })

    except Exception as e:
        return create_response(500, {
            'error': str(e),
            'traceback': traceback.format_exc()
        }) 