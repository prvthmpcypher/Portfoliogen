/* ============================================================
   PortfolioGen Wizard v4 — UI State & Preview Management
   Cypher Labs · All new features
   ============================================================ */

var TOTAL_STEPS = 7;
var currentStep = 1;
var previewTimer = null;
var editMode = false;
var stepTitles = ['Identity','Pages & Layout','Content','Social & Contact','Design & Theme','Effects & Motion','Preview & Export'];

/* ===== SCHEMA STATE ===== */
var schema = {
  meta: { name:'', title:'', email:'', phone:'', tagline:'', bio:'', resumeUrl:'', addressCity:'', addressState:'', addressCountry:'', timezone:'', photoBase64:'', faviconBase64:'' },
  education: [],
  experience: [],
  certs: [],
  theme: {
    primaryColor:'#0C9B70', secondaryColor:'#042444', accentColor:'#1db88e', surfaceColor:'#ffffff',
    fontFamily:'Inter', borderRadius:'.75rem', spacing:'normal',
    aesthetic:'clean', darkMode:true, heroLayout:'split',
    gradientColorA:'#0C9B70', gradientColorB:'#1db88e', gradientColorC:'#042444',
    gradientPreset:'none', gradientType:'none', gradientDir:'135deg',
    hoverEffect:'lift', scrollEffect:'slideUp', heroEffect:'none',
    cursorEffect:'none', imageEffect:'none', pageTransitions:false,
    animations:{ enabled:true, style:'slideUp' },
    skillDisplay:{ mode:'bars', animate:true, searchable:false, showCategories:true, badgeShape:'pill' }
  },
  socials: [],
  pages: [],
  integrations: { githubCommits:false, githubUsername:'' },
  contact: { heading:'Let\'s Work Together', subtext:'', desc:'', showForm:true, showMap:false, mapUrl:'', showAvailability:true, status:'available' },
  footer: { about:'' },
  testimonials: [],
  availabilityBadge: '✅ Available for new projects',
  siteURL: '',
  seoKeywords: ''
};

/* Default pages */
var defaultPages = [
  { name:'index', label:'Home', navLabel:'Home', enabled:true, blocks:[
    {id:'hero-1',type:'hero',cols:12,order:0,data:{}},
    {id:'bio-1',type:'bio',cols:8,order:1,data:{}},
    {id:'skills-1',type:'skills',cols:4,order:2,data:{skills:[{name:'HTML/CSS',level:90,color:'#0C9B70',category:'Frontend'},{name:'JavaScript',level:85,color:'#1db88e',category:'Frontend'},{name:'React',level:75,color:'#3b82f6',category:'Frontend'}]}},
    {id:'projects-1',type:'projects',cols:12,order:3,data:{projects:[]}},
    {id:'contact-1',type:'contact',cols:12,order:4,data:{}}
  ]},
  { name:'about', label:'About', navLabel:'About', enabled:false, blocks:[
    {id:'bio-a',type:'bio',cols:8,order:0,data:{}},
    {id:'edu-a',type:'education',cols:12,order:1,data:{}},
    {id:'exp-a',type:'experience',cols:12,order:2,data:{}}
  ]},
  { name:'projects', label:'Projects', navLabel:'Work', enabled:false, blocks:[
    {id:'proj-p',type:'projects',cols:12,order:0,data:{projects:[]}}
  ]},
  { name:'skills', label:'Skills', navLabel:'Skills', enabled:false, blocks:[
    {id:'skills-s',type:'skills',cols:8,order:0,data:{skills:[]}},
    {id:'certs-s',type:'certs',cols:4,order:1,data:{}}
  ]}
];

var socialDefs = [
  {name:'GitHub',   icon:'bxl-github',   platform:'github',   base:'https://github.com/',        inNav:false,inFooter:true, inHero:true, url:'', iconShape:'circle', iconColor:'#0C9B70'},
  {name:'LinkedIn', icon:'bxl-linkedin', platform:'linkedin', base:'https://linkedin.com/in/',    inNav:false,inFooter:true, inHero:true, url:'', iconShape:'circle', iconColor:'#0a66c2'},
  {name:'X / Twitter',icon:'bxl-twitter',platform:'twitter',base:'https://twitter.com/',          inNav:false,inFooter:false,inHero:false,url:'', iconShape:'circle', iconColor:'#111827'},
  {name:'Instagram',icon:'bxl-instagram',platform:'instagram',base:'https://instagram.com/',      inNav:false,inFooter:false,inHero:false,url:'', iconShape:'circle', iconColor:'#e1306c'},
  {name:'YouTube',  icon:'bxl-youtube',  platform:'youtube',  base:'https://youtube.com/@',       inNav:false,inFooter:false,inHero:false,url:'', iconShape:'circle', iconColor:'#ff0000'},
  {name:'Dribbble', icon:'bxl-dribbble', platform:'dribbble', base:'https://dribbble.com/',       inNav:false,inFooter:false,inHero:false,url:'', iconShape:'circle', iconColor:'#ea4c89'},
  {name:'Behance',  icon:'bxl-behance',  platform:'behance',  base:'https://behance.net/',        inNav:false,inFooter:false,inHero:false,url:'', iconShape:'circle', iconColor:'#1769ff'},
  {name:'Discord',  icon:'bxl-discord',  platform:'discord',  base:'https://discord.com/users/', inNav:false,inFooter:false,inHero:false,url:'', iconShape:'circle', iconColor:'#5865f2'},
  {name:'TikTok',   icon:'bxl-tiktok',   platform:'tiktok',   base:'https://tiktok.com/@',       inNav:false,inFooter:false,inHero:false,url:'', iconShape:'circle', iconColor:'#111827'},
  {name:'Website',  icon:'bx-globe',     platform:'website',  base:'',                            inNav:false,inFooter:true, inHero:false,url:'', iconShape:'square', iconColor:'#0C9B70'}
];

var skillImportGroups = [
  {name:'Frontend Dev', skills:['HTML/CSS:90','JavaScript:85','React:80','TypeScript:75','Vue:70','Tailwind:85']},
  {name:'Backend Dev',  skills:['Node.js:80','Python:85','PostgreSQL:75','MongoDB:70','REST APIs:85','Docker:70']},
  {name:'UI/UX Design', skills:['Figma:90','Adobe XD:80','Prototyping:85','User Research:75','Sketch:70','Framer:65']},
  {name:'Mobile Dev',   skills:['React Native:80','Flutter:75','iOS/Swift:65','Android/Kotlin:65']},
  {name:'DevOps',       skills:['AWS:75','GCP:70','Linux:80','CI/CD:75','Kubernetes:65','Terraform:60']},
  {name:'Data Science', skills:['Python:90','Pandas:85','TensorFlow:75','SQL:80','R:65','Tableau:70']}
];

/* ===== HELPERS ===== */
function $id(id){ return document.getElementById(id); }
function v(id){ var el=$id(id); return el?el.value.trim():''; }
function setVal(id,val){ var el=$id(id); if(el) el.value=val||''; }
function esc2(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function slugifyPageName(s){
  var slug=String(s||'page').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  return slug||'page';
}
function customSelectValue(id){
  var el=$id(id), custom=$id(id+'Custom');
  if(!el) return '';
  return el.value==='__custom__' && custom ? custom.value.trim() : el.value.trim();
}

function getBlocksByType(type){
  var blocks=[];
  schema.pages.forEach(function(page){
    (page.blocks||[]).forEach(function(block){ if(block.type===type) blocks.push(block); });
  });
  return blocks;
}
function ensureBlockOnHome(type){
  var blocks=getBlocksByType(type);
  if(blocks.length) return blocks[0];
  var page=schema.pages[0];
  var reg=BLOCK_REGISTRY[type]||{defaultCols:12};
  var block={id:type+'-'+Date.now(),type:type,cols:reg.defaultCols||12,order:(page.blocks||[]).length,data:{},disabled:false};
  page.blocks.push(block);
  reorderPageBlocks(0);
  buildPagesUI();
  return block;
}
function syncBlockData(type,key,items){
  getBlocksByType(type).forEach(function(block){
    if(!block.data) block.data={};
    block.data[key]=items;
  });
}
function getPrimaryBlockItems(type,key){
  var blocks=getBlocksByType(type);
  var filled=blocks.find(function(block){ return block.data&&Array.isArray(block.data[key])&&block.data[key].length; });
  var target=filled||blocks[0]||ensureBlockOnHome(type);
  if(!target.data) target.data={};
  if(!Array.isArray(target.data[key])) target.data[key]=[];
  syncBlockData(type,key,target.data[key]);
  return target.data[key];
}
function getExistingBlockItems(type,key){
  var blocks=getBlocksByType(type);
  var filled=blocks.find(function(block){ return block.data&&Array.isArray(block.data[key])&&block.data[key].length; });
  var target=filled||blocks.find(function(block){ return block.data&&Array.isArray(block.data[key]); })||blocks[0];
  if(!target) return [];
  if(!target.data) target.data={};
  if(!Array.isArray(target.data[key])) target.data[key]=[];
  return target.data[key];
}
function syncSkillsToBlocks(){
  syncBlockData('skills','skills',getPrimaryBlockItems('skills','skills'));
  getBlocksByType('skills').forEach(function(block){
    if(!block.data) block.data={};
    block.data.settings=Object.assign({}, schema.theme.skillDisplay);
  });
}
function syncServicesToBlocks(){ syncBlockData('services','services',getPrimaryBlockItems('services','services')); }
function syncProjectsToBlocks(){ syncBlockData('projects','projects',projects.slice()); }

function toast(msg, dur){
  var t=$id('toast'); if(!t)return;
  t.textContent=msg; t.classList.add('visible');
  clearTimeout(t._t); t._t=setTimeout(function(){ t.classList.remove('visible'); }, dur||2000);
}

/* ===== INIT ===== */
function initWizard(){
  schema.pages = JSON.parse(JSON.stringify(defaultPages));
  schema.socials = JSON.parse(JSON.stringify(socialDefs));
  $id('btnNext').addEventListener('click', goNext);
  $id('btnBack').addEventListener('click', goBack);
  $id('btnDownload').addEventListener('click', startDownload);
  $id('addEduBtn').addEventListener('click', function(){ addEntry('education'); });
  $id('addExpBtn').addEventListener('click', function(){ addEntry('experience'); });
  $id('addCertBtn').addEventListener('click', function(){ addEntry('certs'); });
  $id('addSkillBtn').addEventListener('click', addSkill);
  $id('addProjectBtn').addEventListener('click', addProject);
  $id('addTestiBtn').addEventListener('click', addTestimonial);
  $id('addServiceBtn').addEventListener('click', addService);
  $id('addSocialBtn').addEventListener('click', addCustomSocial);
  $id('fetchIconsBtn').addEventListener('click', fetchIconOptions);
  $id('checkColorsBtn').addEventListener('click', checkColorContrast);
  $id('fixColorsBtn').addEventListener('click', fixColorContrast);
  $id('importSkillsBtn').addEventListener('click', openImportModal);
  $id('closeImportBtn').addEventListener('click', closeImportModal);
  $id('cancelImportBtn').addEventListener('click', closeImportModal);
  $id('doImportBtn').addEventListener('click', doImportSkills);
  $id('openTabBtn').addEventListener('click', openInNewTab);
  $id('pdfExportBtn').addEventListener('click', exportPDF);
  $id('intGithub').addEventListener('change', function(){ if(this.checked) ensureBlockOnHome('githubFeed'); $id('ghUsernameField').style.display=this.checked?'block':'none'; schedPreview(); });
  $id('showMap').addEventListener('change', function(){ $id('mapWrap').style.display=this.checked?'block':'none'; schedPreview(); });
  $id('showAvailability').addEventListener('change', function(){ $id('availabilityField').style.display=this.checked?'block':'none'; schedPreview(); });
  $id('previewToggleBtn').addEventListener('click', openInNewTab);
  setupUploadZone('photoDrop','photoInput','photoError',handlePhoto);
  setupUploadZone('faviconDrop','faviconInput','faviconError',handleFavicon);
  setupColorPickers();
  setupCustomSelects();
  setupInputHelp();
  setupIdentityCompact();
  buildStyleGrid();
  buildFontPreviewGrid();
  buildGradientGrid();
  buildEffectGrids();
  buildSkillModeGrid();
  buildSocialsUI();
  buildPagesUI();
  renderAllSkillsEditors();
  renderProjectsList();
  renderTestiList();
  renderServicesList();
  document.addEventListener('input', onAnyInput, true);
  document.addEventListener('change', onAnyInput, true);
  showStep(1);
}

function setupCustomSelects(){
  ['availabilityStatus','fontFamily','borderRadius','spacingSelect','heroLayout','gradientType','gradientDir'].forEach(function(id){
    var select=$id(id); if(!select||select.dataset.customReady)return;
    select.dataset.customReady='1';
    var opt=document.createElement('option');
    opt.value='__custom__';
    opt.textContent='Other - Not listed? Type your own';
    select.appendChild(opt);
    var input=document.createElement('input');
    input.type='text';
    input.id=id+'Custom';
    input.className='custom-select-input';
    input.placeholder='Not listed? Type your own';
    select.insertAdjacentElement('afterend', input);
    select.addEventListener('change',function(){
      input.classList.toggle('active', select.value==='__custom__');
      if(select.value==='__custom__') input.focus();
      schedPreview();
    });
    input.addEventListener('input', schedPreview);
  });
  document.querySelectorAll('input[list]').forEach(function(input){
    if(input.dataset.otherReady)return;
    input.dataset.otherReady='1';
    var note=document.createElement('small');
    note.className='help-note';
    note.textContent='Not listed? Type your own.';
    input.insertAdjacentElement('afterend', note);
  });
}

function setupInputHelp(){
  var helpById={
    fullName:'Appears as the site logo text, hero name, footer copyright, and SEO author.',
    profTitle:'Appears under your name in the hero and resume header.',
    tagline:'Appears in the hero intro and search/social preview description.',
    bio:'Appears in About sections and the resume summary.',
    email:'Appears in contact blocks as a mail link.',
    phone:'Appears in contact blocks as a tap-to-call link.',
    addressCity:'Appears near the hero and contact details.',
    addressState:'Adds regional detail to your contact location.',
    addressCountry:'Appears with your city in hero and contact details.',
    timezone:'Helps visitors understand your working hours.',
    resumeUrl:'Adds a Resume link in navigation and hero buttons.',
    footerAbout:'Appears as a short optional line in the generated footer.',
    siteURL:'Used to build sitemap and robots.txt URLs.',
    seoKeywords:'Added to the generated page metadata.'
  };
  Object.keys(helpById).forEach(function(id){
    var el=$id(id); if(!el||el.dataset.helpReady)return;
    el.dataset.helpReady='1';
    var note=document.createElement('small');
    note.className='help-note';
    note.textContent=helpById[id];
    el.insertAdjacentElement('afterend', note);
  });
  document.querySelectorAll('.color-field').forEach(function(field){
    if(field.dataset.helpReady)return;
    field.dataset.helpReady='1';
    var label=field.querySelector('label');
    var note=document.createElement('small');
    note.className='help-note';
    note.textContent=(label?label.textContent:'This colour')+' controls matching accents in the generated site preview.';
    field.appendChild(note);
  });
  document.querySelectorAll('.field').forEach(function(field){
    if(field.querySelector('.help-note'))return;
    var control=field.querySelector('input,textarea,select');
    var label=field.querySelector('label');
    if(!control||!label)return;
    var note=document.createElement('small');
    note.className='help-note';
    note.textContent='Appears in the generated portfolio where '+label.textContent.replace('*','').trim().toLowerCase()+' is used. Leave optional fields blank to hide them.';
    control.insertAdjacentElement('afterend', note);
  });
}

function setupIdentityCompact(){
  var step=document.querySelector('.step[data-step="1"]'); if(!step||step.dataset.compactReady)return;
  step.dataset.compactReady='1';
  var cards=[].slice.call(step.querySelectorAll(':scope > .card'));
  if(cards.length<4)return;
  var groups=[
    {label:'Photo & Icon', icon:'bx-image', cards:[2,3]},
    {label:'Education', icon:'bx-book', cards:[4]},
    {label:'Experience', icon:'bx-briefcase', cards:[5]},
    {label:'Awards', icon:'bx-award', cards:[6]}
  ];
  var jump=document.createElement('div');
  jump.className='identity-jump';
  jump.innerHTML=groups.map(function(g,i){
    return'<button type="button" class="btn btn-secondary" data-identity-group="'+i+'"><i class="bx '+g.icon+'"></i> '+g.label+'</button>';
  }).join('');
  cards[1].insertAdjacentElement('afterend', jump);
  groups.forEach(function(g,gi){
    g.cards.forEach(function(ci){
      if(cards[ci]){
        cards[ci].classList.add('identity-extra');
        cards[ci].dataset.identityGroup=gi;
      }
    });
  });
  jump.querySelectorAll('[data-identity-group]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var gi=btn.dataset.identityGroup;
      var active=btn.classList.toggle('active');
      step.querySelectorAll('.identity-extra[data-identity-group="'+gi+'"]').forEach(function(card){ card.classList.toggle('active',active); });
    });
  });
}

/* ===== STEP MANAGEMENT ===== */
function showStep(n){
  currentStep=n;
  document.querySelectorAll('.step').forEach(function(s){ s.classList.remove('active'); });
  document.querySelectorAll('.prog-step').forEach(function(s){
    var sn=parseInt(s.dataset.step,10);
    s.classList.toggle('active',sn===n);
    s.classList.toggle('done',sn<n);
  });
  var active=document.querySelector('.step[data-step="'+n+'"]');
  if(active) active.classList.add('active');
  $id('btnBack').style.display=n===1?'none':'inline-flex';
  $id('btnNext').style.display=n===TOTAL_STEPS?'none':'inline-flex';
  $id('navInfo').textContent='Step '+n+' of '+TOTAL_STEPS;
  document.title='PortfolioGen - '+(stepTitles[n-1]||('Step '+n))+' | Cypher Labs';
  // Side preview visible for steps 1–6
  var shell=$id('genShell');
  if(shell) shell.classList.remove('preview-open');
  if(n===TOTAL_STEPS) collectSchema();
  window.scrollTo({top:0,behavior:'smooth'});
}

function goNext(){ if(validate()) showStep(currentStep+1); }
function goBack(){ if(currentStep>1) showStep(currentStep-1); }

function validate(){
  if(currentStep===1 && (!v('fullName')||!v('profTitle')||!v('tagline')||!v('bio'))){
    alert('Please fill in Full Name, Job Title, Tagline, and Bio.');
    return false;
  }
  return true;
}

/* ===== PREVIEW SCHEDULING ===== */
function onAnyInput(e){
  var id=e.target&&e.target.id||'';
  if(['primaryColor','secondaryColor','accentColor','surfaceColor'].indexOf(id)!==-1) syncColorPreviews();
  schedPreview();
}
function schedPreview(){
  clearTimeout(previewTimer);
  previewTimer=setTimeout(function(){ collectSchema(); }, 350);
}
function rebuildPreview(){
  collectSchema();
}
function writeFrame(frame, html){
  if(!frame) return;
  try{
    var doc=frame.contentDocument||frame.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
  }catch(e){}
}

/* ===== TOGGLE SIDE PREVIEW ===== */
function toggleSidePreview(){
  openInNewTab();
}

/* ===== PREVIEW ===== */
function openFullscreen(){ openInNewTab(); }
function closeFullscreen(){}
function openInNewTab(){
  collectSchema();
  var html=compilePage(schema.pages[0]||{name:'index',blocks:[]}, schema, true);
  var blob=new Blob([html],{type:'text/html'});
  var url=URL.createObjectURL(blob);
  window.open(url,'_blank');
}

/* ===== CANVAS EDIT ===== */
function toggleCanvasEdit(){ openInNewTab(); }

function applyCanvasEdit(field, value){
  if(!field) return;
  var parts=field.split('.');
  if(parts[0]==='meta'&&parts[1]){
    schema.meta[parts[1]]=value;
    var formIds={name:'fullName',title:'profTitle',tagline:'tagline',bio:'bio',email:'email'};
    if(formIds[parts[1]]) setVal(formIds[parts[1]], value);
    return;
  }
  if(parts[0]==='project'&&parts.length>=3){
    var pi=parseInt(parts[2],10);
    if(projects[pi]){
      projects[pi][parts[1]]=value;
      renderProjectsList();
      syncProjectsToBlocks();
    }
    return;
  }
  if(parts[0]==='edu'&&parts.length>=3){
    var ei=parseInt(parts[2],10);
    var eduMap={institution:'institution',degree:'degree'};
    if(schema.education[ei]&&eduMap[parts[1]]){
      schema.education[ei][eduMap[parts[1]]]=value;
      renderEntry('education');
    }
  }
}

/* ===== PDF EXPORT ===== */
function exportPDF(){
  collectSchema();
  var html=buildResumePage(schema);
  var blob=new Blob([html],{type:'text/html'});
  var url=URL.createObjectURL(blob);
  var win=window.open(url,'_blank');
  toast('Resume PDF opened — use browser Print → Save as PDF');
}

/* ===== UPLOAD ZONES ===== */
function setupUploadZone(zoneId,inputId,errorId,cb){
  var zone=$id(zoneId), input=$id(inputId);
  if(!zone||!input)return;
  zone.addEventListener('dragover',function(e){ e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave',function(){ zone.classList.remove('drag-over'); });
  zone.addEventListener('drop',function(e){ e.preventDefault(); zone.classList.remove('drag-over'); var f=e.dataTransfer.files[0]; if(f) cb(f,errorId); });
  input.addEventListener('change',function(){ if(input.files[0]) cb(input.files[0],errorId); });
}
function handlePhoto(file, eid){
  if(!validImg(file,['image/jpeg','image/png','image/webp'],5*1024*1024,eid))return;
  resizeImg(file,600,600).then(function(url){
    schema.meta.photoBase64=url;
    $id('photoPreview').innerHTML='<img src="'+url+'" alt="Profile"><button type="button" class="btn btn-secondary btn-sm" onclick="schema.meta.photoBase64=\'\';this.parentNode.innerHTML=\'\';schedPreview()">Remove</button>';
    schedPreview();
  });
}
function handleFavicon(file, eid){
  if(!validImg(file,['image/png','image/svg+xml','image/x-icon','image/vnd.microsoft.icon'],512*1024,eid,['ico','png','svg']))return;
  readFileURL(file).then(function(url){
    schema.meta.faviconBase64=url;
    $id('faviconPreview').innerHTML='<img src="'+url+'" alt="Favicon"><button type="button" class="btn btn-secondary btn-sm" onclick="schema.meta.faviconBase64=\'\';this.parentNode.innerHTML=\'\';schedPreview()">Remove</button>';
    schedPreview();
  });
}
function validImg(file,types,max,eid,exts){
  var ext=file.name.split('.').pop().toLowerCase();
  var ok=types.indexOf(file.type)!==-1||(exts&&exts.indexOf(ext)!==-1);
  if(!ok){ setErr(eid,'Unsupported format.'); return false; }
  if(file.size>max){ setErr(eid,'File too large.'); return false; }
  setErr(eid,''); return true;
}
function setErr(id,msg){ var el=$id(id); if(el) el.textContent=msg; }
function readFileURL(f){ return new Promise(function(res,rej){ var r=new FileReader(); r.onload=function(){ res(r.result); }; r.onerror=rej; r.readAsDataURL(f); }); }
function resizeImg(file,mw,mh){
  return readFileURL(file).then(function(url){
    return new Promise(function(res){
      var img=new Image(); img.onload=function(){
        var ratio=Math.min(mw/img.width,mh/img.height,1);
        var c=document.createElement('canvas'); c.width=Math.round(img.width*ratio); c.height=Math.round(img.height*ratio);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        res(c.toDataURL(file.type==='image/png'?'image/png':'image/jpeg',0.88));
      }; img.src=url;
    });
  });
}

/* ===== COLOR PICKERS ===== */
function setupColorPickers(){
  ['primary','secondary','accent','surface'].forEach(function(name){
    var input=$id(name+'Color'), preview=$id('prev'+name.charAt(0).toUpperCase()+name.slice(1));
    if(!input)return;
    input.addEventListener('input',function(){ if(preview) preview.style.background=input.value; schedPreview(); });
  });
  ['A','B','C'].forEach(function(letter){
    var input=$id('gradientColor'+letter), preview=$id('prevGradient'+letter);
    if(!input)return;
    input.addEventListener('input',function(){ if(preview) preview.style.background=input.value; schedPreview(); checkGradientDistinct(); });
  });
}
function syncColorPreviews(){
  ['primary','secondary','accent','surface'].forEach(function(name){
    var input=$id(name+'Color'), preview=$id('prev'+name.charAt(0).toUpperCase()+name.slice(1));
    if(input&&preview) preview.style.background=input.value;
  });
  ['A','B','C'].forEach(function(letter){
    var input=$id('gradientColor'+letter), preview=$id('prevGradient'+letter);
    if(input&&preview) preview.style.background=input.value;
  });
}

/* ===== STYLE GRID ===== */
function buildStyleGrid(){
  var grid=$id('styleGrid'); if(!grid)return;
  var previews={
    clean:'background:#fff;border-radius:8px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,.06)',
    glassmorphism:'background:rgba(255,255,255,.5);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.4)',
    neumorphism:'background:#e0e5ec;box-shadow:4px 4px 8px #b8bec7,-4px -4px 8px #fff',
    claymorphism:'background:#fff;border-radius:20px;box-shadow:6px 6px 0 rgba(0,0,0,.08)',
    brutalism:'background:#fff;border:3px solid #111;box-shadow:4px 4px 0 #111',
    neubrutalism:'background:#fff;border:2px solid #111;border-radius:6px;box-shadow:4px 4px 0 #111',
    minimalist:'background:transparent;border-top:2px solid #e2e8f0',
    darkmode:'background:#1e293b;border:1px solid #334155',
    aurora:'background:rgba(255,255,255,.6);box-shadow:0 0 20px rgba(12,155,112,.2)',
    retrofuturism:'background:#0d0d2b;border:1px solid #0C9B70;box-shadow:0 0 8px rgba(12,155,112,.4)',
    material:'background:#fff;border-radius:12px;box-shadow:0 2px 4px rgba(0,0,0,.1)',
    fluent:'background:rgba(255,255,255,.7);backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,.5)',
    holographic:'background:linear-gradient(135deg,rgba(240,171,252,.3),rgba(129,140,248,.3),rgba(103,232,249,.3))',
    glitchart:'background:#0d1117;border:1px solid #0C9B70',
    bento:'background:#fff;border:1px solid #e2e8f0;border-radius:8px',
    editorial:'background:transparent;border-top:3px solid #0C9B70',
    organic:'background:#fff;border-radius:40% 60% 50% 50%/50% 40% 60% 50%;box-shadow:0 8px 24px rgba(0,0,0,.1)',
    cyberpunk:'background:#0a0a0a;border:1px solid #eab308;box-shadow:0 0 8px rgba(234,179,8,.4)',
    spatial:'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(20px)',
    flat2:'background:#fff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.04)',
    skeuomorphism:'background:linear-gradient(180deg,#f5f5f5,#e8e8e8);border:1px solid #ccc;box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 2px 4px rgba(0,0,0,.12)',
    parallax:'background:#fff;border:1px solid #e2e8f0;transform-style:preserve-3d',
    splitscreen:'background:#fff;border-right:4px solid #0C9B70',
    generativeai:'background:rgba(255,255,255,.05);border:1px solid rgba(12,155,112,.3)',
    cardgrid:'background:#fff;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.06)'
  };
  grid.innerHTML=UI_STYLES.map(function(st){
    var bgColor=['darkmode','retrofuturism','glitchart','cyberpunk','spatial','generativeai'].indexOf(st.id)!==-1?'#1a1a2e':'#f8fafc';
    return'<div class="style-card'+(st.id==='clean'?' selected':'')+'" data-style="'+st.id+'">'+
      '<div class="style-preview" style="background:'+bgColor+'"><div style="margin:.5rem;height:36px;'+previews[st.id]+';display:flex;align-items:center;padding:0 .5rem"><div style="width:60%;height:4px;background:rgba(12,155,112,.5);border-radius:2px"></div></div></div>'+
      '<strong>'+st.name+'</strong><span>'+st.desc+'. This changes the surface treatment, shadows, spacing, and overall mood of your generated sections.</span>'+
      '<a class="learn-link" href="https://portfoliogen-one.vercel.app/work.html" target="_blank" rel="noopener">Learn more</a>'+
    '</div>';
  }).join('');
  grid.querySelectorAll('.style-card').forEach(function(card){
    card.addEventListener('click',function(){
      grid.querySelectorAll('.style-card').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
      $id('uiStyle').value=card.dataset.style;
      schedPreview();
    });
  });
}

/* ===== GRADIENT GRID ===== */
function buildGradientGrid(){
  var grid=$id('gradientGrid'); if(!grid)return;
  grid.innerHTML=GRADIENTS.map(function(g){
    var bgCss=g.id==='none'?'background:#f1f5f9;border:1px dashed #cbd5e1':'background:'+g.css;
    return'<div class="grad-swatch-wrap"><div class="grad-swatch'+(g.id==='none'?' selected':'')+'" data-grad="'+g.id+'" style="'+bgCss+'" title="'+g.name+'"></div><div class="grad-swatch-label">'+g.name+'</div></div>';
  }).join('');
  grid.querySelectorAll('.grad-swatch').forEach(function(sw){
    sw.addEventListener('click',function(){
      grid.querySelectorAll('.grad-swatch').forEach(function(s){ s.classList.remove('selected'); });
      sw.classList.add('selected');
      $id('gradientPreset').value=sw.dataset.grad;
      schedPreview();
    });
  });
}

function buildFontPreviewGrid(){
  var select=$id('fontFamily'), grid=$id('fontPreviewGrid'); if(!select||!grid)return;
  var fonts=[].slice.call(select.options).filter(function(o){ return o.value && o.value!=='__custom__'; }).map(function(o){ return o.value; });
  grid.innerHTML=fonts.map(function(font){
    return'<button type="button" class="font-preview-card'+(select.value===font?' selected':'')+'" data-font="'+esc2(font)+'" style="font-family:\''+esc2(font)+'\',sans-serif">'+
      '<strong>'+esc2(font)+'</strong><span>Preview: The quick portfolio title</span>'+
    '</button>';
  }).join('');
  grid.querySelectorAll('.font-preview-card').forEach(function(card){
    card.addEventListener('click',function(){
      select.value=card.dataset.font;
      grid.querySelectorAll('.font-preview-card').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
      schedPreview();
    });
  });
}

function hexToRgbWizard(hex){
  var h=String(hex||'').replace('#','');
  if(h.length===3) h=h.split('').map(function(c){ return c+c; }).join('');
  var n=parseInt(h,16);
  if(isNaN(n)) return {r:0,g:0,b:0};
  return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
}
function luminance(hex){
  var rgb=hexToRgbWizard(hex);
  var vals=[rgb.r,rgb.g,rgb.b].map(function(v){
    v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);
  });
  return vals[0]*0.2126+vals[1]*0.7152+vals[2]*0.0722;
}
function contrastRatio(a,b){
  var l1=luminance(a), l2=luminance(b), hi=Math.max(l1,l2), lo=Math.min(l1,l2);
  return (hi+0.05)/(lo+0.05);
}
function setColorStatus(msg, cls){
  var el=$id('colorFixerStatus'); if(!el)return;
  el.textContent=msg; el.className='color-fixer-status '+(cls||'');
}
function checkGradientDistinct(){
  var a=v('gradientColorA'), b=v('gradientColorB'), c=v('gradientColorC');
  if(!a||!b||!c)return true;
  var close=[contrastRatio(a,b),contrastRatio(b,c),contrastRatio(a,c)].some(function(r){ return r<1.25; });
  if(close) setColorStatus('Gradient colours are too similar. Pick more distinct start, middle, and end colours to avoid flat or muddy backgrounds.','warn');
  return !close;
}
function checkColorContrast(){
  var primary=v('primaryColor'), secondary=v('secondaryColor'), accent=v('accentColor'), surface=v('surfaceColor');
  var issues=[];
  if(contrastRatio(surface,'#1e293b')<4.5) issues.push('Surface is too close to body text.');
  if(contrastRatio(primary,'#ffffff')<4.5) issues.push('Primary is too light for white button text.');
  if(contrastRatio(accent,surface)<3) issues.push('Accent may disappear on cards.');
  if(contrastRatio(secondary,'#ffffff')<4.5) issues.push('Secondary is too light for footer/header text.');
  if(!checkGradientDistinct()) issues.push('Gradient colours need more separation.');
  if(issues.length){ setColorStatus(issues.join(' '),'bad'); return false; }
  setColorStatus('Looks readable: buttons, cards, accents, and footer colours have enough separation for most visitors.','good');
  return true;
}
function fixColorContrast(){
  if(contrastRatio(v('surfaceColor'),'#1e293b')<4.5) $id('surfaceColor').value='#ffffff';
  if(contrastRatio(v('primaryColor'),'#ffffff')<4.5) $id('primaryColor').value='#0C7A5A';
  if(contrastRatio(v('secondaryColor'),'#ffffff')<4.5) $id('secondaryColor').value='#042444';
  if(contrastRatio(v('accentColor'),v('surfaceColor'))<3) $id('accentColor').value='#1db88e';
  if(!checkGradientDistinct()){
    $id('gradientColorA').value=v('primaryColor')||'#0C9B70';
    $id('gradientColorB').value='#3b82f6';
    $id('gradientColorC').value=v('secondaryColor')||'#042444';
  }
  syncColorPreviews();
  checkColorContrast();
  schedPreview();
}

var skillModes=[
  {id:'bars',name:'Animated Meters',desc:'Classic progress bars'},
  {id:'cards',name:'Skill Cards',desc:'Card grid with levels'},
  {id:'chips',name:'Highlighted Chips',desc:'Compact badges'},
  {id:'tabs',name:'Tabbed Lists',desc:'Grouped by category'},
  {id:'accordion',name:'Accordions',desc:'Expandable detail'},
  {id:'radial',name:'Visual Graphs',desc:'Circular meters'},
  {id:'table',name:'Compare Table',desc:'Sortable-looking rows'},
  {id:'badges',name:'Pop-up Badges',desc:'Hover-forward badges'}
];
function buildSkillModeGrid(){
  var grid=$id('skillModeGrid'), hidden=$id('skillDisplayMode'); if(!grid||!hidden)return;
  grid.innerHTML=skillModes.map(function(mode){
    return'<button type="button" class="skill-mode-card'+(mode.id===hidden.value?' selected':'')+'" data-mode="'+mode.id+'"><strong>'+mode.name+'</strong><span>'+mode.desc+'</span></button>';
  }).join('');
  grid.querySelectorAll('.skill-mode-card').forEach(function(card){
    card.addEventListener('click',function(){
      hidden.value=card.dataset.mode;
      grid.querySelectorAll('.skill-mode-card').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
      schedPreview();
    });
  });
}

/* ===== EFFECT GRIDS ===== */
function buildEffectGrids(){
  // Effect tabs
  $id('effectTabs').querySelectorAll('.effect-tab').forEach(function(tab){
    tab.addEventListener('click',function(){
      $id('effectTabs').querySelectorAll('.effect-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.effect-panel').forEach(function(p){ p.classList.remove('active'); });
      var panel=$id('ep-'+tab.dataset.panel);
      if(panel) panel.classList.add('active');
    });
  });
  buildEffectGrid('scrollEffectGrid', SCROLL_EFFECTS, 'scrollEffect', 'slideUp');
  buildEffectGrid('hoverEffectGrid', HOVER_EFFECTS, 'hoverEffect', 'lift');
  buildEffectGrid('heroEffectGrid', HERO_EFFECTS, 'heroEffect', 'none');
  buildEffectGrid('cursorEffectGrid', CURSOR_EFFECTS, 'cursorEffect', 'none');
  buildEffectGrid('imageEffectGrid', IMAGE_EFFECTS, 'imageEffect', 'none');
}
function buildEffectGrid(gridId, effects, hiddenId, defaultVal){
  var grid=$id(gridId); if(!grid)return;
  grid.innerHTML=effects.map(function(ef){
    return'<div class="effect-card'+(ef.id===defaultVal?' selected':'')+'" data-val="'+ef.id+'">'+
      '<div class="effect-preview" aria-hidden="true"></div>'+
      '<strong>'+ef.name+'</strong><span>'+ef.desc+'</span>'+
      '<div class="effect-info">Hover this card for a live preview. This effect appears on the generated site when visitors interact with matching sections. <a href="https://portfoliogen-one.vercel.app/work.html" target="_blank" rel="noopener" style="color:var(--primary);font-weight:800">Learn more</a></div>'+
    '</div>';
  }).join('');
  grid.querySelectorAll('.effect-card').forEach(function(card){
    card.addEventListener('click',function(){
      grid.querySelectorAll('.effect-card').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
      card.classList.add('previewing');
      setTimeout(function(){ card.classList.remove('previewing'); }, 900);
      $id(hiddenId).value=card.dataset.val;
      schedPreview();
    });
  });
}

/* ===== SOCIALS UI ===== */
function buildSocialsUI(){
  var list=$id('socialsList'); if(!list)return;
  list.innerHTML=schema.socials.map(function(soc,i){
    var validation=validateSocialInput(soc);
    var shape=soc.iconShape||'circle';
    var color=soc.iconColor||'#0C9B70';
    return'<div class="social-item" data-idx="'+i+'">'+
      '<div class="social-item-icon" style="color:'+esc2(color)+';background:'+esc2(color)+'18;border-radius:'+(shape==='circle'?'50%':shape==='square'?'4px':'12px')+'"><i class="bx '+esc2(soc.icon)+'"></i></div>'+
      '<div class="social-item-info">'+
        '<div class="field-row">'+
          '<div class="field"><label>Platform</label><input type="text" value="'+esc2(soc.name)+'" data-social-name="'+i+'" placeholder="Platform name"></div>'+
          '<div class="field"><label>Icon Class</label><input type="text" value="'+esc2(soc.icon||'bx-link')+'" data-social-icon="'+i+'" placeholder="bxl-github or bx-link"></div>'+
        '</div>'+
        '<div class="social-url"><input type="text" placeholder="Username or full URL" value="'+esc2(soc.url)+'" data-social="'+i+'" class="social-url-input"></div>'+
        '<div class="social-validation '+(validation.ok?'good':'bad')+'">'+validation.message+'</div>'+
        '<div class="social-custom-grid">'+
          '<div class="field"><label>Shape</label><select data-social-shape="'+i+'"><option value="circle"'+(shape==='circle'?' selected':'')+'>Circle</option><option value="soft"'+(shape==='soft'?' selected':'')+'>Soft square</option><option value="square"'+(shape==='square'?' selected':'')+'>Square</option></select></div>'+
          '<div class="field"><label>Colour</label><input type="color" value="'+esc2(color)+'" data-social-color="'+i+'"></div>'+
          '<div class="field"><label>Base URL</label><input type="text" value="'+esc2(soc.base||'')+'" data-social-base="'+i+'" placeholder="https://example.com/"></div>'+
        '</div>'+
        '<div class="icon-suggestions" data-icon-suggestions="'+i+'"></div>'+
        '<div class="placement-checks">'+
          '<label class="placement-check"><input type="checkbox" data-idx="'+i+'" data-place="inNav"'+(soc.inNav?' checked':'')+'>Navbar</label>'+
          '<label class="placement-check"><input type="checkbox" data-idx="'+i+'" data-place="inFooter"'+(soc.inFooter?' checked':'')+'>Footer</label>'+
          '<label class="placement-check"><input type="checkbox" data-idx="'+i+'" data-place="inHero"'+(soc.inHero?' checked':'')+'>Hero</label>'+
        '</div>'+
        '<div class="button-row" style="margin-top:.5rem"><button type="button" class="btn btn-ghost btn-sm social-remove" data-social-remove="'+i+'"><i class="bx bx-trash"></i> Remove</button></div>'+
      '</div>'+
    '</div>';
  }).join('');
  attachIconSuggestions();
  list.querySelectorAll('[data-social-name]').forEach(function(inp){
    inp.addEventListener('input',function(){ var idx=parseInt(inp.dataset.socialName,10); if(schema.socials[idx]) schema.socials[idx].name=inp.value.trim()||'Custom'; schedPreview(); });
  });
  list.querySelectorAll('[data-social-icon]').forEach(function(inp){
    inp.addEventListener('input',function(){
      var idx=parseInt(inp.dataset.socialIcon,10);
      if(schema.socials[idx]) schema.socials[idx].icon=normalizeIconClass(inp.value);
      var icon=inp.closest('.social-item').querySelector('.social-item-icon i');
      if(icon) icon.className='bx '+normalizeIconClass(inp.value);
      schedPreview();
    });
  });
  list.querySelectorAll('.social-url-input').forEach(function(inp){
    inp.addEventListener('input',function(){
      var idx=parseInt(inp.dataset.social,10);
      if(schema.socials[idx]) schema.socials[idx].url=inp.value.trim();
      var status=inp.closest('.social-item').querySelector('.social-validation');
      var validation=validateSocialInput(schema.socials[idx]);
      if(status){ status.textContent=validation.message; status.className='social-validation '+(validation.ok?'good':'bad'); }
      schedPreview();
    });
  });
  list.querySelectorAll('[data-social-shape]').forEach(function(sel){
    sel.addEventListener('change',function(){
      var idx=parseInt(sel.dataset.socialShape,10);
      if(schema.socials[idx]) schema.socials[idx].iconShape=sel.value;
      var icon=sel.closest('.social-item').querySelector('.social-item-icon');
      if(icon) icon.style.borderRadius=sel.value==='circle'?'50%':sel.value==='square'?'4px':'12px';
      schedPreview();
    });
  });
  list.querySelectorAll('[data-social-color]').forEach(function(inp){
    inp.addEventListener('input',function(){
      var idx=parseInt(inp.dataset.socialColor,10);
      if(schema.socials[idx]) schema.socials[idx].iconColor=inp.value;
      var icon=inp.closest('.social-item').querySelector('.social-item-icon');
      if(icon){ icon.style.color=inp.value; icon.style.background=inp.value+'18'; }
      schedPreview();
    });
  });
  list.querySelectorAll('[data-social-base]').forEach(function(inp){
    inp.addEventListener('input',function(){ var idx=parseInt(inp.dataset.socialBase,10); if(schema.socials[idx]) schema.socials[idx].base=inp.value.trim(); schedPreview(); });
  });
  list.querySelectorAll('[data-social-remove]').forEach(function(btn){
    btn.addEventListener('click',function(){ schema.socials.splice(parseInt(btn.dataset.socialRemove,10),1); buildSocialsUI(); schedPreview(); });
  });
  list.querySelectorAll('[data-place]').forEach(function(cb){
    cb.addEventListener('change',function(){
      var idx=parseInt(cb.dataset.idx,10);
      if(schema.socials[idx]) schema.socials[idx][cb.dataset.place]=cb.checked;
      schedPreview();
    });
  });
  setupInputHelp();
}

function normalizeIconClass(icon){
  icon=String(icon||'bx-link').trim().replace(/^bx\s+/,'');
  return icon||'bx-link';
}
function validateSocialInput(soc){
  if(!soc.url) return {ok:true,message:'Optional. Add a username or full URL when you want this profile shown.'};
  if(/^https?:\/\//i.test(soc.url)){
    try{ new URL(soc.url); return {ok:true,message:'Valid full URL.'}; }catch(e){ return {ok:false,message:'URL format looks invalid.'}; }
  }
  if(!soc.base) return {ok:false,message:'Add a full URL or provide a base URL for this custom platform.'};
  if(/\s/.test(soc.url)) return {ok:false,message:'Usernames cannot include spaces. Use a full URL if needed.'};
  return {ok:true,message:'Username will be combined with the platform base URL.'};
}
function addCustomSocial(){
  schema.socials.push({name:'Custom',icon:'bx-link',platform:'custom-'+Date.now(),base:'',inNav:false,inFooter:true,inHero:false,url:'',iconShape:'soft',iconColor:'#0C9B70'});
  buildSocialsUI();
  schedPreview();
}
var fetchedIconOptions=['bxl-github','bxl-linkedin','bxl-twitter','bxl-instagram','bxl-youtube','bxl-dribbble','bxl-behance','bxl-discord','bxl-tiktok','bx-globe','bx-link','bx-envelope','bx-code-alt','bx-palette'];
function attachIconSuggestions(){
  document.querySelectorAll('[data-icon-suggestions]').forEach(function(wrap){
    var idx=parseInt(wrap.dataset.iconSuggestions,10);
    wrap.innerHTML=fetchedIconOptions.slice(0,18).map(function(icon){
      return'<button type="button" title="'+esc2(icon)+'" data-pick-icon="'+esc2(icon)+'" data-idx="'+idx+'"><i class="bx '+esc2(icon)+'"></i></button>';
    }).join('');
  });
  document.querySelectorAll('[data-pick-icon]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var idx=parseInt(btn.dataset.idx,10);
      if(schema.socials[idx]) schema.socials[idx].icon=btn.dataset.pickIcon;
      buildSocialsUI();
      schedPreview();
    });
  });
}
function fetchIconOptions(){
  toast('Fetching Boxicons list...');
  fetch('https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css').then(function(res){ return res.text(); }).then(function(css){
    var found={}, re=/\.((?:bxl|bx|bxs)-[a-z0-9-]+):before/g, m;
    while((m=re.exec(css))){ found[m[1]]=true; }
    fetchedIconOptions=Object.keys(found).slice(0,120);
    buildSocialsUI();
    toast('Icon options loaded.');
  }).catch(function(){
    toast('Using built-in icon suggestions.');
    attachIconSuggestions();
  });
}

/* ===== PAGES UI ===== */
function buildPagesUI(){
  var tabs=$id('pageTabs'), panels=$id('pagePanels');
  if(!tabs||!panels)return;
  tabs.innerHTML=''; panels.innerHTML='';
  var head=document.createElement('div');
  head.className='page-tabs-head';
  var tabWrap=document.createElement('div');
  tabWrap.className='page-tabs';
  schema.pages.forEach(function(page,pi){
    // Tab
    var tab=document.createElement('button');
    tab.className='page-tab'+(pi===0?' active':'');
    tab.dataset.pi=pi;
    tab.innerHTML='<i class="bx '+(page.enabled?'bx-check-circle':'bx-circle')+'"></i> '+page.label;
    tabWrap.appendChild(tab);
    // Panel
    var panel=document.createElement('div');
    panel.className='page-panel'+(pi===0?' active':'');
    panel.dataset.pi=pi;
    panel.innerHTML=buildPagePanel(page, pi);
    panels.appendChild(panel);
  });
  head.appendChild(tabWrap);
  var addBtn=document.createElement('button');
  addBtn.type='button';
  addBtn.className='btn btn-primary btn-sm';
  addBtn.id='addCustomPageBtn';
  addBtn.innerHTML='<i class="bx bx-plus"></i> Add Page';
  head.appendChild(addBtn);
  tabs.appendChild(head);
  var tips=document.createElement('div');
  tips.className='page-tips';
  tips.innerHTML='<div class="page-tip"><strong>Nav label</strong>Controls the text visitors click in the generated navigation and footer.</div>'+
    '<div class="page-tip"><strong>Custom grid</strong>Use the column selector or slider to resize each block across a 12-column layout.</div>'+
    '<div class="page-tip"><strong>Cursor arranging</strong>Drag blocks by the handle to reorder them before export.</div>';
  tabs.appendChild(tips);
  addBtn.addEventListener('click',addCustomPage);
  // Tab click
  tabWrap.querySelectorAll('.page-tab').forEach(function(tab){
    tab.addEventListener('click',function(){
      var pi=parseInt(tab.dataset.pi,10);
      tabs.querySelectorAll('.page-tab').forEach(function(t){ t.classList.remove('active'); });
      panels.querySelectorAll('.page-panel').forEach(function(p){ p.classList.remove('active'); });
      tab.classList.add('active');
      panels.querySelectorAll('.page-panel[data-pi="'+pi+'"]')[0].classList.add('active');
      updateBentoPreview(pi);
    });
  });
  // Init block canvases
  panels.querySelectorAll('.page-panel').forEach(function(panel){
    var pi=parseInt(panel.dataset.pi,10);
    initPagePanel(panel, pi);
  });
  updateBentoPreview(0);
}

function buildPagePanel(page, pi){
  var ruler=Array(12).fill(0).map(function(){ return'<span></span>'; }).join('');
  var canRename=page.name!=='index';
  return'<div class="page-settings">'+
    '<div class="field-row">'+
      '<div class="field"><label>Page Label</label><input type="text" class="page-label-input" data-pi="'+pi+'" value="'+esc2(page.label)+'"></div>'+
      '<div class="field"><label>Nav Label</label><input type="text" class="page-navlabel-input" data-pi="'+pi+'" value="'+esc2(page.navLabel||page.label)+'"></div>'+
    '</div>'+
    '<div class="field-row">'+
      '<div class="field"><label>Page File</label><input type="text" class="page-name-input" data-pi="'+pi+'" value="'+esc2(page.name)+'" '+(canRename?'':'disabled')+'><small class="help-note">Creates '+esc2(page.name)+'.html. Use lowercase words like case-studies.</small></div>'+
      '<div class="field"><label>12-column grid</label><div class="grid-preview-ruler">'+ruler+'</div><small class="help-note">Blocks snap to this grid in the generated layout.</small></div>'+
    '</div>'+
    '<div class="toggle-row" style="padding:.5rem 0">'+
      '<div class="toggle-label"><strong>Enable this page</strong><span>Generates '+page.name+'.html in the ZIP</span></div>'+
      '<label class="toggle"><input type="checkbox" class="page-enable-cb" data-pi="'+pi+'"'+(page.enabled?' checked':'')+'>'+
      '<span class="toggle-slider"></span></label>'+
    '</div>'+
    (canRename?'<div class="button-row" style="justify-content:flex-end"><button type="button" class="btn btn-ghost btn-sm page-delete-btn" data-pi="'+pi+'"><i class="bx bx-trash"></i> Delete page</button></div>':'')+
  '</div>'+
  '<div class="block-layout">'+
    '<aside class="palette-wrap">'+
      '<p class="card-title">Blocks</p>'+
      '<div class="palette" data-pi="'+pi+'">'+
        Object.keys(BLOCK_REGISTRY).map(function(type){
          var r=BLOCK_REGISTRY[type];
          return'<button type="button" class="palette-item" data-type="'+type+'" data-pi="'+pi+'">'+
            '<span class="palette-icon">'+r.icon+'</span>'+
            '<span class="palette-info"><span class="palette-name">'+r.label+'</span><span class="palette-desc">'+r.description+'</span></span>'+
            '<i class="bx bx-plus"></i>'+
          '</button>';
        }).join('')+
      '</div>'+
    '</aside>'+
    '<div class="canvas-wrap">'+
      '<div id="blockCanvas-'+pi+'" class="canvas-wrap"><div id="bc-'+pi+'" style="display:grid;gap:.45rem;min-height:120px;padding:.65rem;background:var(--surface);border:1.5px dashed var(--border);border-radius:var(--radius-lg)">'+
        '<div class="canvas-empty"><i class="bx bx-plus-circle" style="font-size:1.5rem;opacity:.4"></i><span>Click a block to add it</span></div>'+
      '</div></div>'+
    '</div>'+
  '</div>';
}

function initPagePanel(panel, pi){
  // Page label inputs
  panel.querySelectorAll('.page-label-input').forEach(function(inp){
    inp.addEventListener('input',function(){
      schema.pages[pi].label=inp.value;
      var tab=document.querySelector('.page-tab[data-pi="'+pi+'"]');
      if(tab) tab.innerHTML='<i class="bx '+(schema.pages[pi].enabled?'bx-check-circle':'bx-circle')+'"></i> '+inp.value;
      schedPreview();
    });
  });
  panel.querySelectorAll('.page-navlabel-input').forEach(function(inp){
    inp.addEventListener('input',function(){ schema.pages[pi].navLabel=inp.value; schedPreview(); });
  });
  panel.querySelectorAll('.page-name-input').forEach(function(inp){
    inp.addEventListener('input',function(){
      if(schema.pages[pi].name==='index') return;
      var next=slugifyPageName(inp.value);
      var taken=schema.pages.some(function(p,idx){ return idx!==pi&&p.name===next; });
      if(!taken){ schema.pages[pi].name=next; }
      schedPreview();
    });
    inp.addEventListener('blur',function(){ inp.value=schema.pages[pi].name; });
  });
  panel.querySelectorAll('.page-enable-cb').forEach(function(cb){
    cb.addEventListener('change',function(){
      schema.pages[pi].enabled=cb.checked;
      var tab=document.querySelector('.page-tab[data-pi="'+pi+'"]');
      if(tab) tab.innerHTML='<i class="bx '+(cb.checked?'bx-check-circle':'bx-circle')+'"></i> '+(schema.pages[pi].label||'Page');
      schedPreview();
    });
  });
  panel.querySelectorAll('.page-delete-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(schema.pages[pi].name==='index') return;
      schema.pages.splice(pi,1);
      buildPagesUI();
      schedPreview();
    });
  });
  // Palette
  panel.querySelectorAll('.palette-item').forEach(function(btn){
    btn.addEventListener('click',function(){ addBlockToPage(pi, btn.dataset.type); });
  });
  renderCanvas(pi);
}

function renderCanvas(pi){
  var canvas=document.getElementById('bc-'+pi); if(!canvas)return;
  var blocks=schema.pages[pi]&&schema.pages[pi].blocks||[];
  var sorted=blocks.slice().sort(function(a,b){ return (a.order||0)-(b.order||0); });
  if(!sorted.length){ canvas.innerHTML='<div class="canvas-empty"><i class="bx bx-plus-circle" style="font-size:1.5rem;opacity:.4"></i><span>Click a block to add it</span></div>'; updateBentoPreview(pi); return; }
  canvas.innerHTML=sorted.map(function(block,idx){
    var reg=BLOCK_REGISTRY[block.type]||{label:block.type,icon:'?'};
    return'<div class="canvas-block'+(block.disabled?' disabled':'')+'" data-bid="'+block.id+'" data-pi="'+pi+'" draggable="true">'+
      '<span class="drag-handle"><i class="bx bx-grid-vertical"></i></span>'+
      '<div class="canvas-block__main"><span class="palette-icon">'+reg.icon+'</span>'+
        '<span class="canvas-block__name">'+reg.label+'</span>'+
        (block.disabled?'<span class="disabled-badge">OFF</span>':'')+
      '</div>'+
      '<div class="canvas-block__controls">'+
        '<select class="col-select" data-action="cols">'+
          '<option value="3"'+(block.cols===3?' selected':'')+'>3</option>'+
          '<option value="4"'+(block.cols===4?' selected':'')+'>4</option>'+
          '<option value="6"'+(block.cols===6?' selected':'')+'>6</option>'+
          '<option value="8"'+(block.cols===8?' selected':'')+'>8</option>'+
          '<option value="12"'+(block.cols===12?' selected':'')+'>12</option>'+
        '</select>'+
        '<input type="range" class="col-range" data-action="colsRange" min="3" max="12" step="1" value="'+(block.cols||12)+'" title="Adjust block width">'+
        '<button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="toggle" title="Toggle"><i class="bx '+(block.disabled?'bx-show':'bx-hide')+'"></i></button>'+
        '<button type="button" class="btn btn-danger btn-icon btn-sm" data-action="remove"><i class="bx bx-x"></i></button>'+
      '</div>'+
    '</div>';
  }).join('');
  canvas.querySelectorAll('.canvas-block').forEach(function(row){
    var bid=row.dataset.bid; var pageIdx=parseInt(row.dataset.pi,10);
    row.querySelector('[data-action="cols"]').addEventListener('change',function(e){
      var blk=getBlock(pageIdx,bid); if(blk){ blk.cols=parseInt(e.target.value,10); var range=row.querySelector('[data-action="colsRange"]'); if(range) range.value=blk.cols; updateBentoPreview(pageIdx); schedPreview(); }
    });
    row.querySelector('[data-action="colsRange"]').addEventListener('input',function(e){
      var allowed=[3,4,6,8,12];
      var raw=parseInt(e.target.value,10);
      var next=allowed.reduce(function(best,val){ return Math.abs(val-raw)<Math.abs(best-raw)?val:best; },12);
      var blk=getBlock(pageIdx,bid);
      if(blk){
        blk.cols=next;
        row.querySelector('[data-action="cols"]').value=String(next);
        updateBentoPreview(pageIdx);
        schedPreview();
      }
    });
    row.querySelector('[data-action="toggle"]').addEventListener('click',function(){
      var blk=getBlock(pageIdx,bid); if(blk){ blk.disabled=!blk.disabled; renderCanvas(pageIdx); schedPreview(); }
    });
    row.querySelector('[data-action="remove"]').addEventListener('click',function(){
      schema.pages[pageIdx].blocks=schema.pages[pageIdx].blocks.filter(function(b){ return b.id!==bid; });
      reorderPageBlocks(pageIdx); renderCanvas(pageIdx); schedPreview();
    });
    // Drag
    row.addEventListener('dragstart',function(){ row.setAttribute('dragging','1'); });
    row.addEventListener('dragend',function(){ row.removeAttribute('dragging'); });
    row.addEventListener('dragover',function(e){ e.preventDefault(); });
    row.addEventListener('drop',function(e){
      e.preventDefault();
      var dragging=canvas.querySelector('[dragging]');
      if(dragging&&dragging!==row){
        var fromId=dragging.dataset.bid, toId=row.dataset.bid;
        var arr=schema.pages[pageIdx].blocks;
        var fi=arr.findIndex(function(b){ return b.id===fromId; });
        var ti=arr.findIndex(function(b){ return b.id===toId; });
        if(fi>=0&&ti>=0){ var m=arr.splice(fi,1)[0]; arr.splice(ti,0,m); reorderPageBlocks(pageIdx); renderCanvas(pageIdx); schedPreview(); }
      }
    });
  });
  updateBentoPreview(pi);
}

function addBlockToPage(pi, type){
  var reg=BLOCK_REGISTRY[type];
  var id=type+'-'+Date.now();
  var blocks=schema.pages[pi].blocks;
  var data={};
  if(type==='skills') data.skills=getPrimaryBlockItems('skills','skills');
  if(type==='projects') data.projects=projects.slice();
  if(type==='services') data.services=getExistingBlockItems('services','services').slice();
  blocks.push({id:id,type:type,cols:reg?reg.defaultCols:12,order:blocks.length,data:data,disabled:false});
  reorderPageBlocks(pi); renderCanvas(pi); schedPreview();
}
function addCustomPage(){
  var base='new-page';
  var n=1;
  var name=base;
  while(schema.pages.some(function(p){ return p.name===name; })){ n++; name=base+'-'+n; }
  schema.pages.push({name:name,label:'New Page',navLabel:'New Page',enabled:true,custom:true,blocks:[
    {id:'hero-'+Date.now(),type:'hero',cols:12,order:0,data:{}},
    {id:'bio-'+Date.now(),type:'bio',cols:12,order:1,data:{}}
  ]});
  buildPagesUI();
  var tab=document.querySelector('.page-tab[data-pi="'+(schema.pages.length-1)+'"]');
  if(tab) tab.click();
  schedPreview();
}
function getBlock(pi, bid){ var p=schema.pages[pi]; return p&&p.blocks.find(function(b){ return b.id===bid; }); }
function reorderPageBlocks(pi){ var p=schema.pages[pi]; if(p) p.blocks.forEach(function(b,i){ b.order=i; }); }

function updateBentoPreview(pi){
  var prev=$id('bentoPreview'); if(!prev)return;
  var blocks=(schema.pages[pi]&&schema.pages[pi].blocks)||[];
  var sorted=blocks.filter(function(b){ return !b.disabled; }).sort(function(a,b){ return a.order-b.order; });
  if(!sorted.length){ prev.innerHTML='<span style="color:var(--muted2);font-size:.8rem">Add blocks above</span>'; return; }
  prev.innerHTML=sorted.map(function(b){
    var reg=BLOCK_REGISTRY[b.type]||{label:b.type};
    return'<span class="preview-cell" style="width:'+Math.max(22,Math.round((b.cols||12)/12*100))+'%">'+reg.label+'</span>';
  }).join('');
}

/* ===== SKILLS ===== */
function addSkill(){
  var skills=getPrimaryBlockItems('skills','skills');
  skills.push({name:'',level:75,color:'#0C9B70',category:''});
  syncSkillsToBlocks();
  renderAllSkillsEditors(); schedPreview();
}

function renderAllSkillsEditors(){
  var list=$id('skillsList'); if(!list)return;
  var allSkills=getPrimaryBlockItems('skills','skills');
  if(!allSkills.length){ list.innerHTML='<p class="hint">No skills yet. Click Add Skill.</p>'; return; }
  list.innerHTML=allSkills.map(function(sk,i){
    return'<div class="skill-card" data-si="'+i+'">'+
      '<div class="skill-card-top">'+
        '<div class="skill-color-dot" title="Click to change color" style="background:'+esc2(sk.color||'#0C9B70')+'" data-si="'+i+'">'+
          '<input type="color" value="'+esc2(sk.color||'#0C9B70')+'" style="opacity:0;position:absolute;width:32px;height:32px;cursor:pointer" class="skill-color-input">'+
        '</div>'+
        '<div style="flex:1"><input type="text" placeholder="Skill name" value="'+esc2(sk.name)+'" class="skill-name-input" style="width:100%;padding:.4rem .6rem;border:1.5px solid var(--border);border-radius:var(--radius);background:var(--surface2);color:var(--text)" data-si="'+i+'"></div>'+
        '<div style="flex:1"><input type="text" placeholder="Category (optional)" value="'+esc2(sk.category||'')+'" class="skill-cat-input" style="width:100%;padding:.4rem .6rem;border:1.5px solid var(--border);border-radius:var(--radius);background:var(--surface2);color:var(--text)" data-si="'+i+'"></div>'+
        '<button type="button" class="btn btn-danger btn-icon btn-sm skill-del" data-si="'+i+'"><i class="bx bx-x"></i></button>'+
      '</div>'+
      '<div class="skill-level-row">'+
        '<span style="font-size:.75rem;color:var(--muted);min-width:48px">Level</span>'+
        '<input type="range" min="0" max="100" value="'+esc2(sk.level)+'" class="skill-slider" data-si="'+i+'">'+
        '<span class="skill-pct-badge" data-si="'+i+'">'+sk.level+'%</span>'+
      '</div>'+
      '<div class="skill-bar-preview"><div class="skill-bar-fill" data-si="'+i+'" style="width:'+sk.level+'%;background:'+esc2(sk.color||'#0C9B70')+'"></div></div>'+
    '</div>';
  }).join('');
  bindSkillsEvents(list, allSkills);
}

function bindSkillsEvents(list, skills){
  list.querySelectorAll('.skill-slider').forEach(function(sl){
    sl.addEventListener('input',function(){
      var i=parseInt(sl.dataset.si,10); skills[i].level=parseInt(sl.value,10);
      var badge=list.querySelector('.skill-pct-badge[data-si="'+i+'"]');
      var fill=list.querySelector('.skill-bar-fill[data-si="'+i+'"]');
      if(badge) badge.textContent=sl.value+'%';
      if(fill){ fill.style.width=sl.value+'%'; }
      schedPreview();
    });
  });
  list.querySelectorAll('.skill-name-input').forEach(function(inp){
    inp.addEventListener('input',function(){ skills[parseInt(inp.dataset.si,10)].name=inp.value; schedPreview(); });
  });
  list.querySelectorAll('.skill-cat-input').forEach(function(inp){
    inp.addEventListener('input',function(){ skills[parseInt(inp.dataset.si,10)].category=inp.value; schedPreview(); });
  });
  list.querySelectorAll('.skill-color-input').forEach(function(inp){
    inp.addEventListener('input',function(){
      var i=parseInt(inp.closest('[data-si]').dataset.si,10);
      skills[i].color=inp.value;
      var dot=inp.closest('.skill-color-dot'); if(dot) dot.style.background=inp.value;
      var fill=list.querySelector('.skill-bar-fill[data-si="'+i+'"]'); if(fill) fill.style.background=inp.value;
      var sl=list.querySelector('.skill-slider[data-si="'+i+'"]'); if(sl) sl.style.accentColor=inp.value;
      schedPreview();
    });
  });
  list.querySelectorAll('.skill-del').forEach(function(btn){
    btn.addEventListener('click',function(){
      var i=parseInt(btn.dataset.si,10); skills.splice(i,1);
      syncSkillsToBlocks(); renderAllSkillsEditors(); schedPreview();
    });
  });
}

/* ===== SKILL IMPORT MODAL ===== */
function openImportModal(){
  var grps=$id('skillGroups'); if(!grps)return;
  grps.innerHTML=skillImportGroups.map(function(g,i){
    return'<label style="display:flex;align-items:center;gap:.5rem;padding:.5rem;border:1.5px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:all .15s">'+
      '<input type="checkbox" data-gi="'+i+'"> '+
      '<div><strong style="font-size:.84rem">'+g.name+'</strong><br><small style="color:var(--muted)">'+g.skills.slice(0,3).join(', ')+'…</small></div>'+
    '</label>';
  }).join('');
  $id('importModal').style.display='flex';
}
function closeImportModal(){ $id('importModal').style.display='none'; }
function doImportSkills(){
  var allSkills=getPrimaryBlockItems('skills','skills');
  var colors=['#0C9B70','#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981'];
  $id('skillGroups').querySelectorAll('input:checked').forEach(function(cb){
    var gi=parseInt(cb.dataset.gi,10);
    skillImportGroups[gi].skills.forEach(function(sk,i){
      var parts=sk.split(':'); var existing=allSkills.find(function(s){ return s.name===parts[0].trim(); });
      if(!existing) allSkills.push({name:parts[0].trim(),level:parseInt(parts[1]||75),color:colors[i%colors.length],category:skillImportGroups[gi].name});
    });
  });
  syncSkillsToBlocks(); closeImportModal(); renderAllSkillsEditors(); schedPreview(); toast('Skills imported!');
}

/* ===== PROJECTS ===== */
var projects=[];
function addProject(){
  projects.push({title:'',category:'',desc:'',link:'',source:'',tags:'',imageBase64:'',featured:false});
  renderProjectsList(); schedPreview();
}
function renderProjectsList(){
  var list=$id('projectsList'); if(!list)return;
  if(!projects.length){ list.innerHTML='<p class="hint">No projects yet.</p>'; return; }
  list.innerHTML=projects.map(function(p,i){
    return'<div class="entry-card" data-pi="'+i+'">'+
      '<div class="entry-card-head">'+
        '<span class="entry-card-title"><i class="bx bx-grid-vertical drag-handle"></i> Project '+(i+1)+'</span>'+
        '<div class="button-row">'+
          '<label style="display:flex;align-items:center;gap:.3rem;font-size:.78rem"><input type="checkbox" class="proj-featured-cb" data-pi="'+i+'"'+(p.featured?' checked':'')+'>Featured</label>'+
          '<button type="button" class="btn btn-danger btn-icon btn-sm proj-del" data-pi="'+i+'"><i class="bx bx-x"></i></button>'+
        '</div>'+
      '</div>'+
      '<div class="field-row"><div class="field"><label>Title</label><input type="text" class="proj-input" data-field="title" data-pi="'+i+'" value="'+esc2(p.title)+'"></div>'+
      '<div class="field"><label>Category</label><input type="text" class="proj-input" data-field="category" data-pi="'+i+'" value="'+esc2(p.category)+'"></div></div>'+
      '<div class="field"><label>Description (unlimited)</label><textarea class="proj-input" data-field="desc" data-pi="'+i+'" rows="3">'+esc2(p.desc)+'</textarea></div>'+
      '<div class="field-row"><div class="field"><label>Live URL</label><input type="text" class="proj-input" data-field="link" data-pi="'+i+'" value="'+esc2(p.link)+'"></div>'+
      '<div class="field"><label>Source URL</label><input type="text" class="proj-input" data-field="source" data-pi="'+i+'" value="'+esc2(p.source)+'"></div></div>'+
      '<div class="field"><label>Tags (comma separated)</label><input type="text" class="proj-input" data-field="tags" data-pi="'+i+'" value="'+esc2(p.tags||'')+'" placeholder="React, Node.js, MongoDB"></div>'+
      '<div class="field"><label>Project Image</label>'+
        '<label class="upload-zone" style="min-height:70px">'+
          '<input type="file" accept="image/jpeg,image/png,image/webp" class="proj-img-input" data-pi="'+i+'">'+
          '<i class="bx bx-image-add"></i><span>Upload image</span>'+
        '</label>'+
        (p.imageBase64?'<div class="img-preview" style="margin-top:.5rem"><img src="'+p.imageBase64+'" alt="Project" style="width:80px;height:45px;border-radius:4px;object-fit:cover;border:none"><button type="button" class="btn btn-ghost btn-sm proj-img-del" data-pi="'+i+'">Remove</button></div>':'')+
      '</div>'+
    '</div>';
  }).join('');
  list.querySelectorAll('.proj-input').forEach(function(inp){
    inp.addEventListener('input',function(){
      var fi=inp.dataset.field, pi=parseInt(inp.dataset.pi,10);
      if(projects[pi]!==undefined) projects[pi][fi]=inp.value;
      schedPreview();
    });
  });
  list.querySelectorAll('.proj-del').forEach(function(btn){
    btn.addEventListener('click',function(){ projects.splice(parseInt(btn.dataset.pi,10),1); renderProjectsList(); schedPreview(); });
  });
  list.querySelectorAll('.proj-featured-cb').forEach(function(cb){
    cb.addEventListener('change',function(){ projects[parseInt(cb.dataset.pi,10)].featured=cb.checked; schedPreview(); });
  });
  list.querySelectorAll('.proj-img-input').forEach(function(inp){
    inp.addEventListener('change',function(){
      var pi=parseInt(inp.dataset.pi,10);
      if(inp.files[0]) resizeImg(inp.files[0],900,500).then(function(url){ projects[pi].imageBase64=url; renderProjectsList(); schedPreview(); });
    });
  });
  list.querySelectorAll('.proj-img-del').forEach(function(btn){
    btn.addEventListener('click',function(){ projects[parseInt(btn.dataset.pi,10)].imageBase64=''; renderProjectsList(); schedPreview(); });
  });
  setupInputHelp();
}

/* ===== TESTIMONIALS ===== */
function addTestimonial(){
  ensureBlockOnHome('testimonials');
  schema.testimonials.push({name:'',role:'',quote:'',avatar:''});
  renderTestiList(); schedPreview();
}
function renderTestiList(){
  var list=$id('testiList'); if(!list)return;
  if(!schema.testimonials.length){ list.innerHTML='<p class="hint">No testimonials yet.</p>'; return; }
  list.innerHTML=schema.testimonials.map(function(t,i){
    return'<div class="entry-card">'+
      '<div class="entry-card-head"><span class="entry-card-title">Testimonial '+(i+1)+'</span>'+
      '<button type="button" class="btn btn-danger btn-icon btn-sm" data-ti="'+i+'" onclick="schema.testimonials.splice('+i+',1);renderTestiList();schedPreview()"><i class="bx bx-x"></i></button></div>'+
      '<div class="field"><label>Quote (unlimited)</label><textarea data-field="quote" data-ti="'+i+'" rows="3" class="testi-input">'+esc2(t.quote)+'</textarea></div>'+
      '<div class="field-row"><div class="field"><label>Name</label><input type="text" class="testi-input" data-field="name" data-ti="'+i+'" value="'+esc2(t.name)+'"></div>'+
      '<div class="field"><label>Role / Company</label><input type="text" class="testi-input" data-field="role" data-ti="'+i+'" value="'+esc2(t.role)+'"></div></div>'+
    '</div>';
  }).join('');
  list.querySelectorAll('.testi-input').forEach(function(inp){
    inp.addEventListener('input',function(){ var ti=parseInt(inp.dataset.ti,10); schema.testimonials[ti][inp.dataset.field]=inp.value; schedPreview(); });
  });
  setupInputHelp();
}

/* ===== SERVICES ===== */
function addService(){
  var services=getPrimaryBlockItems('services','services');
  services.push({title:'',desc:'',emoji:'⚡',price:''});
  syncServicesToBlocks();
  renderServicesList(); schedPreview();
}
function renderServicesList(){
  var list=$id('servicesList'); if(!list)return;
  var services=getExistingBlockItems('services','services');
  if(!services.length){ list.innerHTML='<p class="hint">No services yet.</p>'; return; }
  list.innerHTML=services.map(function(sv,i){
    return'<div class="entry-card">'+
      '<div class="entry-card-head"><span class="entry-card-title">Service '+(i+1)+'</span>'+
      '<button type="button" class="btn btn-danger btn-icon btn-sm svc-del" data-svi="'+i+'"><i class="bx bx-x"></i></button></div>'+
      '<div class="field-row"><div class="field"><label>Emoji Icon</label><input type="text" value="'+esc2(sv.emoji||'⚡')+'" style="width:60px" data-field="emoji" data-svi="'+i+'" class="svc-input"></div>'+
      '<div class="field"><label>Title</label><input type="text" value="'+esc2(sv.title)+'" data-field="title" data-svi="'+i+'" class="svc-input"></div>'+
      '<div class="field"><label>Price</label><input type="text" value="'+esc2(sv.price||'')+'" data-field="price" data-svi="'+i+'" class="svc-input" placeholder="From $500"></div></div>'+
      '<div class="field"><label>Description</label><textarea data-field="desc" data-svi="'+i+'" class="svc-input" rows="2">'+esc2(sv.desc)+'</textarea></div>'+
    '</div>';
  }).join('');
  list.querySelectorAll('.svc-input').forEach(function(inp){
    inp.addEventListener('input',function(){
      var si=parseInt(inp.dataset.svi,10);
      services[si][inp.dataset.field]=inp.value;
      syncServicesToBlocks();
      schedPreview();
    });
  });
  list.querySelectorAll('.svc-del').forEach(function(btn){
    btn.addEventListener('click',function(){
      services.splice(parseInt(btn.dataset.svi,10),1);
      syncServicesToBlocks(); renderServicesList(); schedPreview();
    });
  });
  setupInputHelp();
}

/* ===== EDUCATION / EXPERIENCE / CERTS ===== */
function addEntry(type){
  if(type==='education') schema.education.push({institution:'',degree:'',field:'',startYear:'',endYear:'',grade:'',desc:''});
  else if(type==='experience') schema.experience.push({role:'',company:'',location:'',from:'',to:'',desc:'',tags:''});
  else if(type==='certs') schema.certs.push({name:'',issuer:'',year:'',url:''});
  renderEntry(type); schedPreview();
}
function renderEntry(type){
  var listId=type==='education'?'eduList':type==='experience'?'expList':'certList';
  var list=$id(listId); if(!list)return;
  var arr=schema[type];
  if(!arr||!arr.length){ list.innerHTML='<p class="hint">No '+type+' added yet.</p>'; return; }
  if(type==='education'){
    list.innerHTML=arr.map(function(item,i){
      return'<div class="entry-card">'+
        '<div class="entry-card-head"><span class="entry-card-title">Education '+(i+1)+'</span>'+
        '<button type="button" class="btn btn-danger btn-icon btn-sm" onclick="schema.education.splice('+i+',1);renderEntry(\'education\');schedPreview()"><i class="bx bx-x"></i></button></div>'+
        '<div class="field-row"><div class="field"><label>Institution</label><input class="edu-inp" data-i="'+i+'" data-f="institution" value="'+esc2(item.institution)+'"></div>'+
        '<div class="field"><label>Degree / Course</label><input class="edu-inp" data-i="'+i+'" data-f="degree" value="'+esc2(item.degree)+'"></div></div>'+
        '<div class="field-row"><div class="field"><label>Field of Study</label><input class="edu-inp" data-i="'+i+'" data-f="field" value="'+esc2(item.field)+'"></div>'+
        '<div class="field"><label>Grade / GPA</label><input class="edu-inp" data-i="'+i+'" data-f="grade" value="'+esc2(item.grade)+'"></div></div>'+
        '<div class="field-row"><div class="field"><label>Start Year</label><input type="number" class="edu-inp" data-i="'+i+'" data-f="startYear" value="'+esc2(item.startYear)+'"></div>'+
        '<div class="field"><label>End Year</label><input class="edu-inp" data-i="'+i+'" data-f="endYear" value="'+esc2(item.endYear)+'" placeholder="Present"></div></div>'+
        '<div class="field"><label>Description</label><textarea class="edu-inp" data-i="'+i+'" data-f="desc" rows="2">'+esc2(item.desc)+'</textarea></div>'+
      '</div>';
    }).join('');
    list.querySelectorAll('.edu-inp').forEach(function(inp){
      inp.addEventListener('input',function(){ schema.education[parseInt(inp.dataset.i,10)][inp.dataset.f]=inp.value; schedPreview(); });
    });
  } else if(type==='experience'){
    list.innerHTML=arr.map(function(item,i){
      return'<div class="entry-card">'+
        '<div class="entry-card-head"><span class="entry-card-title">Experience '+(i+1)+'</span>'+
        '<button type="button" class="btn btn-danger btn-icon btn-sm" onclick="schema.experience.splice('+i+',1);renderEntry(\'experience\');schedPreview()"><i class="bx bx-x"></i></button></div>'+
        '<div class="field-row"><div class="field"><label>Role / Position</label><input class="exp-inp" data-i="'+i+'" data-f="role" value="'+esc2(item.role)+'"></div>'+
        '<div class="field"><label>Company</label><input class="exp-inp" data-i="'+i+'" data-f="company" value="'+esc2(item.company)+'"></div></div>'+
        '<div class="field-row"><div class="field"><label>Location</label><input class="exp-inp" data-i="'+i+'" data-f="location" value="'+esc2(item.location)+'"></div>'+
        '<div class="field"><label>From</label><input type="text" class="exp-inp" data-i="'+i+'" data-f="from" value="'+esc2(item.from)+'" placeholder="Jan 2022"></div></div>'+
        '<div class="field-row"><div class="field"><label>To</label><input type="text" class="exp-inp" data-i="'+i+'" data-f="to" value="'+esc2(item.to)+'" placeholder="Present"></div>'+
        '<div class="field"><label>Tech Stack Tags</label><input class="exp-inp" data-i="'+i+'" data-f="tags" value="'+esc2(item.tags||'')+'" placeholder="React, AWS, Node.js"></div></div>'+
        '<div class="field"><label>Description (unlimited)</label><textarea class="exp-inp" data-i="'+i+'" data-f="desc" rows="3">'+esc2(item.desc)+'</textarea></div>'+
      '</div>';
    }).join('');
    list.querySelectorAll('.exp-inp').forEach(function(inp){
      inp.addEventListener('input',function(){ schema.experience[parseInt(inp.dataset.i,10)][inp.dataset.f]=inp.value; schedPreview(); });
    });
  } else {
    list.innerHTML=arr.map(function(item,i){
      return'<div class="entry-card">'+
        '<div class="entry-card-head"><span class="entry-card-title">Certificate '+(i+1)+'</span>'+
        '<button type="button" class="btn btn-danger btn-icon btn-sm" onclick="schema.certs.splice('+i+',1);renderEntry(\'certs\');schedPreview()"><i class="bx bx-x"></i></button></div>'+
        '<div class="field-row"><div class="field"><label>Name</label><input class="cert-inp" data-i="'+i+'" data-f="name" value="'+esc2(item.name)+'"></div>'+
        '<div class="field"><label>Issuer</label><input class="cert-inp" data-i="'+i+'" data-f="issuer" value="'+esc2(item.issuer)+'"></div></div>'+
        '<div class="field-row"><div class="field"><label>Year</label><input type="number" class="cert-inp" data-i="'+i+'" data-f="year" value="'+esc2(item.year)+'"></div>'+
        '<div class="field"><label>Verify URL</label><input type="text" class="cert-inp" data-i="'+i+'" data-f="url" value="'+esc2(item.url)+'"></div></div>'+
      '</div>';
    }).join('');
    list.querySelectorAll('.cert-inp').forEach(function(inp){
      inp.addEventListener('input',function(){ schema.certs[parseInt(inp.dataset.i,10)][inp.dataset.f]=inp.value; schedPreview(); });
    });
  }
  setupInputHelp();
}

/* ===== COLLECT SCHEMA ===== */
function collectSchema(){
  // Step 1
  schema.meta.name=v('fullName'); schema.meta.title=v('profTitle');
  schema.meta.email=v('email'); schema.meta.phone=v('phone');
  schema.meta.tagline=v('tagline'); schema.meta.bio=v('bio');
  schema.meta.resumeUrl=v('resumeUrl');
  schema.meta.addressCity=v('addressCity'); schema.meta.addressState=v('addressState');
  schema.meta.addressCountry=v('addressCountry'); schema.meta.timezone=v('timezone');
  // Step 5
  schema.theme.primaryColor=$id('primaryColor').value;
  schema.theme.secondaryColor=$id('secondaryColor').value;
  schema.theme.accentColor=$id('accentColor').value;
  schema.theme.surfaceColor=$id('surfaceColor').value;
  schema.theme.gradientColorA=$id('gradientColorA').value;
  schema.theme.gradientColorB=$id('gradientColorB').value;
  schema.theme.gradientColorC=$id('gradientColorC').value;
  schema.theme.fontFamily=customSelectValue('fontFamily');
  schema.theme.borderRadius=customSelectValue('borderRadius');
  schema.theme.spacing=customSelectValue('spacingSelect');
  schema.theme.heroLayout=customSelectValue('heroLayout');
  schema.theme.darkMode=$id('darkMode').checked;
  schema.theme.aesthetic=v('uiStyle');
  schema.theme.gradientPreset=v('gradientPreset');
  schema.theme.gradientType=customSelectValue('gradientType');
  schema.theme.gradientDir=customSelectValue('gradientDir');
  // Step 6
  schema.theme.scrollEffect=v('scrollEffect');
  schema.theme.hoverEffect=v('hoverEffect');
  schema.theme.heroEffect=v('heroEffect');
  schema.theme.cursorEffect=v('cursorEffect');
  schema.theme.imageEffect=v('imageEffect');
  schema.theme.pageTransitions=$id('pageTransitions').checked;
  schema.theme.animations={enabled:true,style:v('scrollEffect')};
  schema.theme.skillDisplay={
    mode:v('skillDisplayMode')||'bars',
    animate:v('skillAnimate')!=='false',
    searchable:v('skillSearchable')==='true',
    showCategories:v('skillCategories')!=='false',
    badgeShape:v('skillBadgeShape')||'pill'
  };
  // Step 4
  schema.integrations.githubCommits=$id('intGithub').checked;
  schema.integrations.githubUsername=v('ghUsername');
  schema.contact.heading=v('contactHeading');
  schema.contact.subtext=v('contactSubtext');
  schema.contact.desc=v('contactDesc');
  schema.contact.showForm=$id('showContactForm').checked;
  schema.contact.showMap=$id('showMap').checked;
  schema.contact.mapUrl=v('mapUrl');
  schema.contact.showAvailability=$id('showAvailability').checked;
  schema.contact.status=customSelectValue('availabilityStatus');
  schema.footer.about=v('footerAbout');
  // Availability badge
  var statusLabels={'available':'✅ Available for new projects','busy':'🔴 Currently busy','parttime':'🟡 Available part-time','remote':'🌍 Open to remote only'};
  schema.availabilityBadge=schema.contact.showAvailability?statusLabels[schema.contact.status]||schema.contact.status||'':'';
  // Step 7
  schema.siteURL=v('siteURL'); schema.seoKeywords=v('seoKeywords');
  syncSkillsToBlocks();
  syncProjectsToBlocks();
  if(getBlocksByType('services').length) syncServicesToBlocks();
  return schema;
}

/* ===== DOWNLOAD ===== */
async function startDownload(){
  var btn=$id('btnDownload');
  btn.disabled=true; btn.innerHTML='<i class="bx bx-loader-alt bx-spin"></i> Generating…';
  try{
    collectSchema();
    var zip=buildZIP(schema);
    var blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
    var slug=(schema.meta.name||'portfolio').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'portfolio';
    saveAs(blob, slug+'-portfolio.zip');
    btn.innerHTML='<i class="bx bx-check"></i> Downloaded!';
    toast('ZIP downloaded successfully!', 3000);
    setTimeout(function(){ btn.disabled=false; btn.innerHTML='<i class="bx bx-download"></i> Download ZIP'; }, 2500);
  }catch(err){
    console.error(err);
    alert('Error generating ZIP: '+err.message);
    btn.disabled=false; btn.innerHTML='<i class="bx bx-download"></i> Download ZIP';
  }
}

/* ===== SOCIAL URL BUILD ===== */
function buildSocialUrl(soc){
  var url=soc.url;
  if(!url)return '';
  if(/^https?:\/\//i.test(url))return url;
  return (soc.base||'')+url.replace(/^@/,'');
}

// Make socials have full URLs when rendering
(function(){ var origCollect=collectSchema; collectSchema=function(){
  var s=origCollect();
  s.socials=s.socials.map(function(soc){
    return Object.assign({},soc,{url:buildSocialUrl(soc)});
  });
  return s;
}; })();

initWizard();
