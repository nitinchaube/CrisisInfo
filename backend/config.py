import os
import secrets
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    PORT = int(os.environ.get('PORT', 5002))
    
    # Security - Generate secret key if not provided
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    
    # Database
    #DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///events.db')
    CHROMA_DB_PATH = os.environ.get('CHROMA_DB_PATH', './chroma_db')
    
    # OpenAI
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    #OPENAI_MODEL = os.environ.get('OPENAI_MODEL', 'gpt-4')
    
    # Model Paths
    BINARY_MODEL_PATH = os.environ.get('BINARY_MODEL_PATH', './models/binary_model')
    MULTI_CLASS_MODEL_PATH = os.environ.get('MULTI_CLASS_MODEL_PATH', './models/multi-class-humanitarian_model')
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', './logs/app.log')
    
    # Security
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE = int(os.environ.get('RATE_LIMIT_PER_MINUTE', 60))
    RATE_LIMIT_PER_HOUR = int(os.environ.get('RATE_LIMIT_PER_HOUR', 1000))
    
    # File Upload
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16777216))
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', './uploads')
    
    # Monitoring
    ENABLE_MONITORING = os.environ.get('ENABLE_MONITORING', 'True').lower() == 'true'
    METRICS_PORT = int(os.environ.get('METRICS_PORT', 9090))

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = 'WARNING'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DATABASE_URL = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
