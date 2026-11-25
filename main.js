(function(){
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('yr').textContent=new Date().getFullYear();
var $=function(i){return document.getElementById(i)};
var cv=$('cv'),ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
// Effect B: procedural frames (stands in for the video/image sequence)
function draw(p){
 ctx.clearRect(0,0,W,H);
 var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#16191e');g.addColorStop(1,'#07080a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='rgba(233,230,223,.12)';ctx.lineWidth=2;
 for(var i=0;i<14;i++){var y=(i*53+p*900)%H;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W*(.3+.4*((i*37)%10)/10),y);ctx.stroke();}
 var e=p*p*(3-2*p),cx=W/2+(p-.5)*220,cy=H*.52,R=H*.3*(.7+1.1*e),a=p*Math.PI*10;
 ctx.lineWidth=R*.22;ctx.strokeStyle='#050505';ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
 ctx.lineWidth=R*.03;ctx.strokeStyle='#8d8a84';ctx.beginPath();ctx.arc(cx,cy,R*.86,0,7);ctx.stroke();
 ctx.lineWidth=R*.1;ctx.strokeStyle='rgba(233,230,223,.22)';ctx.beginPath();ctx.arc(cx,cy,R*.55,0,7);ctx.stroke();
 ctx.fillStyle='#e1251b';
 for(var k=0;k<24;k++){var t=a+k*Math.PI/12;ctx.beginPath();ctx.arc(cx+Math.cos(t)*R*.55,cy+Math.sin(t)*R*.55,R*.03,0,7);ctx.fill();}
 ctx.strokeStyle='#cfcac0';ctx.lineWidth=R*.04;
 for(var s=0;s<5;s++){var u=a*.5+s*Math.PI*2/5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(u)*R*.84,cy+Math.sin(u)*R*.84);ctx.stroke();}
 ctx.fillStyle='#e1251b';ctx.beginPath();ctx.arc(cx,cy,R*.09,0,7);ctx.fill();
}
draw(0);
// Effects C + D: one progress source drives frame, captions, ruler
var slides=[].slice.call(document.querySelectorAll('.scrolly-telling__slide')),ruler=$('ruler'),hint=$('hint'),cur=0;
function sync(p){
 draw(p);
 ruler.style.setProperty('--ruler-progress',(p*100)+'%');ruler.setAttribute('aria-valuenow',Math.round(p*100));
 var idx=Math.min(slides.length-1,Math.floor(p*slides.length));
 if(idx!==cur){slides[cur].classList.remove('is-active');slides[idx].classList.add('is-active');cur=idx;badges(idx===0)}
 hint.style.opacity=p<.02?1:0;
}
var shown=false;
function badges(on){ // Effect E: first activation only
 if(on&&!shown&&!reduce&&window.gsap){shown=true;gsap.from('.badge-spec',{opacity:0,y:16,stagger:.08,duration:.4})}
}
if(!reduce&&window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 slides.forEach(function(s,i){gsap.set(s,{opacity:i===0?1:0})});
 ScrollTrigger.create({trigger:'#stage',start:'top top',end:function(){return '+='+window.innerHeight*10},pin:true,scrub:.3,anticipatePin:1,
  onUpdate:function(self){sync(self.progress);gsap.to(slides[cur],{opacity:1,duration:.35,overwrite:true});slides.forEach(function(s,i){if(i!==cur)gsap.to(s,{opacity:0,duration:.25,overwrite:true})})}});
}else{draw(.35)}
// Effect A: hero overlay
var hero=$('hero'),start=$('start');
setTimeout(function(){start.disabled=false;start.classList.remove('c-button--disabled')},reduce?0:900);
function closeHero(){
 document.body.style.overflow='';
 if(reduce||!window.gsap){hero.style.display='none';return}
 gsap.to(hero,{opacity:0,duration:.6,ease:'power2.out',onComplete:function(){hero.style.display='none';ScrollTrigger&&ScrollTrigger.refresh()}});
}
document.body.style.overflow='hidden';
start.addEventListener('click',closeHero);$('skip').addEventListener('click',closeHero);
if(!reduce&&window.gsap){gsap.from('.hero-reveal__wrapper > *',{opacity:0,y:12,stagger:.12,duration:.7,delay:.1})}
// Effects F + G: one modal shell, one reusable slider
var data={
 specs:{t:'Tech specs',i:'The numbers behind the bike.',s:[['Engine','998 cc, short stroke','Inline four tuned for high revs.'],['Weight','158 kg dry','Carbon frame and wheels.'],['Power','212 hp','At 14,000 rpm.']]},
 dynamics:{t:'Extreme engineering',i:'Every part earns its weight.',s:[['Frame','Carbon monocoque','One weave from head to tail.'],['Wheels','Forged carbon','Lighter wheels turn in faster.'],['Brakes','Drilled discs','Heat leaves the disc quickly.']]},
 engine:{t:'A new engine',i:'Made only for this bike.',s:[['Layout','Inline four','Short stroke, free-revving.'],['Intake','Ram air','Pressure builds with speed.'],['Sound','Open exhaust path','Tuned for the note, not the rules.']]},
 collector:{t:'A collector’s dream',i:'Rare by design.',s:[['Run','500 bikes','Never more.'],['Plate','Hand numbered','001 to 500.'],['Papers','Owner’s book','Signed at handover.']]},
 livery:{t:'Celebrate more',i:'A livery for the anniversary.',s:[['Colour','Signal red','Used only on working parts.'],['Detail','Gold numerals','Match your plate.'],['Run','100 bikes','Inside the 500.']]}
};
var m=$('modal'),sl=[],ix=0,opener=null;
function show(){var s=sl[ix];$('s-k').textContent=s[0];$('s-t').textContent=s[1];$('s-d').textContent=s[2]}
function fill(id){var d=data[id];$('m-title').textContent=d.t;$('m-intro').textContent=d.i;sl=d.s;ix=0;show()}
$('s-next').onclick=function(){ix=(ix+1)%sl.length;show()};$('s-prev').onclick=function(){ix=(ix-1+sl.length)%sl.length;show()};
$('m-close').onclick=function(){m.close()};
m.addEventListener('click',function(e){if(e.target===m)m.close()});
m.addEventListener('close',function(){opener&&opener.focus()});
function openModal(id,btn){
 opener=btn;fill(id);
 if(reduce||!window.gsap){m.showModal();return}
 var w=$('wipe');
 gsap.timeline().set(w,{clipPath:'inset(0 100% 0 0)'}).to(w,{clipPath:'inset(0 0% 0 0)',duration:.45,ease:'power3.inOut',onComplete:function(){m.showModal()}})
  .to(w,{clipPath:'inset(0 0 0 100%)',duration:.45,ease:'power3.inOut'});
}
[].forEach.call(document.querySelectorAll('[data-modal]'),function(b){b.addEventListener('click',function(){openModal(b.dataset.modal,b)})});
$('open-specs').addEventListener('click',function(){openModal('specs',this)});
})();
