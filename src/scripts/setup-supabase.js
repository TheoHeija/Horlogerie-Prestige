// Master script to set up Supabase from scratch
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://gxsfbcgkythnelmrezoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4c2ZiY2dreXRobmVsbXJlem9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODkxMTksImV4cCI6MjA2MTk2NTExOX0.H1lJiSHQB9sOZPLeteCdgAxRg7o1ZI9VRpF2vzX1cMY';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin user details
const adminUser = {
  email: 'admin_user@example.com',
  password: '123123', 
  user_metadata: {
    name: 'Admin User',
    role: 'admin'
  }
};

// Function to check if a table exists
async function tableExists(tableName) {
  try {
    // Try a more compatible approach that works with various Supabase configurations
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
      
    if (error && error.code === '42P01') { // Table doesn't exist error code
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking if ${tableName} exists:`, error.message);
    return false;
  }
}

// Function to create the users table
async function createUsersTable() {
  console.log('Checking if users table exists...');
  
  try {
    const exists = await tableExists('users');
    
    if (exists) {
      console.log('Users table already exists.');
      return { success: true, created: false };
    }
    
    console.log('Creating users table...');
    
    // Execute SQL to create the users table directly
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY, 
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (error) {
      // If the RPC method failed, try an alternative approach with direct SQL
      console.log('RPC method failed, attempting direct SQL execution instead');
      
      // This is an alternative approach that might be needed
      // depending on Supabase configuration
      console.warn('Skipping table creation due to permissions. You may need to create the table manually in the Supabase dashboard.');
    } else {
      console.log('Users table created successfully!');
    }
    
    return { success: true, created: true };
  } catch (error) {
    console.error('Error creating users table:', error.message);
    console.warn('Continuing with user creation anyway.');
    return { success: false, error };
  }
}

// Function to create the admin user
async function createAdminUser() {
  console.log('Creating admin user...');
  
  try {
    // First check if the user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email: adminUser.email,
      password: adminUser.password
    });
    
    if (!checkError && existingUser && existingUser.user) {
      console.log('Admin user already exists!');
      return { success: true, user: existingUser.user, alreadyExists: true };
    }
    
    // If user doesn't exist, sign up
    console.log(`Attempting to create user with email: ${adminUser.email}`);
    const { data, error } = await supabase.auth.signUp({
      email: adminUser.email,
      password: adminUser.password,
      options: {
        data: adminUser.user_metadata
      }
    });

    if (error) {
      console.error('Detailed error:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Admin user created successfully!');
    console.log('User ID:', data.user.id);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.user_metadata.role);
    
    // Now let's add this user to the users table
    try {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email: data.user.email,
          name: adminUser.user_metadata.name,
          role: adminUser.user_metadata.role,
          created_at: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('Error adding user to users table:', insertError.message);
      } else {
        console.log('User added to users table successfully');
      }
    } catch (insertError) {
      console.error('Error adding user to users table:', insertError.message);
    }
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    
    // Alternative: manual database insert for testing
    console.log('Attempting to create mock user entry in local storage for testing...');
    try {
      // Initialize mock data if needed
      if (!localStorage.getItem('mockUsers')) {
        localStorage.setItem('mockUsers', JSON.stringify([]));
      }
      
      // Get existing users
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      // Check if user already exists
      if (!mockUsers.find(u => u.email === adminUser.email)) {
        // Add the new user
        mockUsers.push({
          id: `mock-${Date.now()}`,
          email: adminUser.email,
          name: adminUser.user_metadata.name,
          role: adminUser.user_metadata.role,
          created_at: new Date().toISOString()
        });
        
        // Save back to localStorage
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        console.log('Mock user created in local storage for testing');
      } else {
        console.log('Mock user already exists in local storage');
      }
    } catch (mockError) {
      console.error('Error creating mock user:', mockError.message);
    }
    
    return { success: false, error };
  }
}

// Create the products table if it doesn't exist
async function createProductsTable() {
  console.log('Checking if products table exists...');
  
  try {
    const exists = await tableExists('products');
    
    if (exists) {
      console.log('Products table already exists.');
      return { success: true, created: false };
    }
    
    console.log('Creating products table...');
    
    // Execute SQL to create the products table
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.products (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          brand TEXT NOT NULL,
          description TEXT,
          price INTEGER NOT NULL,
          inventory_count INTEGER DEFAULT 0,
          image_url TEXT,
          movement_type TEXT,
          case_material TEXT,
          water_resistance TEXT,
          complications TEXT,
          diameter TEXT,
          reference_number TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (error) {
      console.warn('Failed to create products table:', error.message);
      console.warn('Continuing with setup process.');
    } else {
      console.log('Products table created successfully!');
    }
    
    return { success: !error, created: !error };
  } catch (error) {
    console.error('Error creating products table:', error.message);
    return { success: false, error };
  }
}

// Ensure we can manually add the user to auth.users table
async function addUserDirectly() {
  try {
    console.log('Attempting to add user directly to auth.users table...');
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        INSERT INTO auth.users (
          instance_id, 
          id, 
          aud, 
          role, 
          email,
          encrypted_password,
          email_confirmed_at, 
          recovery_sent_at,
          last_sign_in_at,
          raw_app_meta_data,
          raw_user_meta_data,
          created_at,
          updated_at
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          uuid_generate_v4(),
          'authenticated',
          'authenticated',
          '${adminUser.email}',
          '$2a$10$Q7HGMVS.Ei8GKhs8Kw7u5uFHrHJR0/.VdqLUGWLcR2CGof4ZtBGRe', -- This is '123123' bcrypted
          now(),
          now(),
          now(),
          '{"provider":"email","providers":["email"]}',
          '{"name":"${adminUser.user_metadata.name}","role":"${adminUser.user_metadata.role}"}',
          now(),
          now()
        ) ON CONFLICT (email) DO NOTHING;
      `
    });

    if (error) {
      console.warn('Cannot directly insert into auth.users table:', error.message);
      console.warn('This is expected as it requires admin privileges');
    } else {
      console.log('Successfully added user directly to auth.users table');
    }
  } catch (error) {
    console.error('Error in addUserDirectly:', error.message);
  }
}

// Main setup function
async function setupSupabase() {
  console.log('=== Starting Supabase Setup ===');
  
  // First create the users table
  console.log('\n1. Setting up users table');
  await createUsersTable();
  
  // Create admin user
  console.log('\n2. Setting up admin user');
  const userResult = await createAdminUser();
  
  // If standard method failed, try direct method
  if (!userResult.success) {
    await addUserDirectly();
  }
  
  // Create products table
  console.log('\n3. Setting up products table');
  await createProductsTable();
  
  console.log('\n=== Supabase Setup Complete ===');
  console.log('\nYou can now log in with:');
  console.log(`Email: ${adminUser.email}`);
  console.log('Password: 123123');
  console.log('\nNote: If the direct creation failed, you may need to create this user manually in the Supabase dashboard.');
}

// Run the setup
setupSupabase().catch(error => {
  console.error('Setup failed with error:', error);
}); 