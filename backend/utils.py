"""
Utility functions for Telegram bot and API
"""
import hmac
import hashlib
from urllib.parse import parse_qs, urlencode


def validate_telegram_init_data(init_data: str, bot_token: str) -> bool:
    """
    Validate Telegram WebApp init data
    
    Args:
        init_data: The init_data string from Telegram WebApp
        bot_token: Your bot token from BotFather
    
    Returns:
        bool: True if valid, False otherwise
    """
    try:
        # Parse init_data
        params = dict(parse_qs(init_data))
        
        # Extract hash
        received_hash = params.pop('hash', [None])[0]
        if not received_hash:
            return False
        
        # Sort parameters and create data_check_string
        data_check_array = []
        for key in sorted(params.keys()):
            if key != 'hash':
                data_check_array.append(f"{key}={params[key][0]}")
        
        data_check_string = '\n'.join(data_check_array)
        
        # Create secret key
        secret_key = hmac.new(
            b"WebAppData",
            bot_token.encode('utf-8'),
            hashlib.sha256
        ).digest()
        
        # Calculate hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Compare hashes (constant-time comparison)
        return hmac.compare_digest(calculated_hash, received_hash)
    
    except Exception as e:
        print(f"Error validating init data: {e}")
        return False


def extract_user_from_init_data(init_data: str):
    """
    Extract user information from Telegram WebApp init_data
    
    Args:
        init_data: The init_data string from Telegram WebApp
    
    Returns:
        dict: User information or None if invalid
    """
    try:
        import json
        from urllib.parse import parse_qs, unquote
        
        params = dict(parse_qs(init_data))
        user_str = params.get('user', [None])[0]
        
        if user_str:
            user_data = json.loads(unquote(user_str))
            return user_data
        
        return None
    except Exception as e:
        print(f"Error extracting user data: {e}")
        return None
