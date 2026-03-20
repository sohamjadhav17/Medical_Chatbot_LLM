import jwt
from functools import wraps
from flask import request, jsonify
from src.config import Config

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check if auth header is present
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'error': 'Token is missing or invalid!'}), 401
        
        try:
            # Decode the payload securely against the NextAuth JWT secret
            data = jwt.decode(token, Config.NEXTAUTH_SECRET, algorithms=["HS256"])
            
            # Extract user metadata. NextAuth usually stores user ID in the 'sub' claim
            user_id = data.get('sub') or data.get('id')
            user_email = data.get('email')
            
            if not user_id:
                return jsonify({'error': 'User ID not found in token'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid!'}), 401
            
        # Pass the extracted user info into the route
        return f(user_id=user_id, user_email=user_email, *args, **kwargs)
        
    return decorated
