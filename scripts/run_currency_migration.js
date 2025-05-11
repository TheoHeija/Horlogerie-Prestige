// Script to run the currency migration on the Supabase database
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load environment variables from project root

// Using environment variables for Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gxsfbcgkythnelmrezoa.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create Supabase client
console.log('Connecting to Supabase...');
console.log('Using URL:', supabaseUrl);
console.log('Using key:', supabaseAnonKey ? 'Key is set (hidden for security)' : 'No key provided');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
    try {
        console.log('Reading migration file...');
        const migrationFile = path.join(__dirname, '../supabase/migrations/20250507_convert_usd_to_chf.sql');
        const migrationSql = fs.readFileSync(migrationFile, 'utf8');

        console.log('Running migration to convert USD to CHF...');
        const { error } = await supabase.rpc('exec_sql', { sql: migrationSql });

        if (error) {
            console.error('Migration failed:', error);
            return;
        }

        console.log('Migration successful!');
        console.log('All product prices have been converted from USD to CHF');
    } catch (error) {
        console.error('Error running migration:', error);
    }
}

// Execute the migration
runMigration()
    .then(() => console.log('Done!'))
    .catch(err => console.error('Unhandled error:', err)); 