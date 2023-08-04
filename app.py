from flask import Flask, render_template, request, session, jsonify, redirect
import sqlite3

app = Flask(__name__, static_folder='./static')
app.secret_key = 'your_secret_key_here'

# Databasanslutning
def get_items_db_connection():
    conn = sqlite3.connect('items.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_webshop_db_connection():
    # Establish a connection to the database
    conn = sqlite3.connect('webshop.db')
    cursor = conn.cursor()

    # Fetch product details from the database
    cursor.execute('SELECT name, price FROM products')
    products = cursor.fetchall()

    conn.close()
    return products

@app.route('/index')
def index():
    products = get_webshop_db_connection() 
    return render_template('index.html', products= products)

# Bearbetningssida
@app.route('/processImage', methods=['POST', 'GET'])
def process_image():
    name = request.args.get('name')
    price = request.args.get('price')
    weight = request.args.get('weight')
    metal_type = request.args.get('metal_type')
    product_info = {'name': name, 'price': price, 'weight': weight, 'metal_type': metal_type}
    
    return render_template('processImage.html', product_info=product_info)

# Slutför bearbetning och spara i databasen
@app.route('/completeProcess', methods=['GET', 'POST'])
def complete_process():
    if request.method == 'POST':
        product_info = session.get('product_info')
        
        if product_info:
            # Hämta data från session och splitta det
            product_data = product_info.split(',')
            name = product_data[0]
            price = product_data[1]
            weight = product_data[2]
            metal_type = product_data[3]
            
            # Spara i databasen
            conn = get_items_db_connection()
            cursor = conn.cursor()
            cursor.execute('INSERT INTO items (name, price, weight, metal_type) VALUES (?, ?, ?, ?)',
                           (name, price, weight, metal_type))
            conn.commit()
            conn.close()
            
            # Ta bort produktinfo från sessionen
            session.pop('product_info', None)
            
            # Skicka en JSON-respons tillbaka med produktinformationen
            response_data = {'status': 'success', 'name': name}
        return jsonify(response_data)
    # Om det är en GET-begäran (när användaren klickar på knappen)
    return redirect('/index')

if __name__ == '__main__':
    app.run(debug=True)