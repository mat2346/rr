const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.qobedozcifsrfdoktwrv:8FLiKvwU8z@MJ3@@aws-1-us-east-1.pooler.supabase.com:5432/postgres',
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT COUNT(*) FROM medicamento');
  console.log('MEDICAMENTOS COUNT:', res.rows[0].count);
  await client.end();
}

run().catch(console.error);
