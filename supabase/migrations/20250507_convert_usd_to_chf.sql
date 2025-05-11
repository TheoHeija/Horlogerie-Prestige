-- Migration: Convert product prices from USD to CHF
-- Date: 2025-05-07
-- Description: This migration converts all product prices from USD to CHF using an exchange rate of 0.90

-- Add a comment to the products table to indicate currency is CHF
COMMENT ON COLUMN products.price IS 'Product price in CHF';

-- Convert all existing product prices from USD to CHF (rate: 0.90)
UPDATE products 
SET price = price * 0.90;

-- Update any sample orders to use the new CHF prices
UPDATE orders o
SET total_price = total_price * 0.90;

-- Log the currency change
INSERT INTO _migrations (name, description, executed_at)
VALUES (
  '20250507_convert_usd_to_chf',
  'Converted all product prices from USD to CHF using an exchange rate of 0.90',
  CURRENT_TIMESTAMP
)
ON CONFLICT (name) DO NOTHING; 