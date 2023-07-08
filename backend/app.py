import json
import random
import string
import os
import json
import random
import string
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify, abort, Response
from flask_cors import CORS
from pymongo import MongoClient 
from bson import json_util

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Replace with allowed origins


# # MongoDB configuration
client = MongoClient("mongodb+srv://shubhangi:saini@cluster0.fatrmgn.mongodb.net/be_Foody?retryWrites=true&w=majority")  # Replace with your MongoDB connection string
db = client["be_Foody"]  # Replace with your database name
# client = MongoClient(os.getenv('MongoURL'))
# db = client[os.getenv('DB_NAME')]


# Load menu data from MongoDB
def load_menu():
    menu_collection = db["menu"]
    menu = list(menu_collection.find())
    return menu


# Save menu data to MongoDB
def save_menu(menu):
    menu_collection = db["menu"]
    menu_collection.delete_many({})  # Clear existing menu
    menu_collection.insert_many(menu)


# Load user data from MongoDB
def load_users():
    users_collection = db["users"]
    users = list(users_collection.find())
    return users


# Save user data to MongoDB
def save_users(users):
    users_collection = db["users"]
    users_collection.delete_many({})  # Clear existing users
    users_collection.insert_many(users)


# Load orders data from MongoDB
def load_orders(user_id = None):
    orders_collection = db["orders"]
    if user_id is None:
        orders = list(orders_collection.find())
    else:
        orders = list(orders_collection.find({"user_id": user_id}))
    return orders



# Save orders data to MongoDB
def save_orders(orders):
    orders_collection = db["orders"]
    orders_collection.delete_many({})  # Clear existing orders
    orders_collection.insert_many(orders)


def validate_order(dish_ids):
    menu = load_menu()

    for dish_id in dish_ids:
        dish = next((dish for dish in menu if dish['dish_id'] == dish_id), None)
        if dish is None or dish['stock'] == 0:
            print(f"Invalid or unavailable dish: {dish_id}")
            return False

    return True


def generate_order_id():
    orders = load_orders()
    # Find the maximum order ID in the existing orders
    order_ids = [order['order_id'] for order in orders]
    max_order_id = max(order_ids) if order_ids else 0

    # Generate a new order ID by incrementing the maximum order ID
    new_order_id = max_order_id + 1
    return new_order_id


def update_dish_stock(dish_ids):
    menu = load_menu()

    for dish_id in dish_ids:
        dish = None
        for menu_dish in menu:
            if int(menu_dish['dish_id']) == dish_id:
                dish = menu_dish
                menu_dish["stock"] -=1
                print(dish)
    
    save_menu(menu)
 
def generate_response(data=None, message=None, error=None, status_code=200):
    response = {'data': data, 'message': message, 'error': error}
    return jsonify(response), status_code

@app.route('/menu')
def display_menu():
    # Retrieve the menu data
    menu = load_menu()
    menu_json = json.dumps(menu, default=json_util.default)
    menu_dict = json.loads(menu_json)
    # Return the menu data as JSON response
    return generate_response(data={'menu': menu_dict})


@app.route('/add-dish', methods=['POST'])
def add_dish():
    menu = load_menu()
    data = request.get_json()

    availability = "YES"
    if int(data["stock"]) <= 0:
        availability = "NO"

    dish_id = data["dish_id"]
    dish_name = data["dish_name"]
    dish_image = data["dish_image"]
    price = data["price"]
    stock = data["stock"]
    availability = availability

    menu.append({
        'dish_id': dish_id,
        'dish_name': dish_name,
        'price': price,
        'stock': stock,
        "availability": availability,
        "dish_image": dish_image
    })

    # Save the updated menu data to MongoDB
    save_menu(menu)
    return jsonify({'message': 'Dish added successfully'})


@app.route('/take-order', methods=['POST'])
def take_order():
    menu = load_menu()
    orders = load_orders()
    data = request.get_json()

    customer_name = data['customer_name']
    dish_ids = data['dish_ids']
    user_id = data['user_id']

    if not customer_name or not dish_ids:
        return jsonify({'error': 'Incomplete order information'}), 400

    # Validate the order
    for dish_id in dish_ids:
        dish = next((dish for dish in menu if dish['dish_id'] == int(dish_id)), None)
        if dish is None or dish['stock'] == 0:
            return jsonify({'error': f"Invalid or unavailable dish in the order: {dish_id}"}), 400

    # Generate a new order ID
    order_id = generate_order_id()

    # Update the orders list
    new_order = {
        'order_id': order_id,
        'customer_name': customer_name,
        'dish_ids': dish_ids,
        'status': 'received',
        "user_id":user_id,
    }
    print(new_order)

    orders.append(new_order)

    # Save the orders data to MongoDB
    save_orders(orders)

    # Update the dish stock
    update_dish_stock(dish_ids)

    return jsonify({'message': 'Order placed successfully'})


@app.route('/review-orders')
def review_orders():
     # Retrieve the user ID and role from the query parameters
    user_id = request.args.get('user_id')
    role = request.args.get('role')
    # Retrieve the orders data
    orders = load_orders()
    menu = load_menu()

# Check if the user is an admin or a regular user
    if role == 'admin':
        orders = load_orders()
    elif role == 'user':
        orders = load_orders(user_id=user_id)
    else:
        return jsonify({'error': 'Invalid role parameter'}), 400


    # Update each order with dish names and prices
    for order in orders:
        name = []
        price = 0
        dish_ids = order['dish_ids']
        for dish_id in dish_ids:
            for item in menu:
                if dish_id == item["dish_id"]:
                    name.append(item["dish_name"])
                    price += float(item["price"])
                    break
        order['total_price'] = price
        order['name'] = name
        print(orders)

    # Return the orders data as JSON response
    order_json = json.dumps(orders, default=str)
    order_dict = json.loads(order_json)
    return generate_response(data={'orders': order_dict})




@app.route('/delete-dish/<dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    menu = load_menu()

    # Find the dish to delete
    dish = next((dish for dish in menu if dish['dish_id'] == int(dish_id)), None)
    if dish is None:
        return jsonify({'error': 'Dish not found'}), 400

    # Remove the dish from the menu
    menu.remove(dish)

    # Save the updated menu data to MongoDB
    save_menu(menu)

    return jsonify({'message': 'Dish deleted successfully'})


@app.route('/order/update-status', methods=['POST'])
def update_status():
    data = request.get_json()
    order_id = data['order_id']
    status = data['status']

    if update_order_status(order_id, status):
        return jsonify({'message': 'Order status updated successfully'})

    return jsonify({'error': 'Invalid Order Id'}), 400


def update_order_status(order_id, status):
    orders = load_orders()

    for order in orders:
        if order['order_id'] == order_id:
            order['status'] = status

            # Save updated orders data to MongoDB
            save_orders(orders)

            return True

    return False


@app.route('/update-dish/<int:dish_id>', methods=['PATCH'])
def update_dish(dish_id):
    # Retrieve the menu data
    menu = load_menu()

    # Find the dish with the given dish_id
    for dish in menu:

        if dish['dish_id'] == dish_id:
            # Update the dish properties
            updated_data = request.get_json()
            dish['dish_name'] = updated_data.get('dish_name', dish['dish_name'])
            dish['price'] = updated_data.get('price', dish['price'])
            dish['stock'] = updated_data.get('stock', dish['stock'])
            if int(dish["stock"]) <= 0:
                dish["availability"] = "NO"
            else:
                dish["availability"] = "YES"

    # Save the updated menu data to MongoDB
    save_menu(menu)

    return jsonify({'message': 'Dish updated successfully'})


# Generate a random alphanumeric string for user IDs
def generate_user_id(length=6):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    password = data['password']
    role = data["role"]
    email = data["email"]

    if not username or not password or not role or not email:
        return jsonify({'error': 'fill All detials'}), 400

    users = load_users()
    existing_user = next((user for user in users if user['username'] == username), None)
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400

    user_id = generate_user_id()
    new_user = {
        'user_id': user_id,
        'username': username,
        'password': password,
        "role": role,
        "email": email,
    }
    users.append(new_user)
    save_users(users)

    return jsonify({'message': 'Signup successful'})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    if not email or not password:
        return jsonify({'error': 'Incomplete login information'}), 400

    users = load_users()
    user = next((user for user in users if user['email'] == email), None)
    if not user or user['password'] != password:
        return jsonify({'error': 'Incorrect email or password'}), 401

    # Perform login logic here
    print(user)
    return jsonify({'message': 'Login successful', 'user':{"username":user["username"], "role":user["role"],"user_id":user["user_id"],"email":user["email"]}})



if __name__ == '__main__':
    app.run(debug=True,port=11000)




