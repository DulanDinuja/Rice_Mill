from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rice_mill.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'item_name': self.item_name,
            'quantity': self.quantity,
            'unit': self.unit,
            'date_added': self.date_added.strftime('%Y-%m-%d %H:%M:%S')
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    product = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='Pending')
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'product': self.product,
            'quantity': self.quantity,
            'total_price': self.total_price,
            'status': self.status,
            'order_date': self.order_date.strftime('%Y-%m-%d %H:%M:%S')
        }

class Production(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    raw_material = db.Column(db.String(100), nullable=False)
    raw_quantity = db.Column(db.Float, nullable=False)
    finished_product = db.Column(db.String(100), nullable=False)
    finished_quantity = db.Column(db.Float, nullable=False)
    production_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'raw_material': self.raw_material,
            'raw_quantity': self.raw_quantity,
            'finished_product': self.finished_product,
            'finished_quantity': self.finished_quantity,
            'production_date': self.production_date.strftime('%Y-%m-%d %H:%M:%S')
        }

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    price_per_unit = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    sale_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product,
            'quantity': self.quantity,
            'price_per_unit': self.price_per_unit,
            'total_amount': self.total_amount,
            'customer_name': self.customer_name,
            'sale_date': self.sale_date.strftime('%Y-%m-%d %H:%M:%S')
        }

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/inventory')
def inventory():
    return render_template('inventory.html')

@app.route('/orders')
def orders():
    return render_template('orders.html')

@app.route('/production')
def production():
    return render_template('production.html')

@app.route('/sales')
def sales():
    return render_template('sales.html')

# API Routes for Inventory
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    items = Inventory.query.all()
    return jsonify([item.to_dict() for item in items])

@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    data = request.json
    new_item = Inventory(
        item_name=data['item_name'],
        quantity=data['quantity'],
        unit=data['unit']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/api/inventory/<int:id>', methods=['PUT'])
def update_inventory(id):
    item = Inventory.query.get_or_404(id)
    data = request.json
    item.item_name = data.get('item_name', item.item_name)
    item.quantity = data.get('quantity', item.quantity)
    item.unit = data.get('unit', item.unit)
    db.session.commit()
    return jsonify(item.to_dict())

@app.route('/api/inventory/<int:id>', methods=['DELETE'])
def delete_inventory(id):
    item = Inventory.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

# API Routes for Orders
@app.route('/api/orders', methods=['GET'])
def get_orders():
    order_list = Order.query.all()
    return jsonify([order.to_dict() for order in order_list])

@app.route('/api/orders', methods=['POST'])
def add_order():
    data = request.json
    new_order = Order(
        customer_name=data['customer_name'],
        product=data['product'],
        quantity=data['quantity'],
        total_price=data['total_price'],
        status=data.get('status', 'Pending')
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify(new_order.to_dict()), 201

@app.route('/api/orders/<int:id>', methods=['PUT'])
def update_order(id):
    order = Order.query.get_or_404(id)
    data = request.json
    order.customer_name = data.get('customer_name', order.customer_name)
    order.product = data.get('product', order.product)
    order.quantity = data.get('quantity', order.quantity)
    order.total_price = data.get('total_price', order.total_price)
    order.status = data.get('status', order.status)
    db.session.commit()
    return jsonify(order.to_dict())

@app.route('/api/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get_or_404(id)
    db.session.delete(order)
    db.session.commit()
    return '', 204

# API Routes for Production
@app.route('/api/production', methods=['GET'])
def get_production():
    records = Production.query.all()
    return jsonify([record.to_dict() for record in records])

@app.route('/api/production', methods=['POST'])
def add_production():
    data = request.json
    new_record = Production(
        raw_material=data['raw_material'],
        raw_quantity=data['raw_quantity'],
        finished_product=data['finished_product'],
        finished_quantity=data['finished_quantity']
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify(new_record.to_dict()), 201

@app.route('/api/production/<int:id>', methods=['DELETE'])
def delete_production(id):
    record = Production.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return '', 204

# API Routes for Sales
@app.route('/api/sales', methods=['GET'])
def get_sales():
    sale_list = Sale.query.all()
    return jsonify([sale.to_dict() for sale in sale_list])

@app.route('/api/sales', methods=['POST'])
def add_sale():
    data = request.json
    new_sale = Sale(
        product=data['product'],
        quantity=data['quantity'],
        price_per_unit=data['price_per_unit'],
        total_amount=data['total_amount'],
        customer_name=data['customer_name']
    )
    db.session.add(new_sale)
    db.session.commit()
    return jsonify(new_sale.to_dict()), 201

@app.route('/api/sales/<int:id>', methods=['DELETE'])
def delete_sale(id):
    sale = Sale.query.get_or_404(id)
    db.session.delete(sale)
    db.session.commit()
    return '', 204

# Initialize database
def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_db()
    # Debug mode should be disabled in production environments
    # Set environment variable FLASK_ENV=development to enable debug mode
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
