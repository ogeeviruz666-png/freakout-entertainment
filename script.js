const intro=document.getElementById('intro');
const header=document.querySelector('header');
const menu=document.querySelector('.menu');
const nav=document.querySelector('nav');
document.getElementById('year').textContent=new Date().getFullYear();

window.addEventListener('load',()=>setTimeout(()=>intro.classList.add('hide'),1800));
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>25));

menu.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
