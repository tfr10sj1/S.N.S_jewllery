from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)
@app.route('/get_items')
def get_items():
    # Anslut till din SQLite-databas och hämta data
    db_connection = sqlite3.connect('items.db')
    cursor = db_connection.cursor()
    cursor.execute('SELECT * FROM items')
    data = cursor.fetchall()
    db_connection.close()

    # Returnera data som JSON
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
