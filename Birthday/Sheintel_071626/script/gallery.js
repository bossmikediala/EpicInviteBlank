const galleryItems=[...document.querySelectorAll(".gallery-item")],lightbox=document.querySelector("#gallery-lightbox"),lightboxImage=document.querySelector("#lightbox-image"),lightboxCaption=document.querySelector("#lightbox-caption");let activeGalleryIndex=0;
function showGalleryImage(index){activeGalleryIndex=(index+galleryItems.length)%galleryItems.length;const item=galleryItems[activeGalleryIndex],image=item.querySelector("img"),caption=item.querySelector("span");lightboxImage.src=image.src;lightboxImage.alt=image.alt;lightboxCaption.textContent=caption.textContent.trim()}
galleryItems.forEach((item,index)=>item.addEventListener("click",()=>{showGalleryImage(index);lightbox.showModal()}));
document.querySelector(".lightbox-close").addEventListener("click",()=>lightbox.close());
document.querySelector(".lightbox-prev").addEventListener("click",()=>showGalleryImage(activeGalleryIndex-1));
document.querySelector(".lightbox-next").addEventListener("click",()=>showGalleryImage(activeGalleryIndex+1));
lightbox.addEventListener("click",event=>{if(event.target===lightbox)lightbox.close()});
document.addEventListener("keydown",event=>{if(!lightbox.open)return;if(event.key==="ArrowLeft")showGalleryImage(activeGalleryIndex-1);if(event.key==="ArrowRight")showGalleryImage(activeGalleryIndex+1)});
