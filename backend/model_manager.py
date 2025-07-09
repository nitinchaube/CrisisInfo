import os
import logging
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

class ModelManager:
    def __init__(self, config):
        self.config = config
        self.models = {}
        self.tokenizers = {}
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
    def load_models(self):
        """Load all required models"""
        try:
            # Load binary classification model
            binary_model_path = self.config.BINARY_MODEL_PATH
            if os.path.exists(binary_model_path):
                self.models['binary'] = AutoModelForSequenceClassification.from_pretrained(binary_model_path)
                self.tokenizers['binary'] = AutoTokenizer.from_pretrained(binary_model_path)
                self.models['binary'].to(self.device)
                self.models['binary'].eval()
                logging.info(f"Binary model loaded from {binary_model_path}")
            else:
                logging.warning(f"Binary model not found at {binary_model_path}")
            
            # Load multi-class model
            multi_class_model_path = self.config.MULTI_CLASS_MODEL_PATH
            if os.path.exists(multi_class_model_path):
                self.models['multi_class'] = AutoModelForSequenceClassification.from_pretrained(multi_class_model_path)
                self.tokenizers['multi_class'] = AutoTokenizer.from_pretrained(multi_class_model_path)
                self.models['multi_class'].to(self.device)
                self.models['multi_class'].eval()
                logging.info(f"Multi-class model loaded from {multi_class_model_path}")
            else:
                logging.warning(f"Multi-class model not found at {multi_class_model_path}")
                
        except Exception as e:
            logging.error(f"Error loading models: {e}")
            raise
    
    def get_model(self, model_type):
        """Get a specific model"""
        return self.models.get(model_type)
    
    def get_tokenizer(self, model_type):
        """Get a specific tokenizer"""
        return self.tokenizers.get(model_type)
    
    def reload_models(self):
        """Reload all models"""
        logging.info("Reloading models...")
        self.load_models()
        logging.info("Models reloaded successfully")
