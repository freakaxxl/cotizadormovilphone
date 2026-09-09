import {test} from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {groups,state,quote} from '../src/core.js';
const rows=JSON.parse(await readFile('data/catalogo-original.json','utf8')).servicios;
for(const q of ['iPhone 11','11','iphone11','IPHONE 11','iphon 11'])test('Busqueda '+q,()=>{assert.equal(groups(rows,q)[0].title,'iPhone 11');assert(groups(rows,q)[0].services.length>=2)});
test('Samsung A15',()=>assert(groups(rows,'Samsung A15').length>0));
test('Agrupa TODOS los servicios aunque consulta incluya pantalla',()=>{const base=rows.find(s=>s.marca==='Apple'&&s.modelo==='11');const all=groups([...rows,{...base,service_id:'battery-test',servicio:'Cambio de batería'}],'iphone 11 pantalla');assert(all[0].services.some(s=>s.servicio==='Cambio de batería'))});
test('Precios antiguos bloqueados',()=>assert(rows.every(s=>state(s)!=='autorizado')));
test('No enviar referencia histórica',()=>assert.throws(()=>quote([rows[0]],'Izamal')));
test('Cotización autorizada y suma',()=>{const s={...rows[0],status:'autorizado',ultima_actualizacion:new Date().toISOString().slice(0,10)};assert.equal(state(s),'autorizado');assert.match(quote([s],'Izamal'),/Total estimado/)});
test('Variantes Pro no se agrupan con 11',()=>{const g=groups(rows,'iphone 11')[0];assert(g.services.every(s=>!s.modelo.toLowerCase().includes('pro')))});
