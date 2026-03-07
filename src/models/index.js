const sequelize = require('../config/db');
const Product = require('./Product');
const Customer = require('./Customer');
const Supplier = require('./Supplier');
const SalesOrder = require('./SalesOrder');
const SalesOrderItem = require('./SalesOrderItem');
const DeliveryOrder = require('./DeliveryOrder');
const Invoice = require('./Invoice');
const Payment = require('./Payment');
const SalesReturn = require('./SalesReturn');
const PurchaseOrder = require('./PurchaseOrder');
const PurchaseOrderItem = require('./PurchaseOrderItem');
const StockMovement = require('./StockMovement');
const Category = require('./Category');
const InvoiceItem = require('./InvoiceItem');
const DeliveryOrderItem = require('./DeliveryOrderItem');
const Color = require('./Color');

const Role = require('./Role');
const User = require('./User');

// Product Associations
Product.hasMany(SalesOrderItem, { foreignKey: 'productId' });
SalesOrderItem.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(PurchaseOrderItem, { foreignKey: 'productId' });
PurchaseOrderItem.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(StockMovement, { foreignKey: 'productId' });
StockMovement.belongsTo(Product, { foreignKey: 'productId' });

StockMovement.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(StockMovement, { foreignKey: 'userId' });

Product.hasMany(InvoiceItem, { foreignKey: 'productId' });
InvoiceItem.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(DeliveryOrderItem, { foreignKey: 'productId' });
DeliveryOrderItem.belongsTo(Product, { foreignKey: 'productId' });



Product.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Product, { foreignKey: 'supplierId' });

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

// Product-Color Many-to-Many
Product.belongsToMany(Color, { through: { model: 'ProductColors', unique: false }, foreignKey: 'productId', as: 'Colors' });
Color.belongsToMany(Product, { through: { model: 'ProductColors', unique: false }, foreignKey: 'colorId' });

// Customer Associations
Customer.hasMany(SalesOrder, { foreignKey: 'customerId' });
SalesOrder.belongsTo(Customer, { foreignKey: 'customerId' });

Customer.hasMany(Invoice, { foreignKey: 'customerId' });
Invoice.belongsTo(Customer, { foreignKey: 'customerId' });

Customer.hasMany(Payment, { foreignKey: 'customerId' });
Payment.belongsTo(Customer, { foreignKey: 'customerId' });

Customer.hasMany(DeliveryOrder, { foreignKey: 'customerId' });
DeliveryOrder.belongsTo(Customer, { foreignKey: 'customerId' });

// Supplier Associations
Supplier.hasMany(PurchaseOrder, { foreignKey: 'supplierId' });
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });

// Sales Order Associations
SalesOrder.hasMany(SalesOrderItem, { foreignKey: 'salesOrderId', as: 'items' });
SalesOrderItem.belongsTo(SalesOrder, { foreignKey: 'salesOrderId' });

SalesOrder.hasOne(DeliveryOrder, { foreignKey: 'salesOrderId' });
DeliveryOrder.belongsTo(SalesOrder, { foreignKey: 'salesOrderId' });

DeliveryOrder.hasMany(DeliveryOrderItem, { foreignKey: 'deliveryOrderId', as: 'items' });
DeliveryOrderItem.belongsTo(DeliveryOrder, { foreignKey: 'deliveryOrderId' });

SalesOrder.hasMany(Invoice, { foreignKey: 'salesOrderId' });
Invoice.belongsTo(SalesOrder, { foreignKey: 'salesOrderId' });

// Invoice Associations
Invoice.hasMany(SalesReturn, { foreignKey: 'invoiceId' });
SalesReturn.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Invoice.hasMany(Payment, { foreignKey: 'invoiceId' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId' });


// Purchase Order Associations
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'purchaseOrderId', as: 'items' });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId' });

// Role Associations
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

const models = {
    Product,
    Customer,
    Supplier,
    SalesOrder,
    SalesOrderItem,
    DeliveryOrder,
    Invoice,
    InvoiceItem,
    Payment,
    SalesReturn,
    PurchaseOrder,
    PurchaseOrderItem,
    StockMovement,
    Category,
    Role,
    User,
    Color,
    DeliveryOrderItem
};

// Force all table names to lowercase for cross-platform compatibility
Object.values(models).forEach(model => {
    if (model.tableName) {
        model.tableName = model.tableName.toLowerCase();
    }
});

module.exports = { sequelize, models };
