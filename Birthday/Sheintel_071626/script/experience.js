const CHAT_KEY="epicinvite:Sheintel_071626:chat";
const defaultWishes=[
  {name:"Maria Santos",message:"Happy 18th, Sheintel! Wishing you a lifetime of joy, adventure, and love."},
  {name:"Ana Reyes",message:"May your eighteenth year be your most magical chapter yet!"},
  {name:"Carlo Dela Cruz",message:"May your dreams soar freely and beautifully. We are so proud of you!"},
  {name:"Tita Grace",message:"Continue growing into the graceful and courageous woman you are meant to be."},
  {name:"Alyssa Mae",message:"Here’s to new adventures, unforgettable memories, and dreams coming true!"},
  {name:"Joshua",message:"Happy debut! May this beautiful night be the beginning of an amazing future."},
  {name:"Ninang Marie",message:"May God guide you with wisdom, strength, and happiness in every new chapter."},
  {name:"Sofia",message:"Eighteen looks wonderful on you. Keep shining and inspiring everyone around you!"},
  {name:"Daniel",message:"Wishing you laughter, genuine friendships, and success in everything you pursue."},
  {name:"Tita Rose",message:"May your heart always remain kind and your future always remain bright."},
  {name:"Bianca",message:"Cheers to eighteen years of beautiful memories and many more still to come!"},
  {name:"Miguel",message:"Dream fearlessly, love deeply, and enjoy every moment of this wonderful journey."}
];
const read=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
function escapeHtml(value){const node=document.createElement("span");node.textContent=value;return node.innerHTML}
function wishCard(w){return `<article class="glass wish-card"><i class="fa-solid fa-heart"></i><p>“${escapeHtml(w.message)}”</p><h3>${escapeHtml(w.name)}</h3></article>`}
function renderWishes(){const midpoint=Math.ceil(defaultWishes.length/2),top=defaultWishes.slice(0,midpoint),bottom=defaultWishes.slice(midpoint);document.querySelector("#wishes-track-top").innerHTML=[...top,...top].map(wishCard).join("");document.querySelector("#wishes-track-bottom").innerHTML=[...bottom,...bottom].map(wishCard).join("")}
const defaultChat=[{name:"Ana",text:"So excited for August 22!",time:"10:04 AM"},{name:"Carlo",text:"Can't wait to celebrate with Sheintel!",time:"10:06 AM"},{name:"Maria",text:"Formal with a touch of blue — noted!",time:"10:12 AM"}];
function renderChat(){const messages=[...defaultChat,...read(CHAT_KEY)];document.querySelector("#chat-messages").innerHTML=messages.map(m=>`<div class="chat-message ${m.self?"self":""}"><small>${escapeHtml(m.name)} · ${escapeHtml(m.time)}</small>${escapeHtml(m.text)}</div>`).join("");document.querySelector("#chat-messages").scrollTop=99999}
function sendChat(){const name=document.querySelector("#chat-name").value.trim()||"Guest",text=document.querySelector("#chat-text").value.trim();if(!text)return;const messages=read(CHAT_KEY);messages.push({name,text,time:new Date().toLocaleTimeString("en-PH",{hour:"numeric",minute:"2-digit"}),self:true});localStorage.setItem(CHAT_KEY,JSON.stringify(messages));document.querySelector("#chat-text").value="";renderChat()}
document.querySelector("#chat-send").addEventListener("click",sendChat);document.querySelector("#chat-text").addEventListener("keydown",event=>{if(event.key==="Enter")sendChat()});renderWishes();renderChat();
