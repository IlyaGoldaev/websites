const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('mobile-menu');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';menu.hidden=open;toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Открыть меню':'Закрыть меню');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus();}});
document.addEventListener('click',event=>{if(!menu.hidden&&!menu.contains(event.target)&&!toggle.contains(event.target))closeMenu();});
window.matchMedia('(min-width: 1281px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

// Production carousel: accessible manual controls and pausable automatic rotation.
document.querySelectorAll('.production-slider, .home-carousel').forEach(slider=>{
 const slides=[...slider.querySelectorAll('.production-slide, .home-slide')];
 const status=slider.querySelector('[data-slide-status]');
 const pause=slider.querySelector('[data-slide-pause]');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,paused=reduced.matches,timer=null;
 function show(next){current=(next+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==current);status.textContent=`${current+1} / ${slides.length}`;slider.querySelectorAll("[data-carousel-index]").forEach((button,i)=>button.setAttribute("aria-pressed",String(i===current)));}
 function stop(){clearInterval(timer);timer=null;}
 function sync(){stop();pause.textContent=paused?'Включить смену':'Пауза';pause.setAttribute('aria-pressed',String(paused));status.setAttribute('aria-live',paused?'polite':'off');if(!paused&&!document.hidden)timer=setInterval(()=>show(current+1),6000);}
 function manual(delta){paused=true;show(current+delta);sync();}
 slider.querySelector('[data-slide-prev]').addEventListener('click',()=>manual(-1));
 slider.querySelector('[data-slide-next]').addEventListener('click',()=>manual(1));
 pause.addEventListener('click',()=>{paused=!paused;sync();});
 slider.addEventListener('mouseenter',stop);
 slider.addEventListener('mouseleave',()=>{if(!slider.contains(document.activeElement))sync();});
 slider.addEventListener('focusin',event=>{if(event.target!==pause){paused=true;sync();}else stop();});
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',e=>{if(e.matches){paused=true;sync();}});
 slider.querySelectorAll('[data-carousel-index]').forEach(button=>button.addEventListener('click',()=>{paused=true;show(Number(button.dataset.carouselIndex));sync();}));
 slides.forEach(slide=>slide.querySelectorAll('img').forEach(img=>{img.loading='eager';}));
 sync();
});

// Native anchor works without JS; focus follows the viewport when enhanced.
const topLink=document.querySelector('.back-to-top');
if(topLink){const updateTop=()=>{topLink.hidden=window.scrollY<350;};window.addEventListener('scroll',updateTop,{passive:true});updateTop();topLink.addEventListener('click',event=>{event.preventDefault();const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;document.getElementById('top').focus({preventScroll:true});window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});});}
