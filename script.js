const header=document.querySelector('.site-header');
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-nav');
const navLinks=document.querySelectorAll('.site-nav a');
document.getElementById('year').textContent=new Date().getFullYear();

window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>30));

menuButton.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  document.body.classList.toggle('menu-open',open);
  menuButton.setAttribute('aria-expanded',String(open));
});

navLinks.forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded','false');
}));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
