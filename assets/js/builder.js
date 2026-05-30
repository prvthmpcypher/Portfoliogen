/* ============================================================
   PortfolioGen Builder v4 — HTML/CSS/JS Generation Engine
   Cypher Labs · Multi-page, multi-style, multi-effect
   ============================================================ */

/* ===== ESCAPING ===== */
function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
function attr(v){return esc(v).replace(/`/g,'&#096;');}
function clampPct(v){var n=parseInt(v,10);return isNaN(n)?0:Math.max(0,Math.min(100,n));}
function yr(){return new Date().getFullYear();}

/* ===== AVATAR PLACEHOLDER ===== */
var AVATAR_SVG='data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22400%22 viewBox%3D%220 0 400 400%22%3E%3Crect width%3D%22400%22 height%3D%22400%22 fill%3D%22%23e2e8f0%22%2F%3E%3Ccircle cx%3D%22200%22 cy%3D%22148%22 r%3D%2272%22 fill%3D%22%2394a3b8%22%2F%3E%3Cpath d%3D%22M80 360c18-78 62-118 120-118s102 40 120 118%22 fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E';

/* ===== BLOCK REGISTRY ===== */
var BLOCK_REGISTRY={
  hero:{label:'Hero',icon:'H',defaultCols:12,description:'Name, title, photo, CTA'},
  bio:{label:'About',icon:'B',defaultCols:8,description:'Your story and background'},
  skills:{label:'Skills',icon:'S',defaultCols:4,description:'Skill bars with levels'},
  education:{label:'Education',icon:'E',defaultCols:12,description:'Degrees and courses'},
  experience:{label:'Experience',icon:'W',defaultCols:12,description:'Work history'},
  projects:{label:'Projects',icon:'P',defaultCols:12,description:'Portfolio cards'},
  services:{label:'Services',icon:'SV',defaultCols:12,description:'What you offer'},
  testimonials:{label:'Testimonials',icon:'T',defaultCols:12,description:'Client quotes'},
  certs:{label:'Certifications',icon:'C',defaultCols:6,description:'Certs and awards'},
  contact:{label:'Contact',icon:'CT',defaultCols:12,description:'Contact form'},
  socialLinks:{label:'Social Links',icon:'L',defaultCols:6,description:'Social profiles'},
  githubFeed:{label:'GitHub Feed',icon:'GH',defaultCols:6,description:'Recent commits'},
  stats:{label:'Stats / Numbers',icon:'#',defaultCols:12,description:'Key metrics'},
  timeline:{label:'Timeline',icon:'TL',defaultCols:12,description:'Life/career timeline'},
  gallery:{label:'Gallery',icon:'G',defaultCols:12,description:'Image grid'}
};

/* ===== UI STYLES ===== */
var UI_STYLES=[
  {id:'clean',name:'Clean',desc:'Subtle shadows, crisp cards'},
  {id:'glassmorphism',name:'Glassmorphism',desc:'Frosted glass panels'},
  {id:'neumorphism',name:'Neumorphism',desc:'Soft extruded UI'},
  {id:'claymorphism',name:'Claymorphism',desc:'Puffy 3D clay shapes'},
  {id:'brutalism',name:'Brutalism',desc:'Hard borders, bold shadows'},
  {id:'neubrutalism',name:'Neu-Brutalism',desc:'Modern brutalist hybrid'},
  {id:'minimalist',name:'Minimalist',desc:'Ultra-clean, generous space'},
  {id:'darkmode',name:'Dark Mode',desc:'Deep dark backgrounds'},
  {id:'aurora',name:'Aurora UI',desc:'Colorful gradient glow'},
  {id:'retrofuturism',name:'Retro Futurism',desc:'80s neon sci-fi vibes'},
  {id:'material',name:'Material Design',desc:'Google Material 3'},
  {id:'fluent',name:'Fluent Design',desc:'Microsoft Fluent look'},
  {id:'holographic',name:'Holographic',desc:'Rainbow prismatic sheen'},
  {id:'glitchart',name:'Glitch Art',desc:'Digital glitch aesthetic'},
  {id:'bento',name:'Bento Grid',desc:'Japanese grid layout'},
  {id:'editorial',name:'Editorial / Typo',desc:'Magazine typography'},
  {id:'organic',name:'Organic/Biomorphic',desc:'Fluid nature shapes'},
  {id:'cyberpunk',name:'Cyberpunk',desc:'Neon yellow, dark grid'},
  {id:'spatial',name:'Spatial UI',desc:'Depth and 3D layers'},
  {id:'flat2',name:'Flat Design 2.0',desc:'Flat with subtle depth'},
  {id:'skeuomorphism',name:'Skeuomorphism',desc:'Realistic textures'},
  {id:'parallax',name:'Parallax UI',desc:'Depth scroll layers'},
  {id:'splitscreen',name:'Split Screen',desc:'Bold two-panel layout'},
  {id:'generativeai',name:'Generative AI',desc:'Dynamic procedural art'},
  {id:'cardgrid',name:'Card Grid',desc:'Dense card-based layout'}
];

/* ===== GRADIENTS ===== */
var GRADIENTS=[
  {id:'none',name:'None',css:'var(--bg)'},
  {id:'aurora',name:'Aurora',css:'linear-gradient(135deg,#6ee7f7,#7c3aed,#10b981)'},
  {id:'sunset',name:'Sunset',css:'linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)'},
  {id:'ocean',name:'Ocean',css:'linear-gradient(135deg,#0ea5e9,#0C9B70,#042444)'},
  {id:'forest',name:'Forest',css:'linear-gradient(135deg,#064e3b,#059669,#84cc16)'},
  {id:'neon',name:'Neon',css:'linear-gradient(135deg,#4f46e5,#06b6d4,#10b981)'},
  {id:'rose',name:'Rose Gold',css:'linear-gradient(135deg,#fda4af,#fb923c,#fbbf24)'},
  {id:'midnight',name:'Midnight',css:'linear-gradient(135deg,#0f172a,#1e3a5f,#0c9b70)'},
  {id:'holographic',name:'Holographic',css:'linear-gradient(135deg,#f0abfc,#818cf8,#67e8f9,#6ee7b7)'},
  {id:'cyberpunk',name:'Cyberpunk',css:'linear-gradient(135deg,#030712,#1c1917,#451a03)'},
  {id:'pastel',name:'Pastel Dream',css:'linear-gradient(135deg,#ddd6fe,#fbcfe8,#bae6fd)'},
  {id:'duotone',name:'Duotone',css:'linear-gradient(135deg,#1e40af,#be123c)'},
  {id:'monochrome',name:'Monochrome',css:'linear-gradient(135deg,#f8fafc,#cbd5e1,#64748b)'},
  {id:'pearlescent',name:'Pearlescent',css:'linear-gradient(135deg,#f0f9ff,#e0f2fe,#bae6fd,#e8f5e9)'},
  {id:'grainy',name:'Grainy',css:'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)'},
  {id:'liquid',name:'Liquid',css:'radial-gradient(ellipse at top,#7c3aed,transparent),radial-gradient(ellipse at bottom,#0ea5e9,transparent)'},
  {id:'iridescent',name:'Iridescent',css:'linear-gradient(135deg,#fde68a,#6ee7b7,#c4b5fd,#fb7185)'},
  {id:'metallic',name:'Metallic',css:'linear-gradient(135deg,#71717a,#d4d4d8,#71717a)'},
  {id:'moody',name:'Moody Dark',css:'linear-gradient(135deg,#0c0c0c,#1a0533,#0a1628)'},
  {id:'vintage',name:'Vintage',css:'linear-gradient(135deg,#92400e,#b45309,#d97706)'},
  {id:'glass',name:'Glass',css:'linear-gradient(135deg,rgba(255,255,255,0.4),rgba(255,255,255,0.1))'},
  {id:'angular',name:'Angular',css:'conic-gradient(from 0deg at 50% 50%,#0C9B70,#1db88e,#042444,#0C9B70)'},
  {id:'mesh',name:'Mesh Gradient',css:'radial-gradient(at 20% 30%,#0C9B70 0%,transparent 50%),radial-gradient(at 80% 70%,#042444 0%,transparent 50%),radial-gradient(at 60% 20%,#1db88e 0%,transparent 40%)'},
  {id:'softblur',name:'Soft Blur',css:'radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.3),transparent)'},
  {id:'pastelrainbow',name:'Pastel Rainbow',css:'linear-gradient(135deg,#fce4ec,#fff9c4,#e8f5e9,#e3f2fd,#f3e5f5)'}
];

/* ===== EFFECTS ===== */
var SCROLL_EFFECTS=[
  {id:'slideUp',name:'Slide Up',desc:'Rise from below'},
  {id:'slideLeft',name:'Slide Left',desc:'Slide from right'},
  {id:'slideRight',name:'Slide Right',desc:'Slide from left'},
  {id:'fadeIn',name:'Fade In',desc:'Gentle opacity reveal'},
  {id:'scale',name:'Scale',desc:'Zoom in to size'},
  {id:'rotateIn',name:'Rotate In',desc:'Rotate while fading'},
  {id:'flipIn',name:'Flip In',desc:'3D flip reveal'},
  {id:'bounceIn',name:'Bounce In',desc:'Elastic bounce'},
  {id:'stagger',name:'Stagger',desc:'Cascading delay'},
  {id:'clipPath',name:'Clip Path',desc:'Wipe reveal effect'},
  {id:'none',name:'None',desc:'No animation'}
];
var HOVER_EFFECTS=[
  {id:'lift',name:'Lift',desc:'Float up on hover'},
  {id:'tilt3d',name:'3D Tilt',desc:'Perspective tilt'},
  {id:'glow',name:'Glow',desc:'Colored glow shadow'},
  {id:'scale',name:'Scale Up',desc:'Slightly enlarge'},
  {id:'underline',name:'Underline Draw',desc:'Animated underline'},
  {id:'magnetic',name:'Magnetic',desc:'Follow cursor'},
  {id:'ripple',name:'Ripple',desc:'Click ripple effect'},
  {id:'glasshover',name:'Glass Hover',desc:'Glassmorphism on hover'},
  {id:'colorshift',name:'Color Shift',desc:'Background color change'},
  {id:'none',name:'None',desc:'No hover effect'}
];
var HERO_EFFECTS=[
  {id:'none',name:'None',desc:'Static hero'},
  {id:'particles',name:'Particles',desc:'Floating particles BG'},
  {id:'typedtext',name:'Typed Text',desc:'Typewriter animation'},
  {id:'parallax',name:'Parallax',desc:'Parallax on scroll'},
  {id:'kenburns',name:'Ken Burns',desc:'Slow zoom + pan'},
  {id:'glitch',name:'Glitch',desc:'Digital glitch effect'},
  {id:'floatingshapes',name:'Floating Shapes',desc:'Animated geometric shapes'},
  {id:'gradientanim',name:'Gradient Anim',desc:'Shifting gradient colors'},
  {id:'wavebg',name:'Wave BG',desc:'Animated SVG waves'},
  {id:'marquee',name:'Text Marquee',desc:'Scrolling text band'},
  {id:'noise',name:'Noise Texture',desc:'Grainy noise overlay'}
];
var CURSOR_EFFECTS=[
  {id:'none',name:'Default',desc:'Browser default cursor'},
  {id:'trail',name:'Trail',desc:'Glowing dot trail'},
  {id:'spotlight',name:'Spotlight',desc:'Spotlight follow'},
  {id:'magnetic',name:'Magnetic',desc:'Attract to elements'},
  {id:'ring',name:'Ring Follower',desc:'Circular ring follows'},
  {id:'elastic',name:'Elastic',desc:'Elastic lag follow'},
  {id:'ripple',name:'Click Ripple',desc:'Ripple on click'},
  {id:'custom',name:'Custom Arrow',desc:'Custom SVG arrow'}
];
var IMAGE_EFFECTS=[
  {id:'none',name:'None',desc:'Original image'},
  {id:'duotone',name:'Duotone',desc:'Two-color blend'},
  {id:'grayscale',name:'Grayscale',desc:'Black & white'},
  {id:'sepia',name:'Sepia',desc:'Warm vintage tone'},
  {id:'huerotate',name:'Hue Rotate',desc:'Color shift'},
  {id:'contrast',name:'High Contrast',desc:'Punchy contrast'},
  {id:'saturate',name:'Hyper-saturate',desc:'Vivid colors'},
  {id:'blur',name:'Soft Focus',desc:'Gaussian blur'},
  {id:'vignette',name:'Vignette',desc:'Dark edge vignette'},
  {id:'glitch',name:'Glitch',desc:'RGB channel split'},
  {id:'grain',name:'Film Grain',desc:'Noise texture overlay'},
  {id:'sketch',name:'Sketch',desc:'Drawn sketch look'},
  {id:'halftone',name:'Halftone',desc:'Dot pattern effect'},
  {id:'coldtone',name:'Cold Tone',desc:'Bluish cool filter'},
  {id:'warmtone',name:'Warm Tone',desc:'Warm golden cast'}
];

/* ===== PAGE HELPER ===== */
function getPhotoSrc(s){return s.meta&&s.meta.photoBase64?s.meta.photoBase64:'assets/img/profile.jpg';}
function getFavicon(s){
  if(s.meta&&s.meta.faviconBase64)return s.meta.faviconBase64;
  var name=(s.meta&&s.meta.name)||'P';var initial=name.trim().charAt(0).toUpperCase()||'P';
  var t=s.theme||{};
  return'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="'+(t.primaryColor||'#0C9B70')+'"/><text x="32" y="40" text-anchor="middle" font-family="Arial" font-size="28" font-weight="700" fill="#fff">'+initial+'</text></svg>');
}

/* ===== NAV BUILDER ===== */
function buildNav(s,active){
  var m=s.meta||{};var pages=s.pages||[];
  var darkBtn=s.theme.darkMode?'<button class="nav-theme-btn" id="themeBtn" aria-label="Toggle theme"><i class="bx bx-moon"></i></button>':'';
  // Social in nav
  var navSocials='';
  (s.socials||[]).forEach(function(soc){
    if(soc.inNav&&soc.url){navSocials+='<a href="'+attr(soc.url)+'" target="_blank" class="nav-social-link social-shape-'+esc(soc.iconShape||'circle')+'" style="--social-color:'+attr(soc.iconColor||'var(--primary)')+'" aria-label="'+esc(soc.name)+'"><i class="bx '+esc(soc.icon)+'"></i></a>';}
  });
  var links=pages.filter(function(p){return p.enabled;}).map(function(p){
    var href=s.__preview?'#pg-page-'+p.name:p.name+'.html';var label=p.navLabel||p.label;
    var previewAttr=s.__preview?' data-preview-page="'+attr(p.name)+'"':'';
    return'<li><a href="'+attr(href)+'"'+previewAttr+' class="nav-link'+(active===p.name?' active':'')+'">' +esc(label)+'</a></li>';
  }).join('');
  if(m.resumeUrl)links+='<li><a href="'+attr(m.resumeUrl)+'" target="_blank" class="nav-link nav-resume">Resume</a></li>';
  return'<header class="site-header"><nav class="site-nav">'+
    '<a href="index.html" class="nav-logo">'+esc(m.name||'Portfolio')+'</a>'+
    '<div class="nav-menu" id="nav-menu"><ul class="nav-list">'+links+'</ul></div>'+
    '<div class="nav-btns">'+navSocials+darkBtn+
    '<button class="nav-toggle" id="nav-toggle" aria-label="Menu"><i class="bx bx-menu"></i></button></div>'+
    '</nav></header>';
}

/* ===== FOOTER BUILDER ===== */
function buildFooter(s){
  var m=s.meta||{};var icons='';var pages=s.pages||[];var footer=s.footer||{};
  (s.socials||[]).forEach(function(soc){
    if(soc.inFooter&&soc.url){icons+='<a href="'+attr(soc.url)+'" target="_blank" class="footer-social social-shape-'+esc(soc.iconShape||'circle')+'" style="--social-color:'+attr(soc.iconColor||'var(--primary)')+'" aria-label="'+esc(soc.name)+'"><i class="bx '+esc(soc.icon)+'"></i></a>';}
  });
  var pageLinks=pages.filter(function(p){return p.enabled;}).map(function(p){
    var href=s.__preview?'#pg-page-'+p.name:p.name+'.html';
    var previewAttr=s.__preview?' data-preview-page="'+attr(p.name)+'"':'';
    return'<a href="'+attr(href)+'"'+previewAttr+'>'+esc(p.navLabel||p.label||p.name)+'</a>';
  }).join('');
  return'<footer class="site-footer"><div class="footer-inner">'+
    '<div class="footer-brand"><strong>'+esc(m.name||'Portfolio')+'</strong>'+(footer.about?'<p>'+esc(footer.about)+'</p>':'')+'</div>'+
    '<nav class="footer-links" aria-label="Important pages">'+pageLinks+'</nav>'+
    '<div class="footer-socials">'+icons+'</div>'+
    '<span class="footer-copy">&copy; '+yr()+' '+esc(m.name||'Portfolio')+'</span>'+
    '<span class="footer-credit">Made with <a href="https://portfoliogen-one.vercel.app/" target="_blank" rel="noopener">PortfolioGen</a></span>'+
    '</div></footer>';
}

function buildFloatingInstructions(){
  return'<aside class="pg-instructions" id="pgInstructions" aria-label="Portfolio instructions">'+
    '<button type="button" class="pg-instructions-close" id="pgInstructionsClose" aria-label="Hide instructions"><i class="bx bx-x"></i></button>'+
    '<strong>Instructions</strong>'+
    '<p>Use the page links to move around this portfolio. Use the theme button if available, open project links in new tabs, and use the contact section to reach out.</p>'+
  '</aside>';
}

/* ===== BLOCK RENDERERS ===== */
var blockRenderers={
  hero:function(block,s,preview){
    var m=s.meta||{};var t=s.theme||{};var img=getPhotoSrc(s);
    var socials='';
    (s.socials||[]).forEach(function(soc){
      if(soc.inHero&&soc.url){socials+='<a href="'+attr(soc.url)+'" target="_blank" class="hero-social social-shape-'+esc(soc.iconShape||'circle')+'" style="--social-color:'+attr(soc.iconColor||'var(--primary)')+'"><i class="bx '+esc(soc.icon)+'"></i></a>';}
    });
    var contactHref=(s.pages||[]).some(function(p){return p.name==='contact'&&p.enabled;})?'contact.html':'#contact';
    var actions='<a href="'+contactHref+'" class="btn btn-primary">Get In Touch</a><a href="#projects" class="btn btn-outline">View Work</a>';
    if(m.resumeUrl)actions+='<a href="'+attr(m.resumeUrl)+'" target="_blank" class="btn btn-outline"><i class="bx bx-download"></i> Resume</a>';
    var typedAttr=t.heroEffect==='typedtext'?' data-typed="true"':'';
    var heroClass='bento-block block-hero hero-'+esc(t.heroLayout||'split');
    var heroExtras='';
    if(t.heroEffect==='floatingshapes') heroExtras+='<span class="hero-shape"></span><span class="hero-shape"></span>';
    if(t.heroEffect==='marquee') heroExtras+='<div class="hero-marquee" data-text="'+attr((m.name||'Portfolio')+' - '+(m.title||'Professional Portfolio'))+'"></div>';
    if(t.heroEffect==='noise') heroExtras+='<div class="hero-noise" aria-hidden="true"></div>';
    return'<section class="'+heroClass+'" data-reveal>'+
      (t.heroEffect==='particles'?'<canvas class="hero-canvas" id="heroCanvas"></canvas>':'')+
      (t.heroEffect==='wavebg'?'<div class="hero-waves"><svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg"><path d="M0 60 C360 120 1080 0 1440 60 L1440 120 L0 120Z" fill="var(--primary)" opacity=".15"/></svg></div>':'')+
      heroExtras+
      '<div class="hero-content">'+
        '<p class="hero-greeting">Hello, I am</p>'+
        '<h1 class="hero-name"'+typedAttr+' data-field="meta.name">'+esc(m.name||'Your Name')+'</h1>'+
        '<h2 class="hero-title" data-field="meta.title">'+esc(m.title||'Professional Title')+'</h2>'+
        '<p class="hero-tagline" data-field="meta.tagline">'+esc(m.tagline||'A professional tagline goes here.')+'</p>'+
        (m.addressCity?'<p class="hero-location"><i class="bx bx-map-pin"></i> '+esc([m.addressCity,m.addressCountry].filter(Boolean).join(', '))+'</p>':'')+
        (s.availabilityBadge?'<span class="availability-badge">'+esc(s.availabilityBadge)+'</span>':'')+
        '<div class="hero-actions">'+actions+'</div>'+
        (socials?'<div class="hero-socials">'+socials+'</div>':'')+
      '</div>'+
      '<div class="hero-img-wrap"><img src="'+attr(img)+'" alt="'+attr(m.name||'Profile')+'profile photo" class="hero-img" onerror="this.src=\''+AVATAR_SVG+'\'"></div>'+
    '</section>';
  },
  bio:function(block,s){
    var m=s.meta||{};
    return'<section class="bento-block block-bio" data-reveal>'+
      '<h2 class="block-title">About Me</h2>'+
      '<div class="bio-body">'+
        '<p class="bio-text" data-field="meta.bio">'+esc(m.bio||'Add your bio in step 1.')+'</p>'+
        (m.email?'<div class="bio-details"><a href="mailto:'+attr(m.email)+'" class="bio-link" data-field="meta.email"><i class="bx bx-envelope"></i> '+esc(m.email)+'</a>':'')+
        (m.phone?'<a href="tel:'+attr(m.phone)+'" class="bio-link"><i class="bx bx-phone"></i> '+esc(m.phone)+'</a>':'')+
        ((m.addressCity||m.addressCountry)?'<span class="bio-link"><i class="bx bx-map-pin"></i> '+esc([m.addressCity,m.addressState,m.addressCountry].filter(Boolean).join(', '))+'</span>':'')+
      '</div>'+
    '</section>';
  },
  skills:function(block,s){
    var skills=block.data&&block.data.skills&&block.data.skills.length?block.data.skills:[];
    var settings=(block.data&&block.data.settings)||(s.theme&&s.theme.skillDisplay)||{};
    var mode=settings.mode||'bars';
    var showCats=settings.showCategories!==false;
    var shape=settings.badgeShape||'pill';
    var search=settings.searchable?'<input type="search" class="skill-search" placeholder="Search skills..." aria-label="Search skills">':'';
    var byCat={};
    skills.forEach(function(sk){ var cat=sk.category||'General'; if(!byCat[cat])byCat[cat]=[]; byCat[cat].push(sk); });
    function itemAttrs(sk){ return' data-skill-name="'+attr(sk.name||'')+'" data-skill-category="'+attr(sk.category||'General')+'"'; }
    function barItem(sk){
      var lvl=clampPct(sk.level);var color=sk.color||'var(--primary)';
      return'<div class="skill-item">'+
        '<div class="skill-hd"><span class="skill-name">'+esc(sk.name)+'</span><span class="skill-pct">'+lvl+'%</span></div>'+
        '<div class="skill-bar"><div class="skill-fill" style="width:'+lvl+'%;background:'+esc(color)+'"></div></div>'+
        (showCats&&sk.category?'<span class="skill-cat">'+esc(sk.category)+'</span>':'')+
      '</div>';
    }
    var body='';
    if(mode==='cards'){
      body='<div class="skills-card-grid">'+skills.map(function(sk){ var lvl=clampPct(sk.level); return'<article class="skill-card-view"'+itemAttrs(sk)+' style="--skill-color:'+attr(sk.color||'var(--primary)')+'"><strong>'+esc(sk.name)+'</strong>'+(showCats&&sk.category?'<span>'+esc(sk.category)+'</span>':'')+'<b>'+lvl+'%</b></article>'; }).join('')+'</div>';
    } else if(mode==='chips'){
      body='<div class="skills-chip-cloud">'+skills.map(function(sk){ return'<span class="skill-chip skill-chip-'+esc(shape)+'"'+itemAttrs(sk)+' style="--skill-color:'+attr(sk.color||'var(--primary)')+'">'+esc(sk.name)+(showCats&&sk.category?' <small>'+esc(sk.category)+'</small>':'')+'</span>'; }).join('')+'</div>';
    } else if(mode==='tabs'){
      body='<div class="skills-tabs">'+Object.keys(byCat).map(function(cat,i){ return'<details '+(i===0?'open':'')+'><summary>'+esc(cat)+'</summary><div>'+byCat[cat].map(function(sk){ return'<span class="skill-chip skill-chip-'+esc(shape)+'"'+itemAttrs(sk)+'>'+esc(sk.name)+' '+clampPct(sk.level)+'%</span>'; }).join('')+'</div></details>'; }).join('')+'</div>';
    } else if(mode==='accordion'){
      body='<div class="skills-accordion">'+skills.map(function(sk,i){ return'<details '+(i===0?'open':'')+itemAttrs(sk)+'><summary>'+esc(sk.name)+'<span>'+clampPct(sk.level)+'%</span></summary><p>'+(showCats?esc(sk.category||'General'):'Skill')+' proficiency shown with expandable context.</p>'+barItem(sk)+'</details>'; }).join('')+'</div>';
    } else if(mode==='radial'){
      body='<div class="skills-radial-grid">'+skills.map(function(sk){ var lvl=clampPct(sk.level); return'<div class="skill-radial"'+itemAttrs(sk)+' style="--pct:'+lvl+'%;--skill-color:'+attr(sk.color||'var(--primary)')+'"><span>'+lvl+'%</span><strong>'+esc(sk.name)+'</strong>'+(showCats&&sk.category?'<small>'+esc(sk.category)+'</small>':'')+'</div>'; }).join('')+'</div>';
    } else if(mode==='table'){
      body='<div class="skills-table">'+skills.map(function(sk){ var lvl=clampPct(sk.level); return'<div class="skills-row"'+itemAttrs(sk)+'><strong>'+esc(sk.name)+'</strong><span>'+(showCats?esc(sk.category||'General'):'')+'</span><b>'+lvl+'%</b><div class="skill-bar"><div class="skill-fill" style="width:'+lvl+'%;background:'+attr(sk.color||'var(--primary)')+'"></div></div></div>'; }).join('')+'</div>';
    } else if(mode==='badges'){
      body='<div class="skills-badges">'+skills.map(function(sk){ return'<button type="button" class="skill-badge skill-chip-'+esc(shape)+'"'+itemAttrs(sk)+' style="--skill-color:'+attr(sk.color||'var(--primary)')+'"><span>'+esc(sk.name)+'</span><b>'+clampPct(sk.level)+'%</b>'+(showCats&&sk.category?'<small>'+esc(sk.category)+'</small>':'')+'</button>'; }).join('')+'</div>';
    } else {
      body='<div class="skills-list">'+skills.map(function(sk){ return'<div'+itemAttrs(sk)+'>'+barItem(sk)+'</div>'; }).join('')+'</div>';
    }
    return'<section class="bento-block block-skills skills-mode-'+esc(mode)+' '+(settings.animate?'skills-animated':'')+'" data-reveal>'+
      '<h2 class="block-title">Skills</h2>'+
      search+
      (skills.length?body:'<p class="muted">Add skills in step 3.</p>')+
    '</section>';
  },
  education:function(block,s){
    var items=(s.education||[]).map(function(item,i){
      var years=[item.startYear,item.endYear].filter(Boolean).join(' – ');
      return'<article class="edu-item">'+
        '<div class="timeline-dot"></div>'+
        '<div class="edu-card">'+
          '<h3 data-field="edu.institution.'+i+'">'+esc(item.institution||'Institution')+'</h3>'+
          '<p class="edu-degree"><span data-field="edu.degree.'+i+'">'+esc(item.degree||'Degree')+'</span>'+(item.field?' · '+esc(item.field):'')+'</p>'+
          '<div class="edu-meta"><span>'+esc(years||'Year')+'</span>'+(item.grade?'<span class="edu-grade">'+esc(item.grade)+'</span>':'')+  '</div>'+
          (item.desc?'<p class="edu-desc">'+esc(item.desc)+'</p>':'')+
        '</div>'+
      '</article>';
    }).join('');
    return'<section class="bento-block block-education" data-reveal>'+
      '<h2 class="block-title">Education</h2>'+
      '<div class="timeline">'+(items||'<p class="muted">Add education in step 1.</p>')+'</div>'+
    '</section>';
  },
  experience:function(block,s){
    var items=(s.experience||[]).map(function(item,i){
      var years=[item.from,item.to||'Present'].filter(Boolean).join(' – ');
      return'<article class="exp-item">'+
        '<div class="timeline-dot"></div>'+
        '<div class="exp-card">'+
          '<div class="exp-hd"><h3>'+esc(item.role||'Role')+'</h3><span class="exp-period">'+esc(years)+'</span></div>'+
          '<p class="exp-company"><i class="bx bx-building"></i> '+esc(item.company||'Company')+(item.location?' · '+esc(item.location):'')+'</p>'+
          (item.desc?'<p class="exp-desc">'+esc(item.desc)+'</p>':'')+
          (item.tags?'<div class="tag-list">'+item.tags.split(',').map(function(t){return'<span class="tag">'+esc(t.trim())+'</span>';}).join('')+'</div>':'')+
        '</div>'+
      '</article>';
    }).join('');
    return'<section class="bento-block block-experience" data-reveal>'+
      '<h2 class="block-title">Experience</h2>'+
      '<div class="timeline">'+(items||'<p class="muted">Add experience in step 1.</p>')+'</div>'+
    '</section>';
  },
  projects:function(block,s){
    var projects=block.data&&block.data.projects&&block.data.projects.length?block.data.projects:[];
    var cards=projects.map(function(p,i){
      var img=p.imageBase64?'<img src="'+attr(p.imageBase64)+'" alt="'+attr(p.title||'Project')+'" class="project-img">'
        :'<div class="project-img-ph" style="background:linear-gradient(135deg,var(--primary),var(--accent))"><i class="bx bx-code-block"></i></div>';
      var tags=p.tags?p.tags.split(',').map(function(t){return'<span class="tag">'+esc(t.trim())+'</span>';}).join(''):'';
      return'<article class="project-card">'+
        img+'<div class="project-body">'+
        '<div class="project-top"><span class="project-cat">'+esc(p.category||'Project')+'</span>'+
        (p.featured?'<span class="project-featured">Featured</span>':'')+
        '</div>'+
        '<h3 class="project-title" data-field="project.title.'+i+'">'+esc(p.title||'Untitled')+'</h3>'+
        '<p class="project-desc" data-field="project.desc.'+i+'">'+esc(p.desc||'Project description.')+'</p>'+
        (tags?'<div class="tag-list">'+tags+'</div>':'')+
        '<div class="project-links">'+
        (p.link?'<a href="'+attr(p.link)+'" target="_blank" class="btn btn-primary btn-sm">Live Demo</a>':'')+
        (p.source?'<a href="'+attr(p.source)+'" target="_blank" class="btn btn-outline btn-sm">Source</a>':'')+
        '</div></div>'+
      '</article>';
    }).join('');
    return'<section class="bento-block block-projects" data-reveal id="projects">'+
      '<h2 class="block-title">Projects</h2>'+
      '<div class="projects-grid">'+(cards||'<p class="muted">Add projects in step 3.</p>')+'</div>'+
    '</section>';
  },
  services:function(block,s){
    var items=(block.data&&block.data.services)||[];
    var cards=items.map(function(sv){
      return'<div class="service-card">'+
        '<div class="service-icon">'+esc(sv.emoji||'⚡')+'</div>'+
        '<h3>'+esc(sv.title||'Service')+'</h3>'+
        '<p>'+esc(sv.desc||'Description')+'</p>'+
        (sv.price?'<span class="service-price">'+esc(sv.price)+'</span>':'')+
      '</div>';
    }).join('');
    return'<section class="bento-block block-services" data-reveal>'+
      '<h2 class="block-title">Services</h2>'+
      '<div class="services-grid">'+(cards||'<p class="muted">Add services in step 3.</p>')+'</div>'+
    '</section>';
  },
  testimonials:function(block,s){
    var items=(s.testimonials||[]);
    var cards=items.map(function(t){
      return'<article class="testi-card">'+
        '<p class="testi-quote">&ldquo;'+esc(t.quote||'A great testimonial')+'&rdquo;</p>'+
        '<div class="testi-author">'+
          (t.avatar?'<img src="'+attr(t.avatar)+'" class="testi-avatar" alt="'+attr(t.name)+'">':'<div class="testi-avatar-ph">'+esc((t.name||'?').charAt(0))+'</div>')+
          '<div><strong>'+esc(t.name||'Name')+'</strong><span>'+esc(t.role||'Company')+'</span></div>'+
        '</div>'+
      '</article>';
    }).join('');
    return'<section class="bento-block block-testi" data-reveal>'+
      '<h2 class="block-title">Testimonials</h2>'+
      '<div class="testi-grid">'+(cards||'<p class="muted">Add testimonials in step 3.</p>')+'</div>'+
    '</section>';
  },
  certs:function(block,s){
    var items=(s.certs||[]).map(function(c){
      return'<div class="cert-card"><i class="bx bx-award"></i>'+
        '<div><strong>'+esc(c.name||'Certificate')+'</strong><span>'+esc(c.issuer||'')+(c.year?' · '+esc(c.year):'')+'</span></div>'+
        (c.url?'<a href="'+attr(c.url)+'" target="_blank" class="btn btn-ghost btn-sm"><i class="bx bx-link-external"></i></a>':'')+
      '</div>';
    }).join('');
    return'<section class="bento-block block-certs" data-reveal>'+
      '<h2 class="block-title">Certifications</h2>'+
      '<div class="certs-list">'+(items||'<p class="muted">Add certs in step 1.</p>')+'</div>'+
    '</section>';
  },
  contact:function(block,s){
    var m=s.meta||{};var ct=s.contact||{};
    return'<section class="bento-block block-contact" id="contact" data-reveal>'+
      '<h2 class="block-title">'+esc(ct.heading||'Get In Touch')+'</h2>'+
      (ct.subtext?'<p class="contact-subtext">'+esc(ct.subtext)+'</p>':'')+
      (ct.desc?'<p class="muted" style="margin-bottom:1rem">'+esc(ct.desc)+'</p>':'')+
      (ct.showForm!==false?
        '<form class="contact-form" onsubmit="handleContact(event)">'+
        '<div class="form-row"><input type="text" class="contact-input" placeholder="Your Name" required><input type="email" class="contact-input" placeholder="Your Email" required></div>'+
        '<input type="text" class="contact-input" placeholder="Subject">'+
        '<textarea class="contact-input" placeholder="Your message..." rows="5" required></textarea>'+
        '<button type="submit" class="btn btn-primary">Send Message <i class="bx bx-send"></i></button>'+
        '</form>'+
        '<p id="contactMsg" class="contact-success" style="display:none">Thank you! I\'ll get back to you soon.</p>':'')+
      '<div class="contact-details">'+
        (m.email?'<a href="mailto:'+attr(m.email)+'" class="contact-detail"><i class="bx bx-envelope"></i> '+esc(m.email)+'</a>':'')+
        (m.phone?'<a href="tel:'+attr(m.phone)+'" class="contact-detail"><i class="bx bx-phone"></i> '+esc(m.phone)+'</a>':'')+
        ((m.addressCity||m.addressCountry)?'<span class="contact-detail"><i class="bx bx-map-pin"></i> '+esc([m.addressCity,m.addressState,m.addressCountry].filter(Boolean).join(', '))+'</span>':'')+
      '</div>'+
      (ct.showMap&&ct.mapUrl?'<div class="map-wrap"><iframe src="'+attr(ct.mapUrl)+'" style="width:100%;height:300px;border:0;border-radius:var(--radius)" loading="lazy" allowfullscreen></iframe></div>':'')+
    '</section>';
  },
  socialLinks:function(block,s){
    var links=(s.socials||[]).filter(function(sc){return sc.url;}).map(function(sc){
      return'<a href="'+attr(sc.url)+'" target="_blank" class="social-link-item social-shape-'+esc(sc.iconShape||'circle')+'" style="--social-color:'+attr(sc.iconColor||'var(--primary)')+'">'+
        '<i class="bx '+esc(sc.icon)+'"></i><span>'+esc(sc.name)+'</span>'+
        '<i class="bx bx-chevron-right" style="margin-left:auto;color:var(--muted)"></i>'+
      '</a>';
    }).join('');
    return'<section class="bento-block block-socials" data-reveal>'+
      '<h2 class="block-title">Connect</h2>'+
      '<div class="socials-list">'+(links||'<p class="muted">Add social links in step 4.</p>')+'</div>'+
    '</section>';
  },
  githubFeed:function(block,s,preview){
    var user=s.integrations&&s.integrations.githubCommits&&s.integrations.githubUsername?s.integrations.githubUsername:'';
    return'<section class="bento-block block-github" data-reveal>'+
      '<h2 class="block-title">Recent GitHub Activity</h2>'+
      '<div id="gh-feed" class="gh-feed">'+(user?'<div class="gh-loading"><i class="bx bx-loader-alt bx-spin"></i> Loading...</div>':'<p class="muted">Enable GitHub and add a username in Step 4.</p>')+'</div>'+
      (user?'<script>window.__GH_USER="'+attr(user)+'";<\/script>':'')+
    '</section>';
  },
  stats:function(block,s){
    var items=(block.data&&block.data.stats)||[{n:'50+',label:'Projects'},{n:'3+',label:'Years Exp.'},{n:'100%',label:'Client Satisfaction'}];
    var cards=items.map(function(st){
      return'<div class="stat-card"><span class="stat-num">'+esc(st.n)+'</span><span class="stat-label">'+esc(st.label)+'</span></div>';
    }).join('');
    return'<section class="bento-block block-stats" data-reveal>'+
      '<div class="stats-grid">'+cards+'</div>'+
    '</section>';
  },
  gallery:function(block,s){
    var imgs=(block.data&&block.data.images)||[];
    var cells=imgs.map(function(img){
      return'<div class="gallery-cell"><img src="'+attr(img.src)+'" alt="'+attr(img.alt||'Gallery')+'" class="gallery-img"></div>';
    }).join('');
    return'<section class="bento-block block-gallery" data-reveal>'+
      '<h2 class="block-title">Gallery</h2>'+
      '<div class="gallery-grid">'+(cells||'<div class="gallery-ph"><i class="bx bx-image-add"></i><p>Upload images after export</p></div>')+'</div>'+
    '</section>';
  },
  timeline:function(block,s){
    return'<section class="bento-block block-timeline" data-reveal>'+
      '<h2 class="block-title">Timeline</h2>'+
      '<div class="timeline">'+
        '<article class="timeline-item"><div class="timeline-dot"></div><div class="timeline-card"><h3>Your journey starts here</h3><p>Add experience and education entries in step 1.</p></div></article>'+
      '</div>'+
    '</section>';
  }
};

function compileBlock(block,s,preview){
  var r=blockRenderers[block.type];
  return r?r(block,s,preview):'<!--unknown block:'+esc(block.type)+'-->';
}

/* ===== CSS BUILDER ===== */
function buildCSS(s){
  var t=s.theme||{};
  var gap=t.spacing==='compact'?'.75rem':t.spacing==='relaxed'?'2rem':t.spacing==='airy'?'3rem':'1.25rem';
  var font=t.fontFamily||'Inter';
  var radius=t.borderRadius||'.75rem';
  var primary=t.primaryColor||'#0C9B70';var secondary=t.secondaryColor||'#042444';var accent=t.accentColor||'#1db88e';
  var gradA=t.gradientColorA||primary, gradB=t.gradientColorB||accent, gradC=t.gradientColorC||secondary;
  var surface=t.surfaceColor||'#ffffff';
  var bg='#f8fafc';
  // Aesthetic overrides
  var aestheticCSS=getAestheticCSS(t,primary,secondary,accent,surface,radius);
  // Gradient BG
  var gradientCSS='';
  if(t.gradientPreset&&t.gradientPreset!=='none'){
    var gr=GRADIENTS.find(function(g){return g.id===t.gradientPreset;});
    if(gr&&gr.css)gradientCSS='body{background:'+gr.css+' fixed;background-size:cover;}';
  } else if(t.gradientType&&t.gradientType!=='none'){
    if(t.gradientType==='linear') gradientCSS='body{background:linear-gradient('+((t.gradientDir||'135deg'))+','+gradA+','+gradB+','+gradC+') fixed;background-size:cover;}';
    if(t.gradientType==='radial') gradientCSS='body{background:radial-gradient(circle at top left,'+gradA+',transparent 42%),radial-gradient(circle at bottom right,'+gradB+',transparent 38%),'+gradC+' fixed;background-size:cover;}';
    if(t.gradientType==='conic') gradientCSS='body{background:conic-gradient(from 180deg at 50% 50%,'+gradA+','+gradB+','+gradC+','+gradA+') fixed;background-size:cover;}';
    if(t.gradientType==='mesh') gradientCSS='body{background:radial-gradient(at 20% 30%,'+gradA+' 0%,transparent 45%),radial-gradient(at 80% 20%,'+gradB+' 0%,transparent 40%),radial-gradient(at 50% 85%,'+gradC+' 0%,transparent 50%),#f8fafc fixed;background-size:cover;}';
  }
  // Hero layout
  var heroLayoutCSS=getHeroLayoutCSS(t.heroLayout||'split');
  // Effects
  var effectsCSS=getEffectsCSS(t);
  // Image filter
  var imgFilterCSS=getImageFilterCSS(t.imageEffect||'none');
  // Cursor
  var cursorCSS=getCursorCSS(t.cursorEffect||'none');
  // Page transition
  var pageTransCSS=t.pageTransitions?'body{opacity:0;transition:opacity .3s}body.pg-ready{opacity:1}body.pg-exit{opacity:0}\n':'';

  return'@import url("https://fonts.googleapis.com/css2?family='+font.replace(/ /g,'+')+':wght@300;400;500;600;700;800&display=swap");\n'
    +':root{'
      +'--primary:'+primary+';--secondary:'+secondary+';--accent:'+accent+';--surface:'+surface+';'
      +'--font:"'+font+'",system-ui,sans-serif;--radius:'+radius+';--gap:'+gap+';'
      +'--bg:#f8fafc;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--z:100;'
    +'}\n'
    +'*,::before,::after{box-sizing:border-box}html{scroll-behavior:smooth}\n'
    +'body{margin:0;font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.65}\n'
    +'h1,h2,h3,h4{margin:0;line-height:1.2}p{margin:0}a{text-decoration:none;color:inherit}img{max-width:100%;display:block}\n'
    +'.muted{color:var(--muted);font-size:.9rem}\n'
    +(t.darkMode?'body.dark{--bg:#0f172a;--surface:#1e293b;--text:#f1f5f9;--muted:#94a3b8;--border:#334155}\n':'')
    // NAV
    +'.site-header{position:fixed;top:.65rem;left:.65rem;right:.65rem;z-index:var(--z);'
      +'background:rgba(255,255,255,.92);backdrop-filter:blur(16px);'
      +'border:1px solid rgba(15,23,42,.07);border-radius:14px;box-shadow:0 6px 24px rgba(15,23,42,.07)}\n'
    +'body.dark .site-header{background:rgba(15,23,42,.92);border-color:rgba(255,255,255,.07)}\n'
    +'.site-nav{max-width:1140px;margin:0 auto;padding:.75rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}\n'
    +'.nav-logo{font-weight:800;color:var(--primary);font-size:1.05rem}\n'
    +'.nav-list{display:flex;align-items:center;gap:1.1rem;list-style:none;margin:0;padding:0}\n'
    +'.nav-link{font-weight:600;font-size:.88rem;color:var(--muted);transition:color .15s}\n'
    +'.nav-link:hover,.nav-link.active{color:var(--primary)}\n'
    +'.nav-resume{border:1.5px solid var(--primary);padding:.32rem .65rem;border-radius:var(--radius);color:var(--primary)}\n'
    +'.nav-btns{display:flex;align-items:center;gap:.5rem}\n'
    +'.nav-social-link{width:32px;height:32px;display:grid;place-items:center;color:var(--muted);font-size:1.1rem;border-radius:50%;transition:all .15s}\n'
    +'.nav-social-link:hover{color:var(--social-color,var(--primary));background:color-mix(in srgb,var(--social-color,var(--primary)) 14%,transparent)}\n'
    +'.social-shape-circle{border-radius:50%!important}.social-shape-square{border-radius:4px!important}.social-shape-soft{border-radius:12px!important}\n'
    +'.nav-theme-btn,.nav-toggle{border:0;background:transparent;cursor:pointer;color:var(--text);font-size:1.2rem;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transition:all .15s}\n'
    +'.nav-theme-btn:hover,.nav-toggle:hover{background:var(--border)}\n'
    +'.nav-toggle{display:none}\n'
    +'@media(max-width:768px){.nav-toggle{display:grid}.nav-menu{display:none;position:fixed;top:4.5rem;left:.65rem;right:.65rem;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1rem;box-shadow:0 12px 32px rgba(15,23,42,.15)}.nav-menu.open{display:block}.nav-list{display:grid;gap:.65rem}}\n'
    // MAIN GRID
    +'main.page-grid{max-width:1140px;margin:6rem auto 4rem;padding:0 1rem;display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gap)}\n'
    +'.bento-cell{min-width:0}\n'
    +'@media(max-width:768px){.bento-cell{grid-column:span 12!important}}\n'
    // BLOCKS BASE
    +aestheticCSS
    +'.bento-block{padding:1.5rem;height:100%;display:flex;flex-direction:column;overflow:hidden}\n'
    +'.block-title{font-size:.88rem;font-weight:800;color:var(--primary);text-transform:uppercase;letter-spacing:.1em;margin-bottom:1.1rem}\n'
    +'.btn{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:.6rem 1rem;border-radius:var(--radius);font-weight:700;font-size:.86rem;border:2px solid transparent;cursor:pointer;transition:all .15s}\n'
    +'.btn-primary{background:var(--primary);color:#fff;border-color:var(--primary)}\n'
    +'.btn-primary:hover{filter:brightness(1.1)}\n'
    +'.btn-outline{background:transparent;border-color:var(--primary);color:var(--primary)}\n'
    +'.btn-outline:hover{background:var(--primary);color:#fff}\n'
    +'.btn-ghost{background:transparent;color:var(--muted);border-color:transparent}\n'
    +'.btn-sm{padding:.38rem .7rem;font-size:.78rem}\n'
    +'.tag{display:inline-flex;padding:.18rem .5rem;border-radius:999px;font-size:.72rem;font-weight:700;background:rgba(12,155,112,.1);color:var(--primary);margin:.15rem}\n'
    +'.tag-list{display:flex;flex-wrap:wrap;gap:.2rem;margin:.5rem 0}\n'
    +'.availability-badge{display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .75rem;border-radius:999px;font-size:.8rem;font-weight:700;background:rgba(12,155,112,.12);color:var(--primary);border:1px solid rgba(12,155,112,.25);margin:.75rem 0;width:fit-content}\n'
    // HERO
    +'.block-hero{flex-direction:row;align-items:center;justify-content:space-between;gap:2.5rem;grid-column:span 12;min-height:420px;position:relative;overflow:hidden}\n'
    +'.hero-content{flex:1;max-width:600px;position:relative;z-index:1}\n'
    +'.hero-greeting{color:var(--primary);font-weight:800;font-size:.75rem;text-transform:uppercase;letter-spacing:.16em;margin-bottom:.6rem}\n'
    +'.hero-name{font-size:clamp(2.2rem,5vw,3.8rem);font-weight:800;color:var(--secondary);line-height:1.05;margin-bottom:.35rem}\n'
    +'body.dark .hero-name{color:var(--text)}\n'
    +'.hero-title{font-size:clamp(1rem,2vw,1.4rem);color:var(--primary);margin-bottom:.65rem;font-weight:600}\n'
    +'.hero-tagline{color:var(--muted);max-width:520px;margin-bottom:1rem;font-size:1rem}\n'
    +'.hero-location{color:var(--muted);font-size:.85rem;display:flex;align-items:center;gap:.35rem;margin-bottom:1rem}\n'
    +'.hero-actions{display:flex;gap:.65rem;flex-wrap:wrap;margin-bottom:1rem}\n'
    +'.hero-socials{display:flex;gap:.5rem}\n'
    +'.hero-social{width:38px;height:38px;border-radius:50%;border:1.5px solid var(--border);display:grid;place-items:center;color:var(--muted);font-size:1.1rem;transition:all .15s}\n'
    +'.hero-social:hover{border-color:var(--social-color,var(--primary));color:var(--social-color,var(--primary));background:color-mix(in srgb,var(--social-color,var(--primary)) 12%,transparent)}\n'
    +'.hero-img-wrap{flex-shrink:0;position:relative;z-index:1}\n'
    +'.hero-img{width:200px;height:200px;border-radius:var(--radius);object-fit:cover;border:3px solid var(--primary);box-shadow:0 20px 60px rgba(12,155,112,.25)}\n'
    +'@media(max-width:640px){.block-hero{flex-direction:column;align-items:flex-start;min-height:auto}.hero-img{width:130px;height:130px}}\n'
    +heroLayoutCSS
    // BIO
    +'.bio-text{color:var(--muted);line-height:1.85;margin-bottom:1rem;white-space:pre-line}\n'
    +'.bio-details{display:grid;gap:.5rem}\n'
    +'.bio-link{display:flex;align-items:center;gap:.45rem;color:var(--muted);font-size:.88rem;transition:color .15s}\n'
    +'.bio-link:hover{color:var(--primary)}\n'
    // SKILLS
    +'.skills-list{display:grid;gap:.9rem}\n'
    +'.skill-item{}\n'
    +'.skill-hd{display:flex;justify-content:space-between;margin-bottom:.3rem}\n'
    +'.skill-name{font-weight:700;font-size:.9rem}\n'
    +'.skill-pct{font-weight:800;color:var(--primary);font-size:.85rem}\n'
    +'.skill-bar{height:6px;background:var(--border);border-radius:999px;overflow:hidden}\n'
    +'.skill-fill{height:100%;border-radius:999px;transition:width .6s cubic-bezier(.4,0,.2,1)}\n'
    +'.skill-cat{font-size:.7rem;color:var(--muted);margin-top:.2rem;display:block}\n'
    +'.skill-search{width:100%;margin-bottom:1rem;padding:.7rem .85rem;border:1.5px solid var(--border);border-radius:var(--radius);background:var(--bg);color:var(--text)}\n'
    +'.skills-card-grid,.skills-radial-grid,.skills-badges{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.75rem}.skill-card-view{position:relative;padding:1rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);overflow:hidden}.skill-card-view::before{content:"";position:absolute;inset:0 0 auto;height:4px;background:var(--skill-color,var(--primary))}.skill-card-view strong,.skill-card-view span,.skill-card-view b{display:block}.skill-card-view b{margin-top:.65rem;color:var(--skill-color,var(--primary));font-size:1.35rem}\n'
    +'.skills-chip-cloud{display:flex;flex-wrap:wrap;gap:.5rem}.skill-chip,.skill-badge{display:inline-flex;align-items:center;gap:.35rem;padding:.48rem .72rem;border:1px solid color-mix(in srgb,var(--skill-color,var(--primary)) 35%,var(--border));background:color-mix(in srgb,var(--skill-color,var(--primary)) 12%,transparent);color:var(--text);font-weight:800;font-size:.82rem}.skill-chip small,.skill-badge small{color:var(--muted);font-weight:600}.skill-chip-pill{border-radius:999px}.skill-chip-square{border-radius:4px}.skill-chip-soft{border-radius:12px}\n'
    +'.skills-tabs,.skills-accordion{display:grid;gap:.65rem}.skills-tabs details,.skills-accordion details{border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);padding:.75rem}.skills-tabs summary,.skills-accordion summary{cursor:pointer;font-weight:800;color:var(--primary)}.skills-tabs details>div{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.65rem}.skills-accordion summary{display:flex;justify-content:space-between;gap:1rem}.skills-accordion p{color:var(--muted);font-size:.85rem;margin:.55rem 0}\n'
    +'.skill-radial{--pct:70%;display:grid;place-items:center;text-align:center;gap:.2rem;min-height:150px;padding:1rem;border-radius:var(--radius);background:conic-gradient(var(--skill-color,var(--primary)) var(--pct),var(--border) 0);position:relative}.skill-radial::before{content:"";position:absolute;inset:10px;border-radius:inherit;background:var(--surface)}.skill-radial>*{position:relative}.skill-radial span{font-weight:900;color:var(--skill-color,var(--primary));font-size:1.25rem}.skill-radial small{color:var(--muted)}\n'
    +'.skills-table{display:grid;gap:.45rem}.skills-row{display:grid;grid-template-columns:1fr .8fr 44px 1fr;align-items:center;gap:.65rem;padding:.65rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}.skills-row span{color:var(--muted);font-size:.82rem}.skills-row b{color:var(--primary)}\n'
    +'.skill-badge{position:relative;cursor:help;background:var(--bg)}.skill-badge b,.skill-badge small{opacity:0;position:absolute;left:50%;bottom:calc(100% + .45rem);transform:translateX(-50%) translateY(4px);white-space:nowrap;background:var(--text);color:var(--surface);padding:.25rem .45rem;border-radius:6px;transition:all .15s}.skill-badge:hover b,.skill-badge:hover small{opacity:1;transform:translateX(-50%) translateY(0)}.skill-badge small{bottom:calc(100% + 2rem)}\n'
    +'.skills-animated.revealed .skill-fill{animation:skillGrow .8s ease both}.skills-animated.revealed .skill-card-view,.skills-animated.revealed .skill-chip,.skills-animated.revealed .skill-radial,.skills-animated.revealed .skill-badge{animation:skillPop .45s ease both}@keyframes skillGrow{from{width:0}}@keyframes skillPop{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}\n'
    +'@media(max-width:640px){.skills-row{grid-template-columns:1fr}.skills-row .skill-bar{width:100%}}\n'
    // TIMELINE
    +'.timeline{position:relative;display:grid;gap:1.1rem;padding-left:1.5rem}\n'
    +'.timeline::before{content:"";position:absolute;left:.35rem;top:.2rem;bottom:.2rem;width:2px;background:linear-gradient(to bottom,var(--primary),var(--accent))}\n'
    +'.timeline-dot{position:absolute;left:-1.45rem;top:.9rem;width:12px;height:12px;border-radius:50%;background:var(--primary);border:3px solid var(--surface);box-shadow:0 0 0 3px rgba(12,155,112,.2)}\n'
    +'.edu-item,.exp-item,.timeline-item{position:relative}\n'
    +'.edu-card,.exp-card,.timeline-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:.9rem}\n'
    +'.edu-card h3,.exp-card h3,.timeline-card h3{font-size:.98rem;margin-bottom:.2rem}\n'
    +'.edu-degree,.exp-company{color:var(--muted);font-size:.88rem;margin-bottom:.4rem;display:flex;align-items:center;gap:.35rem}\n'
    +'.edu-meta{display:flex;flex-wrap:wrap;gap:.5rem;font-size:.78rem;color:var(--primary);font-weight:700;margin:.4rem 0}\n'
    +'.edu-grade{background:rgba(12,155,112,.1);padding:.12rem .4rem;border-radius:999px}\n'
    +'.edu-desc,.exp-desc{color:var(--muted);font-size:.88rem;margin-top:.4rem}\n'
    +'.exp-hd{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.2rem}\n'
    +'.exp-period{font-size:.78rem;color:var(--muted);font-weight:600;white-space:nowrap}\n'
    +'@media(max-width:600px){.timeline{padding-left:0}.timeline::before,.timeline-dot{display:none}}\n'
    // PROJECTS
    +'.projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}\n'
    +'.project-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s,box-shadow .2s}\n'
    +'.project-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(15,23,42,.12)}\n'
    +'.project-img{width:100%;aspect-ratio:16/9;object-fit:cover}\n'
    +imgFilterCSS
    +'.project-img-ph{width:100%;aspect-ratio:16/9;display:grid;place-items:center;color:rgba(255,255,255,.6);font-size:2rem}\n'
    +'.project-body{padding:1rem;flex:1;display:flex;flex-direction:column;gap:.45rem}\n'
    +'.project-top{display:flex;align-items:center;gap:.5rem}\n'
    +'.project-cat{font-size:.7rem;color:var(--primary);font-weight:800;text-transform:uppercase;letter-spacing:.08em}\n'
    +'.project-featured{font-size:.68rem;font-weight:800;background:var(--primary);color:#fff;padding:.12rem .4rem;border-radius:999px}\n'
    +'.project-title{font-size:1rem;font-weight:700}\n'
    +'.project-desc{color:var(--muted);font-size:.88rem;flex:1}\n'
    +'.project-links{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem}\n'
    // SERVICES
    +'.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}\n'
    +'.service-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.1rem;text-align:center;transition:transform .2s}\n'
    +'.service-card:hover{transform:translateY(-3px)}\n'
    +'.service-icon{font-size:2.2rem;margin-bottom:.65rem}\n'
    +'.service-card h3{font-size:1rem;margin-bottom:.4rem}\n'
    +'.service-card p{color:var(--muted);font-size:.88rem}\n'
    +'.service-price{display:inline-block;margin-top:.5rem;font-size:.82rem;font-weight:700;color:var(--primary)}\n'
    // TESTIMONIALS
    +'.testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}\n'
    +'.testi-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.1rem}\n'
    +'.testi-quote{color:var(--text);font-style:italic;line-height:1.7;margin-bottom:.85rem}\n'
    +'.testi-author{display:flex;align-items:center;gap:.65rem}\n'
    +'.testi-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover}\n'
    +'.testi-avatar-ph{width:40px;height:40px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center;font-weight:700}\n'
    +'.testi-author strong{display:block;font-size:.88rem}\n'
    +'.testi-author span{color:var(--muted);font-size:.78rem}\n'
    // CERTS
    +'.certs-list{display:grid;gap:.6rem}\n'
    +'.cert-card{display:flex;align-items:center;gap:.75rem;padding:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}\n'
    +'.cert-card i{font-size:1.5rem;color:var(--primary);flex-shrink:0}\n'
    +'.cert-card strong{display:block;font-size:.88rem;margin-bottom:.1rem}\n'
    +'.cert-card span{color:var(--muted);font-size:.78rem}\n'
    // CONTACT
    +'.contact-form{display:grid;gap:.75rem;margin-bottom:1rem}\n'
    +'.form-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}\n'
    +'@media(max-width:600px){.form-row{grid-template-columns:1fr}}\n'
    +'.contact-input{width:100%;padding:.7rem .85rem;border:1.5px solid var(--border);border-radius:var(--radius);background:var(--bg);color:var(--text);font:inherit;transition:border-color .15s}\n'
    +'.contact-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(12,155,112,.12)}\n'
    +'.contact-success{color:#166534;background:#dcfce7;border:1px solid #86efac;padding:.75rem;border-radius:var(--radius);margin-top:.5rem}\n'
    +'.contact-subtext{color:var(--primary);font-weight:700;margin-bottom:.5rem}\n'
    +'.contact-details{display:grid;gap:.5rem;margin-top:1rem}\n'
    +'.contact-detail{display:flex;align-items:center;gap:.5rem;color:var(--muted);font-size:.88rem;transition:color .15s}\n'
    +'.contact-detail:hover{color:var(--primary)}\n'
    +'.map-wrap{margin-top:1rem;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border)}\n'
    // SOCIALS
    +'.socials-list{display:grid;gap:.6rem}\n'
    +'.social-link-item{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);font-weight:600;font-size:.88rem;transition:all .15s}\n'
    +'.social-link-item i{font-size:1.2rem;color:var(--social-color,var(--primary))}\n'
    +'.social-link-item:hover{border-color:var(--social-color,var(--primary));transform:translateX(4px)}\n'
    // GITHUB FEED
    +'.gh-feed{display:grid;gap:.5rem}\n'
    +'.gh-commit{border-left:3px solid var(--primary);padding:.55rem .7rem;background:var(--bg);border-radius:0 var(--radius) var(--radius) 0}\n'
    +'.gh-repo{font-size:.75rem;color:var(--primary);font-weight:700}\n'
    +'.gh-msg{font-size:.85rem;margin:.1rem 0}\n'
    +'.gh-date{font-size:.73rem;color:var(--muted)}\n'
    // STATS
    +'.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem}\n'
    +'.stat-card{text-align:center;padding:1.25rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}\n'
    +'.stat-num{display:block;font-size:2.2rem;font-weight:800;color:var(--primary);line-height:1}\n'
    +'.stat-label{display:block;color:var(--muted);font-size:.82rem;margin-top:.4rem}\n'
    // GALLERY
    +'.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.75rem}\n'
    +'.gallery-cell{border-radius:var(--radius);overflow:hidden;aspect-ratio:1}\n'
    +'.gallery-img{width:100%;height:100%;object-fit:cover;transition:transform .3s}\n'
    +'.gallery-img:hover{transform:scale(1.05)}\n'
    +'.gallery-ph{display:grid;place-items:center;gap:.5rem;border:2px dashed var(--border);border-radius:var(--radius);padding:2rem;color:var(--muted);text-align:center}\n'
    // FOOTER
    +'.site-footer{background:linear-gradient(135deg,var(--secondary),#0b1a30);color:#fff;padding:1.75rem 1rem;margin-top:1rem}\n'
    +'.footer-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:1.2fr auto auto;align-items:center;gap:1rem}\n'
    +'.footer-brand strong{display:block;font-size:1rem;margin-bottom:.2rem}.footer-brand p{max-width:420px;color:rgba(255,255,255,.62);font-size:.82rem;line-height:1.55}\n'
    +'.footer-links{display:flex;flex-wrap:wrap;gap:.65rem 1rem;align-items:center}.footer-links a{font-size:.82rem;font-weight:700;color:rgba(255,255,255,.72)}.footer-links a:hover{color:var(--accent)}\n'
    +'.footer-copy,.footer-credit{font-size:.8rem;color:rgba(255,255,255,.55)}\n'
    +'.footer-credit a{color:var(--accent);font-weight:800}\n'
    +'.footer-socials{display:flex;gap:.45rem}\n'
    +'.footer-social{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.1);display:grid;place-items:center;color:#fff;font-size:1.1rem;transition:all .15s}\n'
    +'.footer-social:hover{background:var(--social-color,var(--primary))}\n'
    +'.pg-instructions{position:fixed;right:1rem;bottom:1rem;z-index:120;width:min(300px,calc(100vw - 2rem));padding:1rem 1rem 1rem 1.1rem;background:rgba(255,255,255,.95);color:var(--text);border:1px solid var(--border);border-left:4px solid var(--primary);border-radius:var(--radius);box-shadow:0 18px 50px rgba(15,23,42,.16);backdrop-filter:blur(12px)}\n'
    +'body.dark .pg-instructions{background:rgba(30,41,59,.95)}.pg-instructions strong{display:block;margin-bottom:.3rem;color:var(--primary)}.pg-instructions p{font-size:.82rem;color:var(--muted);line-height:1.55}.pg-instructions-close{position:absolute;right:.45rem;top:.45rem;width:28px;height:28px;border:0;background:transparent;color:var(--muted);font-size:1.1rem;cursor:pointer;border-radius:50%}.pg-instructions-close:hover{background:var(--border);color:var(--text)}\n'
    +'@media(max-width:768px){.footer-inner{grid-template-columns:1fr}.footer-links{justify-content:flex-start}.pg-instructions{left:1rem;right:1rem;width:auto}}\n'
    +pageTransCSS+effectsCSS+cursorCSS+gradientCSS;
}

function getAestheticCSS(t,primary,secondary,accent,surface,radius){
  var style=t.aesthetic||'clean';
  var map={
    clean:'.bento-block{background:'+surface+';border:1px solid var(--border);border-radius:'+radius+';box-shadow:0 2px 16px rgba(15,23,42,.05);transition:transform .2s,box-shadow .2s}.bento-block:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(15,23,42,.09)}\n',
    glassmorphism:'.bento-block{background:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.45);border-radius:'+radius+';box-shadow:0 20px 60px rgba(15,23,42,.12);backdrop-filter:blur(20px)}body{background:linear-gradient(135deg,'+primary+','+secondary+') fixed;background-size:cover}\n',
    neumorphism:'.bento-block{background:#e0e5ec;border:0;border-radius:'+radius+';box-shadow:8px 8px 16px #b8bec7,-8px -8px 16px #fff}.bento-block:active{box-shadow:inset 4px 4px 8px #b8bec7,inset -4px -4px 8px #fff}body{background:#e0e5ec}\n',
    claymorphism:'.bento-block{background:'+surface+';border:0;border-radius:24px;box-shadow:8px 8px 0 0 rgba(0,0,0,.08),0 20px 60px rgba(15,23,42,.12);padding:2rem}\n',
    brutalism:'.bento-block{background:'+surface+';border:3px solid #111;border-radius:0;box-shadow:6px 6px 0 #111}.btn{border-radius:0!important;border:2px solid #111;box-shadow:3px 3px 0 #111}\n',
    neubrutalism:'.bento-block{background:'+surface+';border:2.5px solid #111;border-radius:8px;box-shadow:5px 5px 0 #111}.bento-block:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 #111}.btn{border-radius:6px;border:2px solid #111;box-shadow:3px 3px 0 #111}\n',
    minimalist:'.bento-block{background:transparent;border:0;border-top:1px solid var(--border);border-radius:0;padding:2rem 0;box-shadow:none}\n',
    darkmode:'.bento-block{background:#1e293b;border:1px solid #334155;border-radius:'+radius+';box-shadow:0 4px 20px rgba(0,0,0,.3)}body,html{background:#0f172a!important;color:#f1f5f9!important}:root{--border:#334155;--surface:#1e293b;--text:#f1f5f9;--muted:#94a3b8}\n',
    aurora:'.bento-block{background:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.4);border-radius:'+radius+';box-shadow:0 0 40px rgba('+hexToRgb(primary)+',.2),0 20px 60px rgba(15,23,42,.1);backdrop-filter:blur(12px)}\n',
    retrofuturism:'.bento-block{background:#0d0d2b;border:1px solid '+primary+';border-radius:0;box-shadow:0 0 12px rgba('+hexToRgb(primary)+',.5),inset 0 0 20px rgba('+hexToRgb(primary)+',.03);color:#e2e8f0}body{background:#060614;color:#e2e8f0}.block-title{color:'+accent+'}.btn-primary{box-shadow:0 0 12px rgba('+hexToRgb(primary)+',.6)}\n',
    material:'.bento-block{background:'+surface+';border:0;border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,.1),0 4px 16px rgba(0,0,0,.05)}.btn{border-radius:20px;letter-spacing:.05em}\n',
    fluent:'.bento-block{background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.6);border-radius:'+radius+';box-shadow:0 2px 8px rgba(15,23,42,.08);backdrop-filter:blur(40px) saturate(180%)}\n',
    holographic:'.bento-block{background:linear-gradient(135deg,rgba(240,171,252,.15),rgba(129,140,248,.15),rgba(103,232,249,.15));border:1px solid rgba(255,255,255,.4);border-radius:'+radius+';box-shadow:0 20px 60px rgba(15,23,42,.12);backdrop-filter:blur(20px)}body{background:linear-gradient(135deg,#1a0533,#0a1628) fixed}\n',
    glitchart:'.bento-block{background:#0d1117;border:1px solid '+primary+';border-radius:0;color:#f0f6fc;position:relative}.bento-block::before{content:"";position:absolute;top:-1px;left:-1px;right:-1px;bottom:-1px;background:linear-gradient(90deg,'+primary+',transparent);opacity:.3;z-index:-1}body{background:#010409;color:#f0f6fc}\n',
    bento:'.bento-block{background:'+surface+';border:1px solid var(--border);border-radius:var(--radius);padding:1rem;box-shadow:none}.bento-block:hover{border-color:var(--primary)}\n',
    editorial:'.bento-block{background:transparent;border:0;border-radius:0;box-shadow:none;padding:0}.block-title{font-size:.7rem;font-weight:900;letter-spacing:.2em;text-transform:uppercase;border-bottom:3px solid var(--primary);padding-bottom:.3rem;width:fit-content;margin-bottom:1.25rem}\n',
    organic:'.bento-block{background:'+surface+';border:0;border-radius:2rem 4rem 1.5rem 3.5rem / 3rem 1.5rem 3.5rem 2rem;box-shadow:0 12px 40px rgba(15,23,42,.08)}\n',
    cyberpunk:'.bento-block{background:#0a0a0a;border:1px solid #eab308;border-radius:0;box-shadow:0 0 12px rgba(234,179,8,.3),inset 0 0 8px rgba(234,179,8,.05);color:#f5f5f5}body{background:#050505;color:#f5f5f5}.block-title{color:#eab308}.btn-primary{background:#eab308;border-color:#eab308;color:#000;box-shadow:0 0 12px rgba(234,179,8,.5)}\n',
    spatial:'.bento-block{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:20px;box-shadow:0 32px 80px rgba(0,0,0,.4);backdrop-filter:blur(24px);transform-style:preserve-3d}body{background:linear-gradient(135deg,#0f172a,#1a0533) fixed;perspective:1200px}\n',
    flat2:'.bento-block{background:'+surface+';border:0;border-radius:'+radius+';box-shadow:0 4px 12px rgba(15,23,42,.04);transition:box-shadow .2s}.bento-block:hover{box-shadow:0 8px 24px rgba(15,23,42,.08)}\n',
    skeuomorphism:'.bento-block{background:linear-gradient(180deg,#f5f5f5,#e8e8e8);border:1px solid #ccc;border-radius:'+radius+';box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 4px 8px rgba(0,0,0,.15)}\n',
    parallax:'.bento-block{background:'+surface+';border:1px solid var(--border);border-radius:'+radius+';box-shadow:var(--shadow);transform-style:preserve-3d;transition:transform .1s}',
    splitscreen:'.bento-block{background:'+surface+';border:0;border-radius:0;box-shadow:none;border-right:4px solid var(--primary)}\n',
    generativeai:'.bento-block{background:rgba(255,255,255,.05);border:1px solid rgba('+hexToRgb(primary)+',.3);border-radius:'+radius+';box-shadow:0 0 40px rgba('+hexToRgb(primary)+',.08),0 0 80px rgba('+hexToRgb(accent)+',.04);backdrop-filter:blur(8px)}body{background:linear-gradient(135deg,#030712,#0c1a12) fixed}\n',
    cardgrid:'.bento-block{background:'+surface+';border:1px solid var(--border);border-radius:'+radius+';box-shadow:0 2px 8px rgba(15,23,42,.04);transition:all .2s}.bento-block:hover{box-shadow:0 12px 32px rgba(15,23,42,.12);transform:translateY(-4px)}\n'
  };
  return map[style]||map.clean;
}

function getHeroLayoutCSS(layout){
  var map={
    split:'',
    centered:'.hero-content{max-width:680px;text-align:center;margin:0 auto}.hero-actions,.hero-socials{justify-content:center}.hero-img-wrap{display:none}\n',
    fullscreen:'.block-hero{min-height:90vh;position:relative;border-radius:0}.hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35;border-radius:0;border:0}.hero-content{position:relative;z-index:2;color:#fff}.hero-name{color:#fff}.hero-greeting{color:var(--accent)}\n',
    minimal:'.block-hero{min-height:auto;padding:3rem 0}.hero-img-wrap{display:none}\n'
  };
  return map[layout]||'';
}

function getEffectsCSS(t){
  var out='';
  var scroll=t.scrollEffect||'slideUp';
  out+='[data-reveal]{opacity:0;transition:opacity .5s cubic-bezier(.4,0,.2,1),transform .5s cubic-bezier(.4,0,.2,1)}\n';
  var revealMap={
    slideUp:'[data-reveal]{transform:translateY(32px)}[data-reveal].revealed{opacity:1;transform:none}\n',
    slideLeft:'[data-reveal]{transform:translateX(32px)}[data-reveal].revealed{opacity:1;transform:none}\n',
    slideRight:'[data-reveal]{transform:translateX(-32px)}[data-reveal].revealed{opacity:1;transform:none}\n',
    fadeIn:'[data-reveal]{transform:none}[data-reveal].revealed{opacity:1}\n',
    scale:'[data-reveal]{transform:scale(.88)}[data-reveal].revealed{opacity:1;transform:scale(1)}\n',
    rotateIn:'[data-reveal]{transform:rotate(-4deg) scale(.9)}[data-reveal].revealed{opacity:1;transform:none}\n',
    flipIn:'[data-reveal]{transform:perspective(800px) rotateX(-25deg);transform-origin:top}[data-reveal].revealed{opacity:1;transform:none}\n',
    bounceIn:'[data-reveal]{transform:scale(.8)}[data-reveal].revealed{opacity:1;transform:scale(1);transition:opacity .4s,transform .5s cubic-bezier(.34,1.56,.64,1)}\n',
    stagger:'[data-reveal]:nth-child(1){transition-delay:.05s}[data-reveal]:nth-child(2){transition-delay:.1s}[data-reveal]:nth-child(3){transition-delay:.15s}[data-reveal]:nth-child(4){transition-delay:.2s}[data-reveal]:nth-child(5){transition-delay:.25s}[data-reveal].revealed{opacity:1;transform:none}\n',
    clipPath:'[data-reveal]{transform:none;clip-path:inset(0 100% 0 0)}[data-reveal].revealed{opacity:1;clip-path:inset(0 0% 0 0)}\n',
    none:'[data-reveal]{opacity:1;transform:none}\n'
  };
  out+=revealMap[scroll]||revealMap.slideUp;
  // Hover effects
  var hover=t.hoverEffect||'lift';
  if(hover==='glow')out+='.bento-block:hover{box-shadow:0 0 32px rgba(12,155,112,.35)}\n';
  if(hover==='scale')out+='.bento-block:hover,.project-card:hover,.service-card:hover{transform:scale(1.02)}\n';
  if(hover==='underline')out+='.nav-link{position:relative}.nav-link::after{content:"";position:absolute;left:0;right:0;bottom:-.35rem;height:2px;background:var(--primary);transform:scaleX(0);transform-origin:left;transition:transform .2s}.nav-link:hover::after,.nav-link.active::after{transform:scaleX(1)}\n';
  if(hover==='colorshift')out+='.bento-block:hover{background:linear-gradient(135deg,rgba(12,155,112,.08),var(--surface));border-color:rgba(12,155,112,.35)}\n';
  if(hover==='glasshover')out+='.bento-block:hover{background:rgba(255,255,255,.85);backdrop-filter:blur(24px)}\n';
  // Hero effects CSS
  if(t.heroEffect==='gradientanim'){
    out+='@keyframes gradshift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}.block-hero{background:linear-gradient(-45deg,var(--primary),var(--secondary),var(--accent),var(--primary));background-size:400% 400%;animation:gradshift 8s ease infinite}\n';
  }
  if(t.heroEffect==='floatingshapes'){
    out+='@keyframes float1{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-20px) rotate(15deg)}}@keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}.hero-shape{position:absolute;opacity:.12;pointer-events:none}.hero-shape:nth-child(1){width:200px;height:200px;border-radius:50%;background:var(--primary);top:-60px;right:10%;animation:float1 6s ease-in-out infinite}.hero-shape:nth-child(2){width:120px;height:120px;border-radius:var(--radius);background:var(--accent);bottom:20%;right:5%;animation:float2 8s ease-in-out infinite}\n';
  }
  if(t.heroEffect==='kenburns'){
    out+='@keyframes kenburns{0%{transform:scale(1)}100%{transform:scale(1.1)}}.hero-img{animation:kenburns 10s ease-in-out infinite alternate}\n';
  }
  if(t.heroEffect==='glitch'){
    out+='@keyframes glitch{0%,100%{text-shadow:2px 0 #f00,-2px 0 #0ff}10%,40%,70%{text-shadow:-2px 0 #f00,2px 0 #0ff}}.hero-name{animation:glitch 2s steps(4) infinite}\n';
  }
  if(t.heroEffect==='noise'){
    out+='.hero-noise{position:absolute;inset:0;pointer-events:none;opacity:.12;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27 viewBox=%270 0 120 120%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.85%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27120%27 height=%27120%27 filter=%27url(%23n)%27 opacity=%27.45%27/%3E%3C/svg%3E")}\n';
  }
  if(t.heroEffect==='marquee'){
    out+='.hero-marquee{position:absolute;left:0;right:0;bottom:1rem;overflow:hidden;color:var(--primary);font-weight:800;opacity:.16;font-size:clamp(1.5rem,5vw,4rem);white-space:nowrap;pointer-events:none}\n';
  }
  return out;
}

function getImageFilterCSS(effect){
  var filters={
    none:'',
    duotone:'.project-img{filter:grayscale(1) sepia(1) hue-rotate(90deg) saturate(3)}\n',
    grayscale:'.project-img{filter:grayscale(1)}\n',
    sepia:'.project-img{filter:sepia(.85)}\n',
    huerotate:'.project-img{filter:hue-rotate(180deg)}\n',
    contrast:'.project-img{filter:contrast(1.4) brightness(1.05)}\n',
    saturate:'.project-img{filter:saturate(2.2)}\n',
    blur:'.project-img{filter:blur(2px);transform:scale(1.05)}\n',
    vignette:'.gallery-cell{position:relative}.gallery-cell::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse,transparent 40%,rgba(0,0,0,.5));pointer-events:none;border-radius:inherit}\n',
    glitch:'.project-img{position:relative}.project-img::before,.project-img::after{content:"";position:absolute;inset:0;background:inherit}.project-img::before{transform:translate(-3px,2px);mix-blend-mode:screen;opacity:.7}\n',
    grain:'.project-img{position:relative}.project-img::after{content:"";position:absolute;inset:0;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAD8/vz08vT09vT8/vzs7uxH16TeAAAABnRSTlMAGBgYGBiRrn/XAAAAPklEQVQ4y2NgQAX/GYYBAAz/A4D9/2DwH6D/H6D/H6T/H6D/H6D/H6D/H6D/H6D/H6D/H4D/H4D/H4D/H4DHAGt9IYFGOgusAAAAAElFTkSuQmCC");opacity:.15;pointer-events:none;mix-blend-mode:overlay}\n',
    coldtone:'.project-img{filter:hue-rotate(200deg) saturate(0.8) brightness(1.1)}\n',
    warmtone:'.project-img{filter:sepia(.3) saturate(1.3) brightness(1.05)}\n',
    sketch:'.project-img{filter:grayscale(1) contrast(1.8) brightness(1.1)}\n',
    halftone:'.project-img{filter:grayscale(1) contrast(1.5)}\n'
  };
  return filters[effect]||'';
}

function getCursorCSS(effect){
  if(effect==='none')return'';
  var out='';
  if(effect==='trail'||effect==='ring'||effect==='elastic'||effect==='spotlight'){
    out+='.cursor-dot{position:fixed;width:8px;height:8px;background:var(--primary);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:opacity .2s;mix-blend-mode:difference}\n';
    out+='.cursor-ring{position:fixed;width:36px;height:36px;border:2px solid var(--primary);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .12s,width .2s,height .2s;opacity:.7}\n';
  }
  if(effect==='spotlight'){
    out+='.cursor-spotlight{position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(12,155,112,.12),transparent 70%);pointer-events:none;z-index:9997;transform:translate(-50%,-50%)}\n';
  }
  if(effect==='custom'){
    out+='body{cursor:crosshair}a,button,.btn{cursor:pointer}\n';
  }
  return out;
}

function hexToRgb(hex){
  var r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r?parseInt(r[1],16)+','+parseInt(r[2],16)+','+parseInt(r[3],16):'12,155,112';
}

/* ===== JS BUILDER ===== */
function buildMainJS(s,allBlocks){
  var types=(allBlocks||[]).filter(function(b){return !b.disabled;}).map(function(b){return b.type;});
  var t=s.theme||{};
  var out='/* PortfolioGen v4 · Auto-generated */\n';
  // Nav toggle
  out+='const navToggle=document.getElementById("nav-toggle"),navMenu=document.getElementById("nav-menu");if(navToggle&&navMenu)navToggle.addEventListener("click",()=>navMenu.classList.toggle("open"));\n';
  // Dark mode
  if(t.darkMode){
    out+='const themeBtn=document.getElementById("themeBtn");if(themeBtn){const apply=d=>{document.body.classList.toggle("dark",d);themeBtn.innerHTML=d?"<i class=\'bx bx-sun\'></i>":"<i class=\'bx bx-moon\'></i>";localStorage.setItem("pgTheme",d?"dark":"light");};themeBtn.addEventListener("click",()=>apply(!document.body.classList.contains("dark")));apply(localStorage.getItem("pgTheme")==="dark");}\n';
  }
  // Scroll reveal
  out+='const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("revealed");revealObs.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll("[data-reveal]").forEach(el=>revealObs.observe(el));\n';
  // Contact form
  out+='function handleContact(e){e.preventDefault();const m=document.getElementById("contactMsg");if(m){m.style.display="block";}}\n';
  // Skill search filters
  out+='document.querySelectorAll(".block-skills .skill-search").forEach(input=>input.addEventListener("input",()=>{const q=input.value.toLowerCase();input.closest(".block-skills").querySelectorAll("[data-skill-name]").forEach(el=>{const hay=((el.dataset.skillName||"")+" "+(el.dataset.skillCategory||"")).toLowerCase();el.style.display=hay.includes(q)?"":"none";});}));\n';
  // Floating instructions
  out+='const pgInst=document.getElementById("pgInstructions"),pgInstClose=document.getElementById("pgInstructionsClose");if(pgInst&&localStorage.getItem("pgInstructionsHidden")==="1")pgInst.remove();if(pgInstClose)pgInstClose.addEventListener("click",()=>{localStorage.setItem("pgInstructionsHidden","1");pgInst&&pgInst.remove();});\n';
  // Blob preview multi-page navigation
  out+='if(window.__PG_PREVIEW_PAGES){const renderPreviewPage=name=>{const html=window.__PG_PREVIEW_PAGES[name];const grid=document.querySelector("main.page-grid");if(!html||!grid)return;grid.innerHTML=html;document.querySelectorAll("[data-preview-page]").forEach(a=>a.classList.toggle("active",a.getAttribute("data-preview-page")===name));document.title=(name.charAt(0).toUpperCase()+name.slice(1))+" - "+(window.__PG_PREVIEW_NAME||"Portfolio");document.querySelectorAll("[data-reveal]").forEach(el=>{el.classList.add("revealed");try{revealObs.observe(el)}catch(e){}});scrollTo({top:0,behavior:"smooth"});};document.addEventListener("click",e=>{const a=e.target.closest("[data-preview-page]");if(!a)return;e.preventDefault();renderPreviewPage(a.getAttribute("data-preview-page"));});}\n';
  // Hover 3D tilt
  if(t.hoverEffect==='tilt3d'){
    out+='document.querySelectorAll(".bento-block").forEach(c=>{c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-4px)`;});c.addEventListener("mouseleave",()=>c.style.transform="");});\n';
  }
  // Magnetic hover
  if(t.hoverEffect==='magnetic'){
    out+='document.querySelectorAll(".btn").forEach(btn=>{btn.addEventListener("mousemove",e=>{const r=btn.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.25,y=(e.clientY-r.top-r.height/2)*.25;btn.style.transform=`translate(${x}px,${y}px)`;});btn.addEventListener("mouseleave",()=>btn.style.transform="");});\n';
  }
  // Ripple
  if(t.hoverEffect==='ripple'){
    out+='document.querySelectorAll(".btn").forEach(btn=>{btn.addEventListener("click",e=>{const r=document.createElement("span");r.style.cssText=`position:absolute;border-radius:50%;transform:scale(0);animation:rippleAnim .4s linear;background:rgba(255,255,255,.5);width:60px;height:60px;left:${e.clientX-btn.getBoundingClientRect().left-30}px;top:${e.clientY-btn.getBoundingClientRect().top-30}px`;btn.style.position="relative";btn.style.overflow="hidden";btn.appendChild(r);setTimeout(()=>r.remove(),400);});});\n';
    out+='const rs=document.createElement("style");rs.textContent="@keyframes rippleAnim{to{transform:scale(4);opacity:0}}";document.head.appendChild(rs);\n';
  }
  // GitHub feed
  if(types.indexOf('githubFeed')!==-1){
    out+='async function loadGH(){const el=document.getElementById("gh-feed"),u=window.__GH_USER;if(!el||!u)return;const h=s=>String(s||"").replace(/[&<>"\']/g,c=>c==="&"?"&amp;":c==="<"?"&lt;":c===">"?"&gt;":c.charCodeAt(0)===34?"&quot;":"&#039;");try{const res=await fetch(`https://api.github.com/users/${encodeURIComponent(u)}/events/public?per_page=8`);const d=await res.json();if(!Array.isArray(d))throw new Error("Bad response");el.innerHTML=d.slice(0,6).map(ev=>`<div class="gh-commit"><div class="gh-repo">${h(ev.repo&&ev.repo.name)}</div><div class="gh-msg">${h((ev.payload.commits&&ev.payload.commits[0]&&ev.payload.commits[0].message)||ev.type)}</div><div class="gh-date">${h(new Date(ev.created_at).toLocaleDateString())}</div></div>`).join("")||"<p class=\'muted\'>No recent public activity.</p>";}catch(e){el.innerHTML="<p class=\'muted\'>Unable to load activity.</p>";}};loadGH();\n';
  }
  // Particles
  if(t.heroEffect==='particles'){
    out+='const hc=document.getElementById("heroCanvas");if(hc){const ctx=hc.getContext("2d");hc.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";hc.width=hc.offsetWidth;hc.height=hc.offsetHeight;const pts=Array.from({length:40},()=>({x:Math.random()*hc.width,y:Math.random()*hc.height,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,r:Math.random()*3+1}));function animP(){ctx.clearRect(0,0,hc.width,hc.height);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>hc.width)p.vx*=-1;if(p.y<0||p.y>hc.height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(12,155,112,.35)";ctx.fill();});requestAnimationFrame(animP);}animP();}\n';
  }
  // Typed text
  if(t.heroEffect==='typedtext'){
    out+='const typedEl=document.querySelector("[data-typed]");if(typedEl){const orig=typedEl.textContent;typedEl.textContent="";let i=0;const t=setInterval(()=>{typedEl.textContent+=orig[i++];if(i>=orig.length)clearInterval(t);},60);}\n';
  }
  // Parallax
  if(t.heroEffect==='parallax'){
    out+='document.addEventListener("scroll",()=>{const hero=document.querySelector(".block-hero");if(hero){const y=window.scrollY;hero.querySelector(".hero-content").style.transform=`translateY(${y*.15}px)`;const img=hero.querySelector(".hero-img");if(img)img.style.transform=`translateY(${y*.1}px)`;;}});\n';
  }
  // Marquee  
  if(t.heroEffect==='marquee'){
    out+='const mEl=document.querySelector(".hero-marquee");if(mEl){const txt=mEl.getAttribute("data-text")||"Portfolio";mEl.innerHTML=`<div class="marquee-track">${(txt+" · ").repeat(8)}</div>`;const ms=document.createElement("style");ms.textContent=".marquee-track{display:inline-block;white-space:nowrap;animation:marqueeAnim 20s linear infinite}@keyframes marqueeAnim{to{transform:translateX(-50%)}}";document.head.appendChild(ms);}\n';
  }
  // Cursor effects
  if(t.cursorEffect==='trail'||t.cursorEffect==='ring'||t.cursorEffect==='elastic'||t.cursorEffect==='spotlight'||t.cursorEffect==='magnetic'){
    out+='const cdot=document.createElement("div");cdot.className="cursor-dot";document.body.appendChild(cdot);\n';
    out+='const cring=document.createElement("div");cring.className="cursor-ring";document.body.appendChild(cring);\n';
    out+='let mx=0,my=0,rx=0,ry=0;document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;cdot.style.left=mx+"px";cdot.style.top=my+"px";});function animCursor(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;cring.style.left=rx+"px";cring.style.top=ry+"px";requestAnimationFrame(animCursor);}animCursor();\n';
  }
  if(t.cursorEffect==='spotlight'){
    out+='const cspot=document.createElement("div");cspot.className="cursor-spotlight";document.body.appendChild(cspot);document.addEventListener("mousemove",e=>{cspot.style.left=e.clientX+"px";cspot.style.top=e.clientY+"px";});\n';
  }
  if(t.cursorEffect==='ripple'){
    out+='document.addEventListener("click",e=>{const r=document.createElement("div");r.style.cssText=`position:fixed;width:20px;height:20px;border:2px solid var(--primary);border-radius:50%;transform:translate(-50%,-50%) scale(0);animation:clickRipple .5s ease-out forwards;pointer-events:none;left:${e.clientX}px;top:${e.clientY}px;z-index:9999`;document.body.appendChild(r);setTimeout(()=>r.remove(),500);});const crs=document.createElement("style");crs.textContent="@keyframes clickRipple{to{transform:translate(-50%,-50%) scale(5);opacity:0}}";document.head.appendChild(crs);\n';
  }
  // Page transitions
  if(t.pageTransitions){
    out+='requestAnimationFrame(()=>document.body.classList.add("pg-ready"));document.addEventListener("click",e=>{const a=e.target.closest("a");if(!a||a.target||a.hasAttribute("download")||a.dataset.previewPage||!a.href)return;let u;try{u=new URL(a.href,location.href)}catch(err){return}if(u.origin!==location.origin||!u.pathname.endsWith(".html"))return;e.preventDefault();document.body.classList.add("pg-exit");setTimeout(()=>location.href=u.href,260);});\n';
  }
  return out;
}

/* ===== PAGE HEAD ===== */
function buildHead(s,pageName,preview){
  var m=s.meta||{};
  var title=esc(m.name||'Portfolio')+(m.title?' — '+esc(m.title):'');
  return'<!DOCTYPE html><html lang="en"><head>'+
    '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">'+
    '<meta name="description" content="'+attr(m.tagline||m.bio||'')+'">'+
    '<meta name="author" content="'+attr(m.name||'')+'">'+
    '<meta name="keywords" content="'+attr(s.seoKeywords||'')+'">'+
    '<meta property="og:title" content="'+attr(title)+'">'+
    '<meta property="og:description" content="'+attr(m.tagline||'')+'">'+
    '<meta property="og:type" content="website">'+
    '<meta name="twitter:card" content="summary">'+
    '<title>'+esc(pageName.charAt(0).toUpperCase()+pageName.slice(1))+' — '+esc(m.name||'Portfolio')+'</title>'+
    '<link rel="icon" href="'+attr(getFavicon(s))+'">'+
    '<link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">'+
    (preview?'<style>'+buildCSS(s)+'</style>':'<link rel="stylesheet" href="assets/css/styles.css">')+
    '</head><body>';
}

function compilePageCells(page,s,preview){
  var sorted=(page.blocks||[]).filter(function(b){return !b.disabled;}).slice().sort(function(a,b){return(a.order||0)-(b.order||0);});
  var cells=sorted.map(function(b){
    return'<div class="bento-cell" style="grid-column:span '+(b.cols||12)+'">'+compileBlock(b,s,preview)+'</div>';
  }).join('\n');
  return cells;
}

function buildPreviewPageScript(s){
  var map={};
  (s.pages||[]).filter(function(p){return p.enabled;}).forEach(function(p){
    map[p.name]=compilePageCells(p,s,true);
  });
  var json=JSON.stringify(map).replace(/<\//g,'<\\/');
  var name=JSON.stringify((s.meta&&s.meta.name)||'Portfolio').replace(/<\//g,'<\\/');
  return'<script>window.__PG_PREVIEW_PAGES='+json+';window.__PG_PREVIEW_NAME='+name+';<\/script>';
}

/* ===== COMPILE PAGE ===== */
function compilePage(page,s,preview){
  s.__preview=!!preview;
  var cells=compilePageCells(page,s,preview);
  var allPreviewBlocks=[];
  if(preview){
    (s.pages||[]).forEach(function(p){ (p.blocks||[]).forEach(function(b){ allPreviewBlocks.push(b); }); });
  }
  var out=buildHead(s,page.name,preview)+
    buildNav(s,page.name)+
    '<main class="page-grid">'+cells+'</main>'+
    buildFooter(s)+
    buildFloatingInstructions()+
    (preview?buildPreviewPageScript(s)+'<script>\n'+buildMainJS(s,allPreviewBlocks)+'\n<\/script>':'<script src="assets/js/main.js"><\/script>')+
    '</body></html>';
  delete s.__preview;return out;
}

/* ===== RESUME PAGE (PDF-friendly) ===== */
function buildResumePage(s){
  var m=s.meta||{};var t=s.theme||{};
  return'<!DOCTYPE html><html lang="en"><head>'+
    '<meta charset="UTF-8"><title>Resume — '+esc(m.name||'Portfolio')+'</title>'+
    '<link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">'+
    '<link href="https://fonts.googleapis.com/css2?family='+((t.fontFamily||'Inter').replace(/ /g,'+'))+':wght@400;500;600;700;800&display=swap" rel="stylesheet">'+
    '<style>'+buildResumeCSS(s)+'</style></head><body class="resume-body">'+
    '<div class="resume-wrap">'+
      '<header class="r-header"><div class="r-header-left">'+
        '<h1 class="r-name">'+esc(m.name||'Your Name')+'</h1>'+
        '<p class="r-title">'+esc(m.title||'Professional Title')+'</p>'+
        '<div class="r-contact-row">'+
          (m.email?'<span><i class="bx bx-envelope"></i> '+esc(m.email)+'</span>':'')+
          (m.phone?'<span><i class="bx bx-phone"></i> '+esc(m.phone)+'</span>':'')+
          ([m.addressCity,m.addressCountry].filter(Boolean).length?'<span><i class="bx bx-map-pin"></i> '+esc([m.addressCity,m.addressCountry].filter(Boolean).join(', '))+'</span>':'')+
        '</div></div>'+
        '<div class="r-header-right">'+(m.photoBase64?'<img src="'+attr(m.photoBase64)+'" class="r-photo" alt="Profile">':'')+'</div>'+
      '</header>'+
      '<div class="r-body">'+
        (m.bio?'<section class="r-section"><h2>Summary</h2><p>'+esc(m.bio)+'</p></section>':'')+
        buildResumeExp(s)+buildResumeEdu(s)+buildResumeSkills(s)+buildResumeCerts(s)+
      '</div>'+
    '</div>'+
    '<script>window.print();</script>'+
    '</body></html>';
}

function buildResumeCSS(s){
  var t=s.theme||{};var f=t.fontFamily||'Inter';var p=t.primaryColor||'#0C9B70';
  return'*{box-sizing:border-box;margin:0;padding:0}body{font-family:"'+f+'",sans-serif;color:#1e293b;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
    '.resume-wrap{max-width:800px;margin:0 auto;padding:2rem}'+
    '.r-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid '+p+';padding-bottom:1.25rem;margin-bottom:1.5rem}'+
    '.r-name{font-size:2.2rem;font-weight:800;color:#1e293b;margin-bottom:.2rem}'+
    '.r-title{font-size:1.1rem;color:'+p+';font-weight:600;margin-bottom:.6rem}'+
    '.r-contact-row{display:flex;flex-wrap:wrap;gap:.75rem;font-size:.82rem;color:#64748b}'+
    '.r-contact-row span{display:flex;align-items:center;gap:.3rem}'+
    '.r-photo{width:90px;height:90px;border-radius:8px;object-fit:cover;border:3px solid '+p+'}'+
    '.r-section{margin-bottom:1.5rem}.r-section h2{font-size:.8rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:'+p+';border-bottom:1px solid #e2e8f0;padding-bottom:.3rem;margin-bottom:.85rem}'+
    '.r-item{margin-bottom:1rem}.r-item-hd{display:flex;justify-content:space-between;margin-bottom:.15rem}.r-item-hd strong{font-size:.95rem}.r-item-hd span{font-size:.8rem;color:#64748b}'+
    '.r-item-sub{font-size:.85rem;color:'+p+';font-weight:600;margin-bottom:.3rem}.r-item p{font-size:.88rem;color:#475569;line-height:1.65}'+
    '.r-skill-row{display:flex;align-items:center;gap:.75rem;margin-bottom:.6rem}.r-skill-name{min-width:140px;font-size:.88rem;font-weight:600}.r-skill-bar{flex:1;height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden}.r-skill-fill{height:100%;background:'+p+';border-radius:999px}'+
    '.r-cert{display:flex;align-items:center;gap:.65rem;padding:.5rem 0;border-bottom:1px solid #f1f5f9;font-size:.88rem}'+
    '@media print{body{font-size:11pt}.resume-wrap{padding:0;max-width:none}}';
}

function buildResumeExp(s){
  if(!s.experience||!s.experience.length)return'';
  var items=s.experience.map(function(e){
    return'<div class="r-item"><div class="r-item-hd"><strong>'+esc(e.role||'Role')+'</strong><span>'+(e.from||'')+' – '+(e.to||'Present')+'</span></div>'+
      '<p class="r-item-sub">'+esc(e.company||'Company')+(e.location?' · '+esc(e.location):'')+'</p>'+
      (e.desc?'<p>'+esc(e.desc)+'</p>':'')+
    '</div>';
  }).join('');
  return'<section class="r-section"><h2>Experience</h2>'+items+'</section>';
}
function buildResumeEdu(s){
  if(!s.education||!s.education.length)return'';
  var items=s.education.map(function(e){
    return'<div class="r-item"><div class="r-item-hd"><strong>'+esc(e.institution||'')+'</strong><span>'+(e.startYear||'')+' – '+(e.endYear||'')+'</span></div>'+
      '<p class="r-item-sub">'+esc(e.degree||'')+(e.field?' · '+esc(e.field):'')+'</p>'+
      (e.grade?'<p>GPA / Grade: '+esc(e.grade)+'</p>':'')+
    '</div>';
  }).join('');
  return'<section class="r-section"><h2>Education</h2>'+items+'</section>';
}
function buildResumeSkills(s){
  var skillBlock=null;
  (s.pages||[]).forEach(function(p){(p.blocks||[]).forEach(function(b){if(b.type==='skills'&&b.data&&b.data.skills)skillBlock=b;});});
  if(!skillBlock)return'';
  var items=skillBlock.data.skills.map(function(sk){
    return'<div class="r-skill-row"><span class="r-skill-name">'+esc(sk.name)+'</span>'+
      '<div class="r-skill-bar"><div class="r-skill-fill" style="width:'+clampPct(sk.level)+'%"></div></div>'+
      '<span style="font-size:.78rem;color:#64748b">'+clampPct(sk.level)+'%</span></div>';
  }).join('');
  return'<section class="r-section"><h2>Skills</h2>'+items+'</section>';
}
function buildResumeCerts(s){
  if(!s.certs||!s.certs.length)return'';
  var items=s.certs.map(function(c){
    return'<div class="r-cert"><i class="bx bx-award" style="color:var(--p,#0C9B70)"></i><strong>'+esc(c.name)+'</strong>'+(c.issuer?' — '+esc(c.issuer):'')+' '+(c.year?esc(c.year):'')+'</div>';
  }).join('');
  return'<section class="r-section"><h2>Certifications</h2>'+items+'</section>';
}

/* ===== 404 PAGE ===== */
function build404(s){
  var out=buildHead(s,'404',false)+buildNav(s,'')+'<main class="page-grid" style="min-height:60vh;place-items:center;"><div class="bento-cell" style="grid-column:span 12;text-align:center;padding:4rem 1rem">'+
    '<div style="font-size:5rem;font-weight:800;color:var(--primary);opacity:.3">404</div>'+
    '<h1 style="font-size:2rem;margin:.5rem 0">Page Not Found</h1>'+
    '<p style="color:var(--muted);margin-bottom:1.5rem">The page you\'re looking for doesn\'t exist.</p>'+
    '<a href="index.html" class="btn btn-primary">Go Home</a></div></main>'+
    buildFooter(s)+buildFloatingInstructions()+'<script src="assets/js/main.js"><\/script></body></html>';
  return out;
}

/* ===== SITEMAP & ROBOTS ===== */
function buildSitemap(s){
  if(!s.siteURL)return'';
  var base=s.siteURL.replace(/\/+$/,'');var d=new Date().toISOString().slice(0,10);
  var urls='';
  (s.pages||[]).filter(function(p){return p.enabled;}).forEach(function(p){
    urls+='<url><loc>'+esc(base+'/'+p.name+'.html')+'</loc><lastmod>'+d+'</lastmod><priority>'+(p.name==='index'?'1.0':'0.8')+'</priority></url>\n';
  });
  return'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'</urlset>';
}
function buildRobots(s){
  if(!s.siteURL)return'';
  return'User-agent: *\nAllow: /\nSitemap: '+s.siteURL.replace(/\/+$/,'')+'/sitemap.xml\n';
}

/* ===== ZIP BUILDER ===== */
function buildZIP(s){
  var zip=new JSZip();
  var allBlocks=[];
  // Generate each page
  (s.pages||[]).filter(function(p){return p.enabled;}).forEach(function(page){
    (page.blocks||[]).forEach(function(b){allBlocks.push(b);});
    zip.file(page.name+'.html',compilePage(page,s,false));
  });
  // Resume page
  zip.file('resume.html',buildResumePage(s));
  // 404
  zip.file('404.html',build404(s));
  // Assets
  zip.file('assets/css/styles.css',buildCSS(s));
  zip.file('assets/js/main.js',buildMainJS(s,allBlocks));
  // Sitemap/robots
  if(s.siteURL){zip.file('sitemap.xml',buildSitemap(s));zip.file('robots.txt',buildRobots(s));}
  // Config
  zip.file('config.json',JSON.stringify(s,null,2));
  zip.file('README.md','# '+esc(s.meta.name||'Portfolio')+'\n\nGenerated by PortfolioGen v4 (Cypher Labs). Open `index.html` to view.\n\nPages: '+(s.pages||[]).filter(function(p){return p.enabled;}).map(function(p){return p.name+'.html';}).join(', ')+'\n');
  // Placeholder profile image if no upload
  if(!(s.meta&&s.meta.photoBase64)){zip.file('assets/img/profile.jpg','R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',{base64:true});}
  return zip;
}
