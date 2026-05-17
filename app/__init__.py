from flask import Flask
from app.api.users import users_bp
from app.api.products import products_bp

def create_app():
    app = Flask(__name__)
    
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    
    @app.route('/')
    def index():
        return {'message': 'Flask API with Blueprints', 'version': '1.0.0'}
    
    return app
