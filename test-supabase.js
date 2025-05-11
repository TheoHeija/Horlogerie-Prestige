// Test script to check Supabase connection and create necessary tables
const { createClient } = require('@supabase/supabase-js');

// Using the same credentials from your app
const supabaseUrl = 'https://gxsfbcgkythnelmrezoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4c2ZiY2dreXRobmVsbXJlem9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODkxMTksImV4cCI6MjA2MTk2NTExOX0.H1lJiSHQB9sOZPLeteCdgAxRg7o1ZI9VRpF2vzX1cMY';

// Create Supabase client with debugging
console.log('Starting Supabase test script...');
console.log('Using URL:', supabaseUrl);
console.log('Using key:', supabaseAnonKey.substring(0, 10) + '...');

// Create client with debugging options
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exported utilities for potential future use
module.exports = {
    checkTablePermissions,
    tryCreateTable,
    testInsert,
    analyzeSetup,
    runAnalysis
};

// Function to try creating the products table
async function checkTablePermissions() {
    console.log('\nChecking table permissions...');

    try {
        // Simple test to see if we can access any tables at all
        console.log('Trying to query existing tables...');
        const { data, error } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public');

        if (error) {
            console.log('Not allowed to directly query system tables');
            return false;
        }

        console.log('Available tables:', data);
        return true;
    } catch (error) {
        console.error('Permission check failed:', error);
        return false;
    }
}

// Simple function to try to create the products table directly
async function tryCreateTable() {
    console.log('\nAttempting to create products table directly...');

    try {
        // This might fail as anonymous users typically don't have permissions to create tables
        const { data, error } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        inventory_count INTEGER DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        if (error) {
            console.error('Failed to create table:', JSON.stringify(error));
            return false;
        }

        console.log('Table creation attempt succeeded:', data);
        return true;
    } catch (error) {
        console.error('Table creation attempt failed with exception:', error);
        return false;
    }
}

// Function to test if we can insert data
async function testInsert() {
    console.log('\nTrying to insert sample product...');

    // Try inserting a simple product to see if the table exists
    const sampleProduct = {
        name: 'Test Watch',
        description: 'A test watch for connection validation',
        price: 999,
        inventory_count: 1
    };

    try {
        const { data, error } = await supabase
            .from('products')
            .insert(sampleProduct)
            .select();

        if (error) {
            console.error('Insert failed:', JSON.stringify(error));
            return false;
        }

        console.log('Insert successful:', data);
        return true;
    } catch (error) {
        console.error('Insert test failed with exception:', error);
        return false;
    }
}

// Function to analyze the current setup and provide recommendations
async function analyzeSetup() {
    console.log('\n==========================================');
    console.log('SUPABASE CONNECTION ANALYSIS');
    console.log('==========================================');

    // First test if we can query
    console.log('\nTest 1: Simple Query Test');
    try {
        console.log('Attempting to query products table...');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(5);

        if (error) {
            console.log('❌ Query failed:', error.message);
            if (error.code === '42P01') { // Relation does not exist
                console.log('   Diagnosis: The products table does not exist');
            }
        } else {
            console.log('✅ Query successful, returned', data?.length || 0, 'records');
            if (data?.length) {
                console.log('   Sample data:', data[0]);
            }
        }
    } catch (error) {
        console.log('❌ Query failed with exception:', error.message);
    }

    // Test table creation permission
    console.log('\nTest 2: Table Creation Permission');
    try {
        const canCreateTable = await tryCreateTable();
        if (canCreateTable) {
            console.log('✅ Table creation permission: YES');
        } else {
            console.log('❌ Table creation permission: NO');
        }
    } catch (error) {
        console.log('❌ Table creation test error:', error.message);
    }

    // Print recommendations
    console.log('\n==========================================');
    console.log('RECOMMENDATIONS');
    console.log('==========================================');
    console.log('1. Create the necessary tables in the Supabase dashboard');
    console.log('   - Log in to the Supabase dashboard');
    console.log('   - Go to the SQL Editor');
    console.log('   - Run the following SQL:');
    console.log(`
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  inventory_count INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  status TEXT DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
  `);

    console.log('2. Fix the testConnection and createProductsTableIfNotExists functions');
    console.log('   - Update these functions in src/utils/supabase.js to remove the mock data fallback');
    console.log('   - They should properly test the connection and create tables if needed');

    console.log('3. Insert initial data into the tables');
    console.log('   - You can use the Supabase dashboard or run an SQL insert script');

    console.log('\n==========================================');
}

// Run the analysis
async function runAnalysis() {
    console.log('Starting Supabase connection analysis...');
    await analyzeSetup();
    console.log('Analysis completed');
}

// Start the analysis
try {
    runAnalysis()
        .then(() => console.log('Script execution completed'))
        .catch(err => console.error('Unhandled promise rejection:', err));
} catch (e) {
    console.error('Fatal error:', e);
} 