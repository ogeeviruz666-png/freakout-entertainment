
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const intro=document.querySelector('[data-intro]');
if(intro){window.addEventListener('load',()=>setTimeout(()=>intro.classList.add('hide'),1500));}
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const modal=document.querySelector('[data-lightbox-modal]');
if(modal){
 const img=modal.querySelector('img');
 document.querySelectorAll('[data-lightbox]').forEach(btn=>btn.addEventListener('click',()=>{img.src=btn.dataset.lightbox;modal.classList.add('open');modal.setAttribute('aria-hidden','false');}));
 const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');img.src='';};
 modal.querySelector('button').addEventListener('click',close);
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}

const premiumHeader=document.querySelector('.site-header');
window.addEventListener('scroll',()=>premiumHeader?.classList.toggle('scrolled',window.scrollY>24));
const pageTransition=document.querySelector('.page-transition');
document.querySelectorAll('a[href]').forEach(link=>{
  const href=link.getAttribute('href');
  if(!href || href.startsWith('#') || href.startsWith('http') || link.target==='_blank') return;
  link.addEventListener('click',event=>{
    event.preventDefault();
    pageTransition?.classList.add('active');
    setTimeout(()=>location.href=href,360);
  });
});
window.addEventListener('pageshow',()=>pageTransition?.classList.remove('active'));

document.querySelectorAll('.main-nav a').forEach(link=>{
  const current=location.pathname.split('/').pop()||'index.html';
  if(link.getAttribute('href')===current) link.classList.add('active');
});
