const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.yiyfwfvxdseamnelgetf:microservicios2026.@aws-1-us-west-2.pooler.supabase.com:5432/postgres',
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT * FROM medicamento');
  console.log('MEDICAMENTOS:', res.rows);
  await client.end();
}

run().catch(console.error);
