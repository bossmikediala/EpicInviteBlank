const dustLayer=document.querySelector("#silver-dust"),goldDustLayer=document.querySelector("#gold-dust"),petalLayer=document.querySelector("#sakura-petals"),reducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reducedMotion){
  const dustCount=innerWidth<700?20:38,goldDustCount=innerWidth<700?18:34,petalCount=innerWidth<700?13:22;
  for(let i=0;i<dustCount;i++){
    const dust=document.createElement("i"),size=(.7+Math.random()*1.8).toFixed(2);
    dust.className="silver-speck";
    dust.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;--size:${size}px;--duration:${3+Math.random()*5}s;--delay:${-Math.random()*8}s`;
    dustLayer.append(dust);
  }
  for(let i=0;i<goldDustCount;i++){
    const dust=document.createElement("i"),size=(.8+Math.random()*2.2).toFixed(2);
    dust.className="gold-speck";
    dust.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;--size:${size}px;--duration:${3.5+Math.random()*6}s;--delay:${-Math.random()*10}s`;
    goldDustLayer.append(dust);
  }
  for(let i=0;i<petalCount;i++){
    const petal=document.createElement("i"),size=(10+Math.random()*10).toFixed(1),sway=(-30+Math.random()*60).toFixed(1);
    petal.className="sakura-petal";
    petal.style.cssText=`--left:${Math.random()*100}%;--size:${size}px;--sway:${sway}px;--opacity:${(.3+Math.random()*.45).toFixed(2)};--duration:${11+Math.random()*10}s;--delay:${-Math.random()*20}s`;
    petalLayer.append(petal);
  }
}
