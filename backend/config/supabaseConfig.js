const { createClient } = require('@supabase/supabase-js');

// Pon tus variables de entorno (o pégalas directo para probar)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false
  }
});

module.exports = { supabase };