(function(){
  const stroke = document.getElementById("rachel-stroke");
  const fill   = document.getElementById("rachel-fill");
  if(!stroke || !fill) return;

  const len = stroke.getTotalLength();

  stroke.style.strokeDasharray  = len;
  stroke.style.strokeDashoffset = len;

  const DRAW_DELAY    = 800;
  const DRAW_DURATION = 8000;
  const FILL_DELAY    = DRAW_DELAY + DRAW_DURATION * 0.28;
  const FILL_DURATION = 900;

  setTimeout(() => {
    stroke.style.transition = "stroke-dashoffset " + DRAW_DURATION + "ms cubic-bezier(0.4, 0, 0.2, 1)";
    stroke.style.strokeDashoffset = "0";
  }, DRAW_DELAY);

  setTimeout(() => {
    fill.style.opacity = "1";
  }, FILL_DELAY);

  setTimeout(() => {
    stroke.style.transition = "opacity 0.8s ease";
    stroke.style.opacity = "0";
  }, DRAW_DELAY + DRAW_DURATION + 400);

  const totalTime = DRAW_DELAY + DRAW_DURATION + 200;

  setTimeout(() => {
    const rule = document.getElementById("hero-rule");
    rule.style.transition = "opacity 0.8s ease";
    rule.style.opacity = "1";
  }, totalTime);

  setTimeout(() => {
    const sc = document.getElementById("scroll-cue");
    sc.style.transition = "opacity 0.6s ease";
    sc.style.opacity = "1";
  }, 1800);
})();



(function(){
  const c=document.getElementById("particles");
  const cols=["rgba(90,127,212,","rgba(133,96,212,","rgba(212,95,160,","rgba(168,126,212,"];
  for(let i=0;i<28;i++){
    const d=document.createElement("div");d.className="particle";
    const s=Math.random()*4+2,col=cols[Math.floor(Math.random()*cols.length)],
          l=Math.random()*100,delay=Math.random()*20,dur=Math.random()*20+18,a=Math.random()*.35+.15;
    d.style.cssText="width:"+s+"px;height:"+s+"px;left:"+l+"%;bottom:-"+s+"px;background:"+col+a+");animation-duration:"+dur+"s;animation-delay:-"+delay+"s;box-shadow:0 0 "+(s*2)+"px "+col+(a*.5)+");";
    c.appendChild(d);
  }
})();

(function(){
  const orbs=[
    {el:document.getElementById("orb1"),sx:.025,sy:.018},
    {el:document.getElementById("orb2"),sx:-.020,sy:.022},
    {el:document.getElementById("orb3"),sx:.015,sy:-.025},
    {el:document.getElementById("orb4"),sx:-.030,sy:-.015},
  ];
  let cx=window.innerWidth/2,cy=window.innerHeight/2;
  document.addEventListener("mousemove",e=>{cx=e.clientX;cy=e.clientY;});

  const scrollLayers = [
    { el: document.getElementById("parallax-bg"),        rate: -0.25 },
    { el: document.querySelector(".hero-name-wrap"), rate: -0.12 },
    { el: document.querySelector(".hero-pre"),       rate: -0.20 },
    { el: document.getElementById("scroll-cue"),    rate:  0.08 },
    { el: document.getElementById("orb1"),           rate: -0.18 },
    { el: document.getElementById("orb2"),           rate: -0.10 },
    { el: document.getElementById("orb3"),           rate:  0.14 },
    { el: document.getElementById("orb4"),           rate:  0.22 },
  ];

  const sectionLayers = [];
  document.querySelectorAll(".sec-heading").forEach(el => {
    sectionLayers.push({ el, rate: 0.04 });
  });
  document.querySelectorAll(".body-p").forEach(el => {
    sectionLayers.push({ el, rate: 0.02 });
  });
  document.querySelectorAll(".tl-role").forEach(el => {
    sectionLayers.push({ el, rate: 0.03 });
  });

  let ticking = false;

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const vh = window.innerHeight;

      if(sy < vh * 1.5){
        scrollLayers.forEach(({el, rate}) => {
          if(!el) return;
          const offset = sy * rate;
          el.style.transform = "translateY(" + offset + "px)";
        });
      }

      sectionLayers.forEach(({el, rate}) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height/2 - vh/2;
        el.style.transform = "translateY(" + (center * rate) + "px)";
      });

      if(sy < vh * 1.5){
        const dx = cx - window.innerWidth/2;
        const dy = cy - window.innerHeight/2;
        orbs.forEach(({el,sx,sy:msy},i) => {
          const scrollT = scrollLayers.find(l => l.el === el);
          const scrollOff = scrollT ? sy * scrollT.rate : 0;
          el.style.transform = "translate(" + (dx*sx) + "px," + (dy*msy + scrollOff) + "px)";
        });
      }

      ticking = false;
    });
  }

  document.addEventListener("mousemove", e => {
    cx = e.clientX; cy = e.clientY;
    onScroll();
  });
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();
})();

(function(){
  const dot=document.getElementById("cursor-dot"),ring=document.getElementById("cursor-ring");
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+"px";dot.style.top=my+"px";});
  (function lerp(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(lerp);})();
  document.querySelectorAll("a,button,.stat-card,.proj-card,.comp-card,.carousel-btn,.carousel-dot").forEach(el=>{
    el.addEventListener("mouseenter",()=>document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave",()=>document.body.classList.remove("cursor-hover"));
  });
})();

(function(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;obs.unobserve(e.target);
      const el=e.target,target=parseInt(el.dataset.target),suffix=el.dataset.suffix||"",dur=1400,start=performance.now();
      (function step(now){const p=Math.min((now-start)/dur,1),ease=1-Math.pow(1-p,3);el.textContent=Math.round(ease*target)+suffix;if(p<1)requestAnimationFrame(step);})(start);
    });
  },{threshold:.5});
  document.querySelectorAll(".counter[data-mode=\"number\"]").forEach(c=>obs.observe(c));
})();

(function(){
  const style=document.createElement("style");
  style.textContent=".tl-track::before{height:var(--line-h,0);}";
  document.head.appendChild(style);
  function update(){
    document.querySelectorAll(".tl-track").forEach(track=>{
      const rect=track.getBoundingClientRect(),vh=window.innerHeight;
      if(rect.top>vh)return;
      track.style.setProperty("--line-h",Math.min((vh-rect.top)/rect.height,1)*rect.height+"px");
    });
  }
  window.addEventListener("scroll",update,{passive:true});
  update();
})();

(function(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;obs.unobserve(e.target);
      e.target.querySelectorAll(".skill-bar-fill").forEach((bar,i)=>{
        setTimeout(()=>{bar.style.width=bar.dataset.width+"%";},i*120);
      });
    });
  },{threshold:.2});
  document.querySelectorAll(".skill-group").forEach(g=>obs.observe(g));
})();

const PROJECT_IMAGES = {
  defense: [
    { src: "images/projects/wazuh dashboard.png", caption: "Wazuh dashboard" },
    { src: "images/projects/hydra.png", caption: "Hydra brute-force attack" },
    { src: "images/projects/ollama.png", caption: "Ollama AI-generated analysis" },
  ],
  vuln: [
    { src: "images/projects/nmap.png", caption: "Nmap scan results" },
    { src: "images/projects/successful meterpreter.png", caption: "Metasploit - successful Meterpreter session" },
    { src: "images/projects/privilege escalation.png", caption: "Privilege escalation to SYSTEM" },
    { src: "images/projects/summary of vuln findings.png", caption: "Summary of findings" },
  ],
  forensics: [
    { src: "images/projects/examiners report.png", caption: "Examiner's report excerpt" },
  ],
    tableau: [
    { src: "images/projects/tableau dashboard.png", caption: "Tableau dashboard" },
    { src: "images/projects/tableau analysis.png", caption: "Tableau analysis" },
    { src: "images/projects/tableau recommendations.png", caption: "Tableau recommendations" },
  ],
  foresight: [
    { src: "images/projects/foresight dashboard.png", caption: "Dashboard - signal volume by domain" },
    { src: "images/projects/foresight annual report.png", caption: "Auto-generated annual report" },
    { src: "images/projects/foresight sources.png", caption: "News sources monitored" },
  ],
    splunk: [
    { src: "images/projects/splunk.png", caption: "Splunk dashboard" },
  ],
  nest: [
    { src: "images/projects/neighbourlynest homepage.jpg", caption: "Homepage" },
    { src: "images/projects/neighbourlynest userchat.jpg", caption: "User chat" },
  ],
  ecostile: [
    { src: "images/projects/ecostile homepage.jpg", caption: "Homepage" },
  ],
    grc: [
    { src: "images/projects/grc.png", caption: "GRC Audit of OCBC" },
  ],
};

(function(){
  const MIN_H = 280;
  const MAX_H = 680;

  function fitMediaToImage(media, imgEl){
    if(!imgEl || !imgEl.naturalWidth) return;
    const w = media.clientWidth || media.offsetWidth;
    let h = w * (imgEl.naturalHeight / imgEl.naturalWidth);
    h = Math.max(MIN_H, Math.min(MAX_H, h));
    media.style.height = h + "px";
  }

  document.querySelectorAll("[data-carousel]").forEach(car=>{
    const projectId = car.dataset.project;
    const images = PROJECT_IMAGES[projectId] || [];

    const media = document.createElement("div");
    media.className = "proj-carousel-media";
    const track = document.createElement("div");
    track.className = "proj-carousel-track";
    media.appendChild(track);

    if(images.length === 0){
      const slide = document.createElement("div");
      slide.className = "proj-carousel-slide";
      slide.innerHTML = '<div class="proj-carousel-placeholder"><span class="ph-file">images/projects/</span>Add images for this project in the PROJECT_IMAGES list in the HTML</div>';
      track.appendChild(slide);
      car.appendChild(media);
      return;
    }

    const imgEls = [];

    images.forEach((img,i)=>{
      const slide = document.createElement("div");
      slide.className = "proj-carousel-slide";
      const imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = img.caption || "";
      imgEl.onload = function(){ if(i === idx) fitMediaToImage(media, imgEl); };
      imgEl.onerror = function(){
        slide.innerHTML = '<div class="proj-carousel-placeholder"><span class="ph-file">'+img.src+'</span>Image not found - check the file is in this folder</div>';
      };
      slide.appendChild(imgEl);
      track.appendChild(slide);
      imgEls.push(imgEl);
    });
    car.appendChild(media);

    const captionBar = document.createElement("div");
    captionBar.className = "proj-carousel-caption-bar";
    captionBar.textContent = images[0].caption || "";
    if(!images.some(im=>im.caption)) captionBar.style.display = "none";
    car.appendChild(captionBar);

    let idx = 0;
    const total = images.length;

    if(imgEls[0] && imgEls[0].complete && imgEls[0].naturalWidth){
      fitMediaToImage(media, imgEls[0]);
    }

    if(total <= 1) return; // no nav needed for a single image

    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-btn prev";
    prevBtn.setAttribute("aria-label","Previous image");
    prevBtn.textContent = "\u2039";
    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-btn next";
    nextBtn.setAttribute("aria-label","Next image");
    nextBtn.textContent = "\u203a";
    const countEl = document.createElement("div");
    countEl.className = "carousel-count";
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "carousel-dots";
    media.append(prevBtn, nextBtn, countEl, dotsWrap);

    images.forEach((_,i)=>{
      const d=document.createElement("div");
      d.className="carousel-dot"+(i===0?" active":"");
      d.addEventListener("click",()=>go(i));
      dotsWrap.appendChild(d);
    });
    const dots = dotsWrap.querySelectorAll(".carousel-dot");

    function update(){
      track.style.transform = "translateX(-"+(idx*100)+"%)";
      dots.forEach((d,i)=>d.classList.toggle("active",i===idx));
      countEl.textContent = (idx+1)+" / "+total;
      captionBar.textContent = images[idx].caption || "";
      captionBar.style.display = images[idx].caption ? "flex" : "none";
      const cur = imgEls[idx];
      if(cur && cur.complete && cur.naturalWidth){
        fitMediaToImage(media, cur);
      }
    }
    function go(i){ idx=(i+total)%total; update(); }

    prevBtn.addEventListener("click",()=>go(idx-1));
    nextBtn.addEventListener("click",()=>go(idx+1));
    update();

    window.addEventListener("resize", ()=>{
      const cur = imgEls[idx];
      if(cur && cur.complete && cur.naturalWidth) fitMediaToImage(media, cur);
    }, {passive:true});
  });
})();

(function(){
  const nav=document.getElementById("main-nav");
  window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>50),{passive:true});
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("vis");});
  },{threshold:.1});
  document.querySelectorAll(".tl-entry,.proj-card,.cert-entry,.cert-pill,.statement-text .line,.lead-compact-row,.comp-card,.proj-block").forEach((el,i)=>{
    el.style.transitionDelay=(i%6*.12)+"s";
    obs.observe(el);
  });
  document.querySelectorAll("a[href^=\"#\"]").forEach(a=>{
    a.addEventListener("click",e=>{
      const t=document.querySelector(a.getAttribute("href"));
      if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth"});}
    });
  });
})();

(function(){
  const el = document.getElementById("typed-name");
  if(!el) return;
  const text = "Rachel Ng Jingwen";
  let i = 0;
  function type(){
    if(i <= text.length){
      el.textContent = text.slice(0,i);
      i++;
      setTimeout(type, 90);
    }
  }
  setTimeout(type, 600);
})();

const nav = document.querySelector("nav");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelectorAll(".nav-links a");

if (hamburger && nav) {

    // Open / close hamburger menu
    hamburger.addEventListener("click", () => {
        nav.classList.toggle("menu-open");

        const isOpen = nav.classList.contains("menu-open");

        hamburger.setAttribute(
            "aria-expanded",
            isOpen
        );
    });

    // Close menu after clicking a navigation link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("menu-open");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });

    // Reset menu when returning to desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            nav.classList.remove("menu-open");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });

}
