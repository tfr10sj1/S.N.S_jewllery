import json
from flask import Flask, render_template, request, session, jsonify, redirect, send_from_directory, url_for
import os
import sqlite3
from shutil import copyfile
import logging


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
        try:
            # Hämta data från session
            product_data = product_info.split(',')
            name = product_data[0]

            # Spara den bearbetade bilden
            processed_image = request.files['processed_image']
            session_num = session.get("session_num", 0)
            image_num = session.get("image_num", 1)
            image_filename = os.path.join(app.config['ORDERS_FOLDER'], f'{session_num}_{image_num}.png')
            processed_image.save(image_filename)
            session["image_num"] = image_num + 1

            # Spara information i databasen
            conn = get_items_db_connection()  # Ersätt med din funktion för att få en databasanslutning
            cursor = conn.cursor()
            cursor.execute('INSERT INTO items (name, price, weight, metal_type, image_url) VALUES (?, ?, ?, ?, ?)',
                           (name, product_data[1], product_data[2], product_data[3], os.path.basename(image_filename)))

            conn.commit()
            conn.close()

            # Ta bort produktinfo från sessionen
            session.pop('product_info', None)

            return redirect('/index')
        except Exception as e:
            logging.error(str(e))
            return jsonify({'error': 'Ett fel uppstod vid bearbetningen av datan.'}), 500
    else:
        return jsonify({'error': 'Produktinfo saknas i sessionen.'}), 400

@app.route('/save', methods=['POST'])
def save_image():
    try:
        uploaded_file = request.files.get('image')
        if not uploaded_file:
            return jsonify({'error': 'Ingen fil har laddats upp.'}), 400

        if uploaded_file.filename == '':
            return jsonify({'error': 'Tomt filnamn. Ingen fil har laddats upp.'}), 400

        product_info = json.loads(request.form.get('product_info'))  # Hämta produktinformationen som JSON
        print("Produktinformation:", product_info)

        # Hämta session-numret och bild-numret
        session_num = session.get("session_num", 0)
        print('Session-number:', session_num)
        image_num = session.get("image_num", 1)

      # Generera filnamnet med session-nummer och bild-nummer
        image_filename = os.path.join(app.config['ORDERS_FOLDER'], f'{session_num}_{image_num}.png')
        uploaded_file.save(image_filename)
        session["image_num"] = image_num + 1
        print('image_filename', image_filename)
        # Spara produktinformationen i databasen
        conn = get_items_db_connection()  # Ersätt med din funktion för att få en databasanslutning
        cursor = conn.cursor()
        cursor.execute('INSERT INTO items (session_num, name, price, weight, metal_type, image_url) VALUES (?, ?, ?, ?, ?, ?)',
               (session_num, product_info['name'], product_info['price'], product_info['weight'], product_info['metal_type'], os.path.basename(image_filename)))

        conn.commit()
        conn.close()
        return jsonify({'message': 'Bilden har sparats på servern.'})
    except Exception as e:
        logging.error(str(e))
        return jsonify({'error': f'Ett fel uppstod vid sparandet av bilden och produktinformationen: {str(e)}'}), 500
    
@app.route('/cart')
def cart():
    try:
        session_num = session.get('session_num', 0)

        conn = get_items_db_connection()  # Ersätt med din funktion för att få en databasanslutning
        cursor = conn.cursor()
        cursor.execute('SELECT name, price, weight, metal_type, image_url, id FROM items WHERE session_num = ?', (session_num,))
        ordered_items = cursor.fetchall()

        total_price = sum(item['price'] for item in ordered_items)  # Beräkna totalpriset

        conn.close()

        return render_template('cart.html', ordered_items=ordered_items, total_price=total_price)
    except Exception as e:
        logging.error(str(e))
        return render_template('cart.html', ordered_items=[], total_price=0)

@app.route('/remove_item/<item_id>', methods=['POST'])
@app.route('/remove_item/<int:item_id>', methods=['POST'])
def remove_item(item_id):
    try:
        # Hämta produktinformation från databasen
        conn = get_items_db_connection()  # Anpassa detta enligt ditt system
        cursor = conn.cursor()
        cursor.execute('SELECT image_url FROM items WHERE id = ?', (item_id,))
        item = cursor.fetchone()
        
        if item:
            # Ta bort produkten från databasen
            cursor.execute('DELETE FROM items WHERE id = ?', (item_id,))
            conn.commit()
            
            # Ta bort bilden från orders-mappen
            image_path = os.path.join('static', 'orders', item[0])
            if os.path.exists(image_path):
                os.remove(image_path)
            
            conn.close()
            return {'success': True}
        else:
            return {'success': False}
    except Exception as e:
        logging.error(str(e))
        return {'success': False}
    
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
