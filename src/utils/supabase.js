import { createClient } from '@supabase/supabase-js';

// Original URL with potential issues
// const supabaseUrl = 'https://gxsfbcgkythnelmrezoa.supabase.co';
// Updated URL with correct format - using direct API endpoint 
const supabaseUrl = 'https://gxsfbcgkythnelmrezoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4c2ZiY2dreXRobmVsbXJlem9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODkxMTksImV4cCI6MjA2MTk2NTExOX0.H1lJiSHQB9sOZPLeteCdgAxRg7o1ZI9VRpF2vzX1cMY';

// Create Supabase client with debug logging
console.log('Creating Supabase client with URL:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true
    }
});

// Mock data system as fallback when Supabase fails
console.log('Setting up local storage fallback system for data persistence');

// Initialize mock data in localStorage if not already present
const initializeMockData = () => {
    // Check if mock data is already initialized
    if (!localStorage.getItem('mockDataInitialized')) {
        console.log('Initializing mock data in localStorage');

        // Sample users
        const mockUsers = [
            {
                id: '1',
                email: 'admin@example.com',
                name: 'Admin User',
                role: 'admin',
                created_at: '2023-01-01T00:00:00.000Z'
            },
            {
                id: '2',
                email: 'user@example.com',
                name: 'Regular User',
                role: 'user',
                created_at: '2023-01-02T00:00:00.000Z'
            }
        ];

        // Sample products with prices in CHF (converted from USD with rate 0.90)
        const mockProducts = [
            {
                id: '1',
                name: 'Royal Oak',
                brand: 'Audemars Piguet',
                description: 'A luxury sports watch with octagonal bezel',
                price: 22500, // Converted from 25000 USD to CHF
                inventory_count: 5,
                image_url: 'https://example.com/watch1.jpg',
                movement_type: 'Automatic',
                case_material: 'Stainless Steel',
                water_resistance: '50m',
                complications: 'Date',
                diameter: '41',
                reference_number: '15400ST.OO.1220ST.01',
                created_at: '2023-01-01T00:00:00.000Z'
            },
            {
                id: '2',
                name: 'Submariner',
                brand: 'Rolex',
                description: 'Iconic diving watch with rotating bezel',
                price: 10800, // Converted from 12000 USD to CHF
                inventory_count: 8,
                image_url: 'https://example.com/watch2.jpg',
                movement_type: 'Automatic',
                case_material: 'Stainless Steel',
                water_resistance: '300m',
                complications: 'Date',
                diameter: '41',
                reference_number: '126610LN',
                created_at: '2023-01-02T00:00:00.000Z'
            },
            {
                id: '3',
                name: 'Nautilus',
                brand: 'Patek Philippe',
                description: 'Elegant sports watch with porthole-shaped case',
                price: 31500, // Converted from 35000 USD to CHF
                inventory_count: 3,
                image_url: 'https://example.com/watch3.jpg',
                movement_type: 'Automatic',
                case_material: 'Rose Gold',
                water_resistance: '120m',
                complications: 'Date, Moonphase',
                diameter: '40',
                reference_number: '5711/1R-001',
                created_at: '2023-01-03T00:00:00.000Z'
            }
        ];

        // Sample orders with prices in CHF
        const mockOrders = [
            {
                id: '1',
                user_id: '2',
                product_id: '1',
                status: 'completed',
                total_price: 22500, // Converted from 25000 USD to CHF
                created_at: '2023-02-01T00:00:00.000Z',
                users: mockUsers.find(u => u.id === '2'),
                products: mockProducts.find(p => p.id === '1')
            },
            {
                id: '2',
                user_id: '2',
                product_id: '3',
                status: 'processing',
                total_price: 31500, // Converted from 35000 USD to CHF
                created_at: '2023-02-15T00:00:00.000Z',
                users: mockUsers.find(u => u.id === '2'),
                products: mockProducts.find(p => p.id === '3')
            }
        ];

        // Store mock data in localStorage
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
        localStorage.setItem('mockOrders', JSON.stringify(mockOrders));
        localStorage.setItem('mockDataInitialized', 'true');

        console.log('Mock data initialized successfully');
    } else {
        console.log('Mock data already initialized');
    }
};

// Call initialization function
initializeMockData();

// Helper function to generate a unique ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Authentication helpers with mock fallback
export const signIn = async (email, password) => {
    try {
        // Try Supabase first
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.log('Supabase auth failed, falling back to mock auth');
            // Fallback to mock authentication
            const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
            const user = mockUsers.find(u => u.email === email);

            if (user && password === 'password') { // Simple mock password check
                return { data: { user }, error: null };
            }

            return { data: null, error: { message: 'Invalid login credentials' } };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Auth error:', error);
        return { data: null, error };
    }
};

export const signOut = async () => {
    try {
        // Try Supabase first
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log('Supabase signout failed, using mock signout');
            // Mock signout (nothing to do)
            return { error: null };
        }

        return { error: null };
    } catch (error) {
        console.error('Signout error:', error);
        return { error };
    }
};

export const getSession = async () => {
    try {
        // Try Supabase first
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.log('Supabase session failed, using mock session');
            // Get mock session from localStorage
            const sessionUser = localStorage.getItem('mockSessionUser');
            if (sessionUser) {
                return { session: { user: JSON.parse(sessionUser) }, error: null };
            }

            // Default to first user in mock users
            const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
            if (mockUsers.length > 0) {
                localStorage.setItem('mockSessionUser', JSON.stringify(mockUsers[0]));
                return { session: { user: mockUsers[0] }, error: null };
            }

            return { session: null, error: null };
        }

        return { session: data.session, error: null };
    } catch (error) {
        console.error('Session error:', error);
        return { session: null, error };
    }
};

// Users helpers with mock fallback
export const getUsers = async () => {
    try {
        // Try Supabase first
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.log('Supabase users query failed, using mock data');
            // Get mock users from localStorage
            const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
            return { data: mockUsers, error: null };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Get users error:', error);
        // Fallback to mock data
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        return { data: mockUsers, error: null };
    }
};

export const getUserById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const createUser = async (userData) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const updateUser = async (id, userData) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(userData)
            .eq('id', id)
            .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const deleteUser = async (id) => {
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error };
    }
};

// Orders helpers with mock fallback
export const getOrders = async () => {
    try {
        // Try Supabase first
        const { data, error } = await supabase
            .from('orders')
            .select('*, users(*), products(*)')
            .order('created_at', { ascending: false });

        if (error) {
            console.log('Supabase orders query failed, using mock data');
            // Get mock orders from localStorage
            const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
            return { data: mockOrders, error: null };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Get orders error:', error);
        // Fallback to mock data
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        return { data: mockOrders, error: null };
    }
};

export const getOrderById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, users(*), products(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

// Products helpers with mock fallback
export const getProducts = async () => {
    console.log('Fetching products (will try Supabase first, then fallback to mock data)');
    try {
        // Try Supabase first
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('Supabase products response:', { data, error });

        if (error) {
            console.log('Supabase products query failed, using mock data');
            // Get mock products from localStorage
            const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
            console.log('Using mock products:', mockProducts);
            return { data: mockProducts, error: null };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Get products error:', error);
        // Fallback to mock data
        const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
        console.log('Using mock products due to error:', mockProducts);
        return { data: mockProducts, error: null };
    }
};

export const getProductById = async (id) => {
    try {
        // Try Supabase first
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.log('Supabase product query failed, using mock data');
            // Get mock product from localStorage
            const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
            const product = mockProducts.find(p => p.id === id);
            return { data: product || null, error: null };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Get product error:', error);
        // Fallback to mock data
        const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
        const product = mockProducts.find(p => p.id === id);
        return { data: product || null, error: null };
    }
};

export const createProduct = async (productData) => {
    try {
        // Try Supabase first
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select();

        if (error) {
            console.log('Supabase create product failed, using mock data');
            // Create mock product in localStorage
            const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
            const newProduct = {
                ...productData,
                id: generateId(),
                created_at: new Date().toISOString()
            };
            mockProducts.push(newProduct);
            localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
            return { data: [newProduct], error: null };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Create product error:', error);
        // Fallback to mock data
        const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
        const newProduct = {
            ...productData,
            id: generateId(),
            created_at: new Date().toISOString()
        };
        mockProducts.push(newProduct);
        localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
        return { data: [newProduct], error: null };
    }
};

export const updateProduct = async (id, productData) => {
    try {
        // Try Supabase first
        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select();

        if (error) {
            console.log('Supabase update product failed, using mock data');
            // Update mock product in localStorage
            const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
            const index = mockProducts.findIndex(p => p.id === id);
            if (index !== -1) {
                mockProducts[index] = { ...mockProducts[index], ...productData };
                localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
                return { data: [mockProducts[index]], error: null };
            }
            return { data: null, error: { message: 'Product not found' } };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Update product error:', error);
        // Fallback to mock data
        const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            mockProducts[index] = { ...mockProducts[index], ...productData };
            localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
            return { data: [mockProducts[index]], error: null };
        }
        return { data: null, error };
    }
};

export const deleteProduct = async (id) => {
    try {
        // Try Supabase first
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.log('Supabase delete product failed, using mock data');
            // Delete mock product in localStorage
            const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
            const filteredProducts = mockProducts.filter(p => p.id !== id);
            localStorage.setItem('mockProducts', JSON.stringify(filteredProducts));
            return { error: null };
        }

        return { error: null };
    } catch (error) {
        console.error('Delete product error:', error);
        // Fallback to mock data
        const mockProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
        const filteredProducts = mockProducts.filter(p => p.id !== id);
        localStorage.setItem('mockProducts', JSON.stringify(filteredProducts));
        return { error: null };
    }
};

// Debug function to check available tables
export const listTables = async () => {
    console.log('Attempting to list all tables...');
    try {
        const { data, error } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public');

        console.log('Available tables:', data);
        if (error) {
            console.error('Error fetching tables:', error);
            throw error;
        }
        return { data, error: null };
    } catch (error) {
        console.error('Error in listTables:', error.message, error);
        return { data: null, error };
    }
};

// Test Supabase connectivity
export const testConnection = async () => {
    console.log('Testing Supabase connection...');
    try {
        // Try a simple query to verify connection
        const { error } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public')
            .limit(1);

        if (error) {
            console.error('Connection test failed:', error.message);
            console.log('Using mock data as fallback');
            return { connected: false, mockFallback: true, error: error.message };
        }

        console.log('Connection test successful');
        return { connected: true, mockFallback: false };
    } catch (error) {
        console.error('Connection test error:', error);
        return { connected: false, mockFallback: true, error: error.message };
    }
};

// Create products table if it doesn't exist
export const createProductsTableIfNotExists = async () => {
    console.log('Checking if products table exists...');
    try {
        // First, check if the table exists
        const { data: tables, error: tablesError } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public')
            .eq('tablename', 'products');

        if (tablesError) {
            console.error('Error checking if table exists:', tablesError.message);
            console.log('Using mock data as fallback');
            return { success: false, usingMock: true, error: tablesError.message };
        }

        const tableExists = tables && tables.length > 0;

        if (tableExists) {
            console.log('Products table already exists');
            return { success: true, usingMock: false };
        }

        console.log('Products table does not exist. Please create it using the Supabase dashboard with this SQL:');
        console.log(`
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  inventory_count INTEGER DEFAULT 0,
  image_url TEXT,
  movement_type TEXT,
  case_material TEXT,
  water_resistance TEXT,
  complications TEXT,
  diameter TEXT,
  reference_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`);
        console.log('Using mock data until the real table is created');
        return { success: false, usingMock: true, message: 'Table does not exist. Use Supabase dashboard to create it.' };
    } catch (error) {
        console.error('Error in createProductsTableIfNotExists:', error);
        return { success: false, usingMock: true, error: error.message };
    }
};

// Create service_requests table if it doesn't exist
export const createServiceRequestsTableIfNotExists = async () => {
    console.log('Checking if service_requests table exists...');
    try {
        // First, check if the table exists
        const { data: tables, error: tablesError } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public')
            .eq('tablename', 'service_requests');

        if (tablesError) {
            console.error('Error checking if table exists:', tablesError.message);
            console.log('Using mock data as fallback');
            return { success: false, usingMock: true, error: tablesError.message };
        }

        const tableExists = tables && tables.length > 0;

        if (tableExists) {
            console.log('Service Requests table already exists');
            return { success: true, usingMock: false };
        }

        console.log('Service Requests table does not exist. Please create it using the Supabase dashboard with this SQL:');
        console.log(`
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  watch_brand TEXT NOT NULL,
  watch_model TEXT NOT NULL,
  serial_number TEXT,
  service_type TEXT NOT NULL,
  issue_description TEXT,
  estimated_cost DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'received',
  technician TEXT,
  received_date DATE NOT NULL,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`);
        console.log('Using mock data until the real table is created');
        return { success: false, usingMock: true, message: 'Table does not exist. Use Supabase dashboard to create it.' };
    } catch (error) {
        console.error('Error in createServiceRequestsTableIfNotExists:', error);
        return { success: false, usingMock: true, error: error.message };
    }
}; 