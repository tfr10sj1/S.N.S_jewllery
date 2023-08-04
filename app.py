import logging
import sqlite3
import os
import json

import uuid
from flask import Flask, jsonify, render_template, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from flask_session import Session

app = Flask(__name__, static_folder='./static')

@app.route('/')
def index():
    # Establish a connection to the database
    conn = sqlite3.connect('webshop.db')
    cursor = conn.cursor()

    # Fetch product details from the database
    cursor.execute('SELECT name, price FROM products')
    products = cursor.fetchall()

    conn.close()
    return render_template('index.html', products=products)

@app.route('/processImage' , methods=['GET'])
def bildbearbetning():
    return render_template('processImage.html')

if __name__ == '__main__':
    app.run()
