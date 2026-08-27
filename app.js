const $=id=>document.getElementById(id);let isAdmin=false;
$('menuBtn').onclick=()=>{$('sidebar').classList.add('open');$('overlay').classList.add('show')};$('closeMenu').onclick=closeMenu;$('overlay').onclick=closeMenu;function closeMenu(){$('sidebar').classList.remove('open');$('overlay').classList.remove('show')}
$('loginBtn').onclick=()=>$('modal').classList.add('show');$('modalClose').onclick=()=>$('modal').classList.remove('show');
async function req(p,o={}){
  if(window.GITHUB_PAGES_STATIC){
    return {r:{ok:false,status:503},d:{error:'نسخة GitHub Pages للواجهة فقط. الربط المباشر مع البوت يحتاج Backend منفصل.'}};
  }
  let r=await fetch('/api'+p,o);let d=await r.json();return{r,d}
}
async function stats(){try{let {d}=await req('/stats');['members','identities','characters'].forEach(k=>{if($(k))$(k).textContent=d[k]??'—'})}catch(e){}}stats();setInterval(stats,5000);
$('adminLogin').onclick=async()=>{let {r,d}=await req('/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:$('adminUser').value,password:$('adminPass').value})});if(r.ok){isAdmin=true;$('modal').classList.remove('show');$('identitiesLink').style.display='block';$('loginBtn').textContent='أدمن الموقع';$('loginMessage').textContent=''}else $('loginMessage').textContent=d.error||'بيانات الدخول غير صحيحة'};
$('identitiesLink').onclick=e=>{if(!isAdmin){e.preventDefault();return}$('identities').hidden=false};
$('identityGo').onclick=async()=>{if(!isAdmin)return;let q=$('identitySearch').value.trim();if(!q)return;let {r,d}=await req('/identity/'+encodeURIComponent(q));$('identityResult').innerHTML=r.ok?`<b>${d.name||'-'}</b><br>رقم الهوية: ${d.idNumber||'-'}<br>الميلاد: ${d.birthDate||'-'}<br>المكان: ${d.birthPlace||'-'}<br>الوظيفة: ${d.job||'-'}<br>النقد: ${d.cash??0}<br>البنك: ${d.bank??0}`:(d.error||'غير موجود')};