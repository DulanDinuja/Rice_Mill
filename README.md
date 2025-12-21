# SAMEERA RICE MILL - Management System

A comprehensive web-based management system for rice mill operations, designed to streamline inventory management, order tracking, production records, and sales transactions.

## Features

- **Dashboard**: Overview of all rice mill operations
- **Inventory Management**: Track raw materials and finished products
- **Order Management**: Manage customer orders with status tracking
- **Production Records**: Record and monitor production activities
- **Sales Tracking**: Track sales transactions and revenue

## Technology Stack

- **Backend**: Python Flask
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML, CSS, JavaScript
- **API**: RESTful API endpoints

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/DulanDinuja/Rice_Mill.git
cd Rice_Mill
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your web browser and navigate to:
```
http://localhost:5000
```

## Usage

### Dashboard
The main dashboard provides quick access to all modules and an overview of the rice mill operations.

### Inventory Management
- Add new inventory items with name, quantity, and unit
- View all inventory items in a sortable table
- Delete inventory items when needed

### Order Management
- Create new customer orders
- Track order status (Pending, Processing, Completed, Cancelled)
- View order history
- Delete orders

### Production Records
- Record production activities
- Track raw material input and finished product output
- View production history
- Delete production records

### Sales Tracking
- Record sales transactions
- Automatic total amount calculation
- View sales history
- Delete sales records

## API Endpoints

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new inventory item
- `PUT /api/inventory/<id>` - Update inventory item
- `DELETE /api/inventory/<id>` - Delete inventory item

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/<id>` - Update order
- `DELETE /api/orders/<id>` - Delete order

### Production
- `GET /api/production` - Get all production records
- `POST /api/production` - Add new production record
- `DELETE /api/production/<id>` - Delete production record

### Sales
- `GET /api/sales` - Get all sales records
- `POST /api/sales` - Add new sale
- `DELETE /api/sales/<id>` - Delete sale

## Database Schema

The application uses SQLite database with the following tables:

- **Inventory**: id, item_name, quantity, unit, date_added
- **Order**: id, customer_name, product, quantity, total_price, status, order_date
- **Production**: id, raw_material, raw_quantity, finished_product, finished_quantity, production_date
- **Sale**: id, product, quantity, price_per_unit, total_amount, customer_name, sale_date

## Development

The application automatically creates the database on first run. The database file `rice_mill.db` will be created in the project root directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For any queries or support, please contact the project maintainer.
