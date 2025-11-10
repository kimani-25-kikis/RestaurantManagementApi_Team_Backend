import { serve } from '@hono/node-server';
import { type Context, Hono } from 'hono';
// import RestaurantRoutes from './restaurants/restaurant.routes.ts';
import userRoutes from './users/user.routes.ts';
import  initDatabaseConnection  from './db/db.config.js'
import {logger} from 'hono/logger'
import { prometheus } from '@hono/prometheus';
import { limiter } from './middleware/rateLimiter.ts';
import authRoutes from './auth/auth.routes.ts';
import restaurantRoutes from './restaurants/restaurant.routes.ts';
import MenuItemRoutes from './Menu/MenuItem.routes.ts';
import OrderItemRoutes from './orderitem/orderitem.routes.ts';
import CategoryRoutes from './Categories/Categories.routes.ts';
import OrdersRoutes from './Orders/Orders.routes.ts';

const app = new Hono();

//prometheus middleware
const {printMetrics, registerMetrics} =  prometheus()

app.use('*', registerMetrics); //prometheus to monitor metrics
app.get('/metrics', printMetrics); //endpoint to expose metrics

// Apply logger middleware
app.use('*', logger()); //logs request and response to the console

// Apply rate limiter middleware
app.use(limiter);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Kimani Restaurant'
    
  });
});

// API routes
app.get('/api', (c:Context) => {
  return c.json({
    message: 'Welcome to our maiden Restaurant. How can we help you?',
    
  },200);
});


// 404 handler
app.notFound((c: Context) => {
  return c.json({
    success: false,
    message: 'Route not found',
    path: c.req.path
  }, 404);
});

// Mount API routes
// app.route("/api", todoRoutes);
app.route("api", userRoutes);
app.route("api", authRoutes);
app.route("api", restaurantRoutes);
app.route("api", MenuItemRoutes); 
app.route("api", OrderItemRoutes);
app.route("/api", userRoutes);
app.route("/api", authRoutes);
app.route("/api", restaurantRoutes);
app.route("/api", OrdersRoutes);
app.route("/api", CategoryRoutes);


const port = Number(process.env.PORT) || 3000;


// Establish DB connection and then start the server
initDatabaseConnection()
  .then(() => {
    // Start the server only after DB connection is established
    serve({
      fetch: app.fetch,
      port
    }, (info) => {
      console.log(`🚀 Server is running on http://localhost:${info.port}`);
    })
  }).catch((error) => {
    console.error('Failed to initialize database connection:', error);
  });


