(()=>{
const C=window.FC_CONFIG||{};if(!C.url||!C.key||!window.supabase)return;
const sb=supabase.createClient(C.url,C.key);let user=null,t=null;
const b=document.createElement('button');b.textContent='☁';b.title='Konto & Sync';b.setAttribute('aria-label','Konto und Sync');
b.style.cssText='position:fixed;top:calc(8px + env(safe-area-inset-top,0px));right:8px;z-index:9;min-width:42px';document.body.appendChild(b);
const dlg=document.createElement('dialog');dlg.style.cssText='background:#1d1f22;color:#f2f2f0;border:1px solid #373a40;border-radius:14px;width:min(340px,90%)';document.body.appendChild(dlg);
const q=s=>dlg.querySelector(s);
function ui(msg=''){b.style.color=user?'#4ade80':'';
 dlg.innerHTML=user?`<h3>Sync aktiv</h3><p>${user.email}</p><p class="mu">${msg}</p><button id="cs" class="p">Jetzt synchronisieren</button> <button id="co">Abmelden</button> <button id="cx">Schließen</button>`
 :`<h3>Anmelden</h3><input id="ce" type="email" placeholder="E-Mail" autocomplete="email"><br><br><input id="cp" type="password" placeholder="Passwort (mind. 8 Zeichen)" autocomplete="current-password"><p class="mu">${msg}</p><button id="ci" class="p">Anmelden</button> <button id="cr">Registrieren</button> <button id="cx">Schließen</button>`;
 q('#cx').onclick=()=>dlg.close();
 if(user){q('#cs').onclick=()=>run(sync);q('#co').onclick=async()=>{await sb.auth.signOut()}}
 else{const cred=()=>({email:q('#ce').value.trim(),password:q('#cp').value});
  q('#ci').onclick=async()=>{const{error}=await sb.auth.signInWithPassword(cred());if(error)ui('Fehler: '+error.message)};
  q('#cr').onclick=async()=>{const{data,error}=await sb.auth.signUp(cred());if(error)ui('Fehler: '+error.message);else if(!data.session)ui('Bestätigungs-Mail gesendet. Link öffnen, dann anmelden.')}}}
async function run(f){try{ui(await f())}catch(e){ui('Fehler: '+(e.message||e))}}
async function push(){const{error}=await sb.from('app_state').upsert({user_id:user.id,data:S,updated_at:new Date().toISOString()});if(error)throw error}
async function sync(){const{data,error}=await sb.from('app_state').select('data').maybeSingle();if(error)throw error;
 const R=data&&data.data;
 if(R&&(R.updatedAt||0)>(S.updatedAt||0)){const ids=new Set(R.sessions.map(s=>s.id));R.sessions.push(...S.sessions.filter(s=>!ids.has(s.id)));S=R;
  try{localStorage.setItem('fc',JSON.stringify(S))}catch(e){}draw();return'Daten vom Server geladen.'}
 await push();return'Daten hochgeladen.'}
window.onSaved=()=>{if(!user)return;clearTimeout(t);t=setTimeout(()=>push().catch(()=>{}),1500)};
sb.auth.onAuthStateChange((_e,s)=>{user=s?s.user:null;ui();if(user)run(sync)});
document.addEventListener('visibilitychange',()=>{if(user&&!document.hidden)sync().catch(()=>{})});
b.onclick=()=>{ui();dlg.showModal()};
sb.auth.getSession().then(({data})=>{user=data.session?data.session.user:null;ui();if(user)run(sync)});
})();
