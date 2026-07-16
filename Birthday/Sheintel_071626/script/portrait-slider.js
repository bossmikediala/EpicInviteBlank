const portraitSlides=[...document.querySelectorAll(".portrait-slide")];
if(portraitSlides.length>1){
  let portraitIndex=0;
  setInterval(()=>{
    portraitSlides[portraitIndex].classList.remove("is-active");
    portraitIndex=(portraitIndex+1)%portraitSlides.length;
    portraitSlides[portraitIndex].classList.add("is-active");
  },5000);
}
