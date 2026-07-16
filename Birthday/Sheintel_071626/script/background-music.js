const music=document.querySelector("#background-music"),musicToggle=document.querySelector("#music-toggle");
music.volume=.18;
function updateMusicButton(){const playing=!music.paused;musicToggle.classList.toggle("is-playing",playing);musicToggle.setAttribute("aria-pressed",String(playing));musicToggle.setAttribute("aria-label",playing?"Pause background music":"Play background music");musicToggle.innerHTML=`<i class="fa-solid fa-${playing?"volume-low":"music"}"></i><span>${playing?"Playing":"Music"}</span>`}
async function playMusic(){try{await music.play();updateMusicButton();return true}catch{return false}}
musicToggle.addEventListener("click",async()=>{if(music.paused)await playMusic();else{music.pause();updateMusicButton()}});
addEventListener("DOMContentLoaded",async()=>{if(await playMusic())return;const begin=async()=>{if(await playMusic()){removeEventListener("pointerdown",begin);removeEventListener("keydown",begin);removeEventListener("touchstart",begin)}};addEventListener("pointerdown",begin,{passive:true});addEventListener("touchstart",begin,{passive:true});addEventListener("keydown",begin)});
music.addEventListener("play",updateMusicButton);music.addEventListener("pause",updateMusicButton);updateMusicButton();
