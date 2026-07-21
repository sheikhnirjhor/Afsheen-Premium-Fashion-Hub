import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Mock Database (Real App-এ MongoDB বা PostgreSQL কানেক্ট করবেন)
let products = [
  {
    id: 'p23',
    name: 'Luna Crescent Quilted Ladies Bag',
    category: 'Ornaments',
    description: 'An elegant crescent-shaped quilted leather shoulder bag...',
    price: 13500.00,
    stock: 14,
    image: '/src/assets/images/crescent_ladies_bag.jpg',
    sizes: ['One Size'],
    rating: 4.9,
    reviewsCount: 11,
    isNewArrival: true,
    isBestSeller: true
  },
  {
    id: 'p1',
    name: 'Dhakai Jamdani Heritage Saree',
    category: 'Clothing',
    description: 'Breathtaking original hand-loomed Dhakaiya Jamdani saree...',
    price: 24500.00,
    stock: 12,
    image: '/src/assets/images/blue_dhakai_jamdani.jpg',
    sizes: ['One Size'],
    rating: 4.9,
    reviewsCount: 14,
    isNewArrival: true,
    isBestSeller: true
  }
];

let orders = [];
let reviews = [];
let users = [
  {
    email: 'ayesha@example.com',
    name: 'Ayesha Rahman',
    phone: '+880 1711-092834',
    address: 'Dhanmondi, Dhaka',
    role: 'customer'
  },
  {
    email: 'admin@afsheen.com',
    name: 'Sheikh Afsheen',
    phone: '+880 1819-888990',
    address: 'Gulshan 2, Dhaka',
    role: 'admin'
  }
];

// --- API ENDPOINTS ---

// 1. Get Products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 2. Add New Product (Admin)
app.post('/api/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: 'p' + (products.length + 1),
    rating: 5.0,
    reviewsCount: 0
  };
  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// 3. Update Product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.map(p => p.id === id ? { ...p, ...req.body } : p);
  res.json({ message: 'Product updated successfully' });
});

// 4. Delete Product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ message: 'Product deleted' });
});

// 5. Get Orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// 6. Create Order (Checkout)
app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    ...req.body
  };
  orders.unshift(newOrder);

  // Update product stock
  req.body.items.forEach(item => {
    const prod = products.find(p => p.id === item.product.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  res.status(201).json(newOrder);
});

// 7. Update Order Status
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  orders = orders.map(o => o.id === id ? { ...o, status } : o);
  res.json({ message: 'Order status updated' });
});

// 8. Add Review
app.post('/api/reviews', (req, res) => {
  const newReview = {
    id: 'rev-' + (reviews.length + 1),
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  reviews.unshift(newReview);
  res.status(201).json(newReview);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Afsheen Atelier Backend running on port ${PORT}`);
});
