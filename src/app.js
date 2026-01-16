const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const productRoutes = require('./routes/product.routes');
const customerRoutes = require('./routes/customer.routes');
const salesOrderRoutes = require('./routes/salesOrder.routes');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Thaha Inventory API.' });
});

app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/suppliers', require('./routes/supplier.routes'));
app.use('/api/delivery-orders', require('./routes/deliveryOrder.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/sales-returns', require('./routes/salesReturn.routes'));
app.use('/api/purchase-orders', require('./routes/purchaseOrder.routes'));
app.use('/api/stock-movements', require('./routes/stockMovement.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/roles', require('./routes/role.routes'));

module.exports = app;
