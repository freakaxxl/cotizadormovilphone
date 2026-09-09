import {mkdir,readFile,writeFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});await cp('src','dist',{recursive:true});
const url=process.env.SUPABASE_URL||'',anon=process.env.SUPABASE_ANON_KEY||'';
if(Boolean(url)!==Boolean(anon))throw Error('Configura ambas variables de Supabase.');
if(url&&!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url))throw Error('URL Supabase inválida');
if(anon.startsWith('sb_secret_'))throw Error('No uses claves secretas.');
if(anon.split('.').length===3){const payload=JSON.parse(Buffer.from(anon.split('.')[1],'base64url'));if(payload.role!=='anon')throw Error('Usa exclusivamente la clave anon pública.');}
await writeFile('dist/config.js',`export default ${JSON.stringify({url,anon})};\n`);
const original=JSON.parse(await readFile('data/catalogo-original.json','utf8')).servicios;
const rows=original.map(s=>({...s,status:'confirmar',active:true}));
// El catálogo no se distribuye públicamente cuando existe autenticación configurada.
await writeFile('dist/catalogo.json',JSON.stringify(url?[]:rows));
const esc=s=>"'"+s.replaceAll("'","''")+"'";
await writeFile('supabase/02-catalogo.sql','-- Importación idempotente: no sobrescribe ediciones posteriores.\n'+rows.map(s=>`insert into public.services(id,data) values (${esc(s.service_id)},${esc(JSON.stringify(s))}::jsonb) on conflict(id) do nothing;`).join('\n'));
console.log(`Build correcto: ${rows.length} registros preservados. ${url?'Acceso autenticado':'Consulta sin conexión configurada'}.`);
