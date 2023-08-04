import logging
import sqlite3
import os
import bcrypt

import uuid
from flask import Flask, jsonify, render_template, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from flask_session import Session

app = Flask(__name__, static_folder='./static')

@app.route('/teplates' , methods=['GET'])
def index():
    # Establish a connection to the database
    conn = sqlite3.connect('webshop.db')
    cursor = conn.cursor()

    # Fetch the product information from the database
    cursor.execute('SELECT name, price, metal_type FROM products')
    products = cursor.fetchall()

    conn.close()
    print(products)
    return render_template('index.html', products=products)

@app.route('/bildbearbetning' , methods=['POST'])
def bildbearbetning():
    return render_template('Bildbearbetning.html')

if __name__ == '__main__':
    app.run()
