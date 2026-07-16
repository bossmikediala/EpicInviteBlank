const navToggle=document.querySelector("#nav-toggle"),navMenu=document.querySelector("#nav-menu");
function closeNav(){navMenu.classList.remove("is-open");navToggle.setAttribute("aria-expanded","false");navToggle.setAttribute("aria-label","Open navigation");navToggle.innerHTML='<i class="fa-solid fa-bars"></i>'}
navToggle.addEventListener("click",()=>{const open=navMenu.classList.toggle("is-open");navToggle.setAttribute("aria-expanded",String(open));navToggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");navToggle.innerHTML=`<i class="fa-solid fa-${open?"xmark":"bars"}"></i>`});
navMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeNav));
addEventListener("resize",()=>{if(innerWidth>900)closeNav()});
