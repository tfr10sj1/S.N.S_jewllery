from flask import Flask, render_template, request, session, jsonify, redirect, send_file, send_from_directory
import os
import sqlite3
from shutil import copyfile

app = Flask(__name__, static_folder='./static')
app.secret_key = 'your_secret_key_here'

# Konfigurera sökvägen till "orders" mappen
app.config['ORDERS_FOLDER'] = os.path.join(app.static_folder, 'orders')

# Processeringsfunktion
def process_image_and_save(name, processed_image):
    # Spara den bearbetade bilden i "orders" mappen
    processed_image_path = os.path.join(app.config['ORDERS_FOLDER'], f'{name}_processed.jpg')
    processed_image.save(processed_image_path)
    return processed_image_path

@app.route('/get_image/<filename>')
def get_image(filename):
    return send_from_directory('static/orders', filename)

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

@app.route('/saveProcessedData', methods=['POST'])

def save_processed_data():
    product_info = session.get('product_info')

    if product_info:
        # Hämta data från session
        product_data = product_info.split(',')
        name = product_data[0]

        # Spara den bearbetade bilden
        processed_image = request.files['processed_image']
        image_filename = f'static/orders/{name}.jpg'  # Uppdaterad sökväg
        processed_image.save(image_filename)

        # Spara information i databasen
        conn = get_items_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO items (name, price, weight, metal_type, image_filename) VALUES (?, ?, ?, ?, ?)',
                       (name, product_data[1], product_data[2], product_data[3], image_filename))
        conn.commit()
        conn.close()

        # Ta bort produktinfo från sessionen
        session.pop('product_info', None)
    return redirect('/index')

# Slutför bearbetning och spara i databasen och orders-mappen
@app.route('/completeProcess', methods=['POST'])
def complete_process():
    product_info = session.get('product_info')
    
    if product_info:
        # Hämta data från session och splitta det
        product_data = product_info.split(',')
        name = product_data[0]
        price = product_data[1]
        weight = product_data[2]
        metal_type = product_data[3]
        
        # Anropa din funktion för att bearbeta bilden
        processed_image = process_image()  # Ersätt med din faktiska funktion
        
        # Spara den bearbetade bilden i "orders" mappen
        processed_image_path = os.path.join(app.config['ORDERS_FOLDER'], f'{name}.jpg')
        processed_image.save(processed_image_path)
        
        # Spara informationen i databasen
        conn = get_items_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO items (name, price, weight, metal_type, image_path) VALUES (?, ?, ?, ?, ?)',
                       (name, price, weight, metal_type, processed_image_path))
        conn.commit()
        conn.close()
        
        # Ta bort produktinfo från sessionen
        session.pop('product_info', None)
    return redirect('/index')

# Visa orderhistorik
@app.route('/orderHistory')
def order_history():
    conn = get_items_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM items')
    order_history = cursor.fetchall()
    conn.close()
    
    return render_template('orderHistory.html', order_history=order_history)

if __name__ == '__main__':
    app.run(debug=True)