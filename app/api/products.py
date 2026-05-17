from flask import Blueprint, request, jsonify

products_bp = Blueprint('products', __name__)

products_db = [
    {'id': 1, 'name': 'Laptop', 'price': 999.99},
    {'id': 2, 'name': 'Phone', 'price': 699.99}
]

@products_bp.route('/', methods=['GET'])
def get_products():
    return jsonify(products_db)

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in products_db if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({'error': 'Product not found'}), 404

@products_bp.route('/', methods=['POST'])
def create_product():
    data = request.get_json()
    new_product = {
        'id': len(products_db) + 1,
        'name': data.get('name'),
        'price': data.get('price')
    }
    products_db.append(new_product)
    return jsonify(new_product), 201
