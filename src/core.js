export const norm = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/([a-z])([0-9])/g,'$1 $2').replace(/([0-9])([a-z])/g,'$1 $2').replace(/[^a-z0-9]+/g,' ').trim();
export function model(s) { return s.modelo.replace(/\b(INCELL|OLED|ORIGINAL|OEM|TFT|AMOLED)\b/gi,'').replace(/\s+/g,' ').trim(); }
export function title(s) { let m=model(s), brand=String(s.marca||'').trim(); while(brand&&m.toLowerCase().startsWith(brand.toLowerCase()+' '))m=m.slice(brand.length).trim(); return /iphone/i.test(s.familia) && !/iphone/i.test(m) ? `iPhone ${m}` : `${brand} ${m}`.trim(); }
export const key = s => norm(`${s.marca} ${title(s)}`);
function distance(a,b) { let row=Array.from({length:b.length+1},(_,i)=>i); for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]!==b[j-1]));row=next;}return row[b.length]; }
export const searchNorm=v=>norm(v).replace(/\b(display|displays|pantallas)\b/g,'pantalla').replace(/\b(baterias|battery)\b/g,'bateria').replace(/\b(camaras)\b/g,'camara');
export function score(s,q){q=searchNorm(q);if(!q)return 1;const name=searchNorm(title(s)), device=searchNorm(`${s.marca} ${s.familia} ${title(s)}`), hay=searchNorm(`${device} ${s.servicio} ${s.calidad} ${s.variante}`), words=hay.split(' '),tokens=q.split(' ').filter(t=>!['de','del','para','el','la'].includes(t));
for(const n of q.match(/\b\d+\b/g)||[])if(!device.split(' ').includes(n))return 0;
for(const pair of q.matchAll(/\b([a-z]+) (\d+)\b/g)){if(pair[1].length<=2&&!device.includes(pair[0]))return 0;}
if(name===q||searchNorm(model(s))===q)return 1000;
if(tokens.every(t=>words.includes(t)))return 800-name.length;
if(tokens.every(t=>words.some(w=>w===t||(!/\d/.test(t)&&t.length>=3&&w.startsWith(t)))))return 500-name.length;
if(tokens.every(t=>words.some(w=>w===t||(!/\d/.test(t)&&t.length>3&&distance(t,w)<=1))))return 100;return 0; }
export function serviceIntent(q){return /\b(pantalla|bateria|camara|carga|bocina|microfono|auricular|software|diagnostico|tapa|reballing)\b/.test(searchNorm(q));}
export function groups(rows,q='',includeInactive=false){const map=new Map();for(const s of rows){if(s.active===false&&!includeInactive)continue;const k=key(s);if(!map.has(k))map.set(k,{key:k,title:title(s),services:[],score:0});const g=map.get(k);g.services.push(s);g.score=Math.max(g.score,score(s,q));}return [...map.values()].filter(g=>g.score>0).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title));}
export function state(s,now=Date.now()){if(s.requiere_diagnostico||s.status==='diagnostico')return 'diagnostico';const date=Date.parse(s.ultima_actualizacion?.length===7?s.ultima_actualizacion+'-01':s.ultima_actualizacion);return s.status==='autorizado'&&Number.isFinite(s.precio_publico)&&s.precio_publico>0&&Number.isFinite(date)&&now>=date&&now-date<=90*86400000?'autorizado':'confirmar';}
export const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(n);
export function quote(rows,branch){if(!rows.length||rows.some(s=>state(s)!=='autorizado'||s.active===false))throw Error('Solo se pueden cotizar precios autorizados y vigentes.');return `Hola. En MovilPhone ${branch}:\n\n`+rows.map(s=>`${title(s)} · ${s.servicio} · ${s.calidad}${s.variante?' · '+s.variante:''}\n${money(s.precio_publico)} con instalación. Garantía: ${s.garantia}. Tiempo estimado: ${s.tiempo_estimado}.`).join('\n\n')+`\n\nTotal estimado: ${money(rows.reduce((a,s)=>a+s.precio_publico,0))}. Sujeto a revisión física y disponibilidad. ¿Te ayudamos a revisar tu equipo?`;}
