// Script to run the currency migration on the Supabase database
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Using the same credentials from the app
const supabaseUrl = 'https://gxsfbcgkythnelmrezoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4c2ZiY2dreXRobmVsbXJlem9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODkxMTksImV4cCI6MjA2MTk2NTExOX0.H1lJiSHQB9sOZPLeteCdgAxRg7o1ZI9VRpF2vzX1cMY';

// Create Supabase client
console.log('Connecting to Supabase...');
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