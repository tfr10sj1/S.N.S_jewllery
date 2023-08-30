import json
from flask import Flask, render_template, request, session, jsonify, redirect, send_from_directory
import os
import logging
import firebase_admin
from firebase_admin import credentials, db, firestore

app = Flask(__name__, static_folder='./static')
app.secret_key = 'your_secret_key_here'

cred = credentials.Certificate("credentials.json")
firebase_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://sns-jewllery-default-rtdb.europe-west1.firebasedatabase.app'
})
db_ref = db.reference()

firestore_db = firestore.client()

@app.route('/')
def index():
    try:
        products = get_webshop_from_firestore()
        return render_template('index.html', products=products)
    except Exception as e:
        logging.error(str(e))
        return render_template('index.html', products=[])

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

def get_webshop_from_firestore():
    webshop_ref = firestore_db.collection('webshop')
    webshop_docs = webshop_ref.stream()
    products = []
    for doc in webshop_docs:
        product_data = doc.to_dict()
        products.append({
            'name': product_data.get('name', ''),
            'price': product_data.get('price', 0),
            'weight': product_data.get('weight', 0),
            'metal_type': product_data.get('metal_type', ''),
            'image_url': product_data.get('image_filename', '')
        })
    
    return products

@app.route('/processImage', methods=['POST', 'GET'])
def process_image():
    name = request.args.get('name')
    price = request.args.get('price')
    weight = request.args.get('weight')
    metal_type = request.args.get('metal_type')
    product_info = {'name': name, 'price': price, 'weight': weight, 'metal_type': metal_type}
    
    return render_template('processImage.html', product_info=product_info)

@app.route('/save', methods=['POST'])
def save_image():
    try:
        uploaded_file = request.files.get('image')
        if not uploaded_file:
            return jsonify({'error': 'Ingen fil har laddats upp.'}), 400

        if uploaded_file.filename == '':
            return jsonify({'error': 'Tomt filnamn. Ingen fil har laddats upp.'}), 400

        product_info = json.loads(request.form.get('product_info'))
        session_num = session.get("session_num", 0)
        image_num = session.get("image_num", 1)

        image_filename = f'{session_num}_{image_num}.png'
        uploaded_file.save(os.path.join(app.config['ORDERS_FOLDER'], image_filename))
        session["image_num"] = int(image_num) + 1

        name = product_info['name']
        price = product_info['price']
        weight = product_info['weight']
        metal_type = product_info['metal_type']
       
        save_data_to_realtime_db(name, price, weight, metal_type, image_filename,session_num )

        return jsonify({'message': 'Bilden har sparats på servern.'})
    except Exception as e:
        logging.error(str(e))
        return jsonify({'error': f'Ett fel uppstod vid sparandet av bilden och produktinformationen: {str(e)}'}), 500

def save_data_to_realtime_db(name, price, weight, metal_type, image_filename, session_num):
    items_ref = db_ref.child('items')
    new_item_ref = items_ref.push()
    new_item_ref.set({
        'name': name,
        'price': price,
        'weight': weight,
        'metal_type': metal_type,
        'image_url': image_filename,
        'session_num': session_num
    })
@app.route('/cart')
def cart():
    try:
        session_num = session.get('session_num', 0)
        
        # Hämta produkter från Firebase-databasen
        ordered_items = get_items_from_firebase(session_num)
        total_price = sum(int(item['price']) for item in ordered_items)  # Beräkna totalpriset

        return render_template('cart.html', ordered_items=ordered_items, total_price=total_price)
    except Exception as e:
        logging.error(str(e))
        return render_template('cart.html', ordered_items=[], total_price=0)

def get_items_from_firebase(session_num):
    items_ref = db_ref.child('items')
    ordered_items = []
    query_result = items_ref.get()

    for key, item in query_result.items():
        ordered_items.append(item)
            
    return ordered_items

@app.route('/remove_item/<string:item_id>', methods=['POST'])
def remove_item(item_id):
    try:
        if remove_item_from_firebase(item_id):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False})
    except Exception as e:
        logging.error(str(e))
        return jsonify({'success': False})

def remove_item_from_firebase(item_id):
    items_ref = db_ref.child('items')
    items_ref.child(item_id).delete()
    return True

# Visa orderhistorik
@app.route('/orderHistory')
def order_history():
    try:
        order_history = get_all_items_from_firebase()
        return render_template('orderHistory.html', order_history=order_history)
    except Exception as e:
        logging.error(str(e))
        return render_template('orderHistory.html', order_history=[])

def get_all_items_from_firebase():
    items_ref = db_ref.child('items')
    return items_ref.get()

if __name__ == '__main__':
    app.run(debug=True)
