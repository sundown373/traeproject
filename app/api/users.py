from flask import Blueprint, request, jsonify

users_bp = Blueprint('users', __name__)

users_db = [
    {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'},
    {'id': 2, 'name': 'Bob', 'email': 'bob@example.com'}
]

@users_bp.route('/', methods=['GET'])
def get_users():
    return jsonify(users_db)

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in users_db if u['id'] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@users_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = {
        'id': len(users_db) + 1,
        'name': data.get('name'),
        'email': data.get('email')
    }
    users_db.append(new_user)
    return jsonify(new_user), 201
