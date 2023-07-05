import json
import random
import string
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# Load menu data from a file using JSON
def load_menu():
    try:
        with open('menu.json', 'r') as file:
            menu = json.load(file)
    except EOFError:  # Handle empty file
                menu = []
    except FileNotFoundError:
        menu = []
    return menu

# Save menu data to a file using JSON
def save_menu(menu):
    with open('menu.json', 'w') as file:
        json.dump(menu, file)

# Save user data to a file using JSON
def save_users(users):
    with open('users.json', 'w') as file:
        json.dump(users, file)

# Load user data from a file using JSON
def load_users():
    try:
        with open('users.json', 'r') as file:
            users = json.load(file)
    except EOFError:  # Handle empty file
                users = []
    except FileNotFoundError:
        users = []
    return users



# Load orders data from a file using JSON
def load_orders():
    try:
        with open('orders.json', 'r') as file:
            orders = json.load(file)
    except EOFError:  # Handle empty file
                orders = []
    except FileNotFoundError:
        orders = []
    return orders

# Save orders data to a file using JSON
def save_orders(orders):
    with open('orders.json', 'w') as file:
        json.dump(orders, file)

def validate_order(dish_ids):
    menu = load_menu()
    orders = load_orders()

    for dish_id in dish_ids:
        dish = next((dish for dish in menu if dish['dish_id'] == dish_id), None)
        if dish is None or dish['stock'] == 0:
            print(f"Invalid or unavailable dish: {dish_id}")
            return False

    return True

def generate_order_id():
    menu = load_menu()
    orders = load_orders()
    # Find the maximum order ID in the existing orders
    order_ids = [order['order_id'] for order in orders]
    max_order_id = max(order_ids) if order_ids else 0

    # Generate a new order ID by incrementing the maximum order ID
    new_order_id = max_order_id + 1
    return new_order_id

def update_dish_stock(dish_ids):
    menu = load_menu()
    orders = load_orders()
    for dish_id in dish_ids:
        # Find the dish in the menu
        dish = next((dish for dish in menu if int(dish['dish_id']) == int(dish_id)), None)
        print(dish,"sdfkjdhfkjd")
        dish["stock"] -= 1
    save_menu(menu)

@app.route('/menu')
def display_menu():
    # Retrieve the menu data
    menu = load_menu()
    # Return the menu data as JSON response
    return json.dumps(menu)

@app.route('/add-dish', methods=['POST'])
def add_dish():
    menu = load_menu()
    data = request.get_json()

    availability = "YES"
    if int(data["stock"])<=0:
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
        "availability":availability,
        "dish_image":dish_image
    })

    # Save the updated menu data using JSON
    save_menu(menu)
    return jsonify({'message': 'Dish added successfully'})
    

@app.route('/take-order', methods=['POST'])
def take_order():
    menu = load_menu()
    orders = load_orders()
    data = request.get_json()

    customer_name =data['customer_name']
    dish_ids = data['dish_ids']

    if not customer_name or not dish_ids:
        return jsonify({'error': 'Incomplete order information'}), 400

    # Validate the order
    for dish_id in dish_ids:
        dish = next((dish for dish in menu if dish['dish_id'] == int(dish_id)), None)
        if dish is None or dish['stock'] == 0:
            return f"Error: Invalid or unavailable dish in the order: {dish_id}"

    # Generate a new order ID
    order_id = generate_order_id()

    # Update the orders list
    new_order = {
        'order_id': order_id,
        'customer_name': customer_name,
        'dish_ids': dish_ids,
        'status': 'received'
    }

    orders.append(new_order)
    print(new_order)
    # Save the orders data using JSON
    save_orders(orders)

    # Update the dish stock
    update_dish_stock(dish_ids)

    return jsonify({'message': 'Order Places successfully successfully'})

@app.route('/review-orders')
def review_orders():
    # Retrieve the orders data
    orders = load_orders()
    menu = load_menu()

    # Update each order with dish names and prices
    for order in orders:
        name = []
        price = 0
        dish_ids = order['dish_ids']
        for dish_id in dish_ids:
            for item in menu:
                if dish_id == item["dish_id"]:
                    name.append(item["dish_name"])
                    price += item["price"]
                    break
        order['total_price'] = price
        order['name'] = name

    # Return the orders data as JSON response
    return json.dumps(orders)

@app.route('/delete-dish/<dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    menu = load_menu()

    # Find the dish to delete
    dish = next((dish for dish in menu if dish['dish_id'] == int(dish_id)), None)
    if dish is None:
        return jsonify({'error': 'Dish not Found'}), 400

    # Remove the dish from the menu
    menu.remove(dish)

    # Save the updated menu data using JSON
    save_menu(menu)

    return jsonify({'message': 'Dish deleted successfully'})

@app.route('/order/update-status', methods=['POST'])
def update_status():
    data = request.json()
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

            # Save updated orders data using JSON
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
            if int(dish["stock"]) <= int(0):
                dish["availability"] = "NO"
            else:
                dish["availability"] = "YES"
            print(dish["availability"])

    # Save the updated menu data using JSON
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
    email=data["email"]

    if not username or not password:
        return jsonify({'error': 'Incomplete signup information'}), 400

    users = load_users()
    existing_user = next((user for user in users if user['username'] == username), None)
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400

    user_id = generate_user_id()
    new_user = {
        'user_id': user_id,
        'username': username,
        'password': password,
        "role":role,
        "email":email,
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
        return jsonify({'error': 'Incorrrect email or password'})

    # Perform login logic here

    return jsonify({'message': 'Login successful'})

if __name__ == '__main__':
    app.run(debug=True, port=11000)
