import os
import psycopg2
from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "secret_manager"

# Настройки подключения к PostgreSQL
DB_NAME = os.getenv("POSTGRES_DB")
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("POSTGRES_HOST")
DB_PORT = os.getenv("POSTGRES_PORT")

def get_db_connection():
    return psycopg2.connect(
	dbname=DB_NAME,
	user=DB_USER,
	password=DB_PASSWORD,
	host=DB_HOST,
	port=DB_PORT
   )

@app.route('/')
def home():
    if 'manager_logged_in' not in session:
        return redirect(url_for('login'))
    return render_template('manager_home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username == "admin" and password == "main12!@":
            session['manager_logged_in'] = True
            flash("Вход успешен")
            return redirect(url_for('home'))
        else:
            flash("Неверное имя пользователя или пароль")
            return redirect(url_for('login'))
    return render_template('manager_login.html')

@app.route('/logout')
def logout():
    session.pop('manager_logged_in', None)
    flash('Вы вышли из аккаунта')
    return redirect(url_for('login'))

@app.route('/orders')
def view_orders():
    if 'manager_logged_in' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT orders.id, users.username, orders.items, orders.total, orders.created_at
        FROM orders
        INNER JOIN users ON orders.user_id = users.id
    ''')
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return render_template('orders.html', orders=orders)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7001, debug=True)
