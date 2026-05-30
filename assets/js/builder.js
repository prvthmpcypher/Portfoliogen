/* ============================================================
   ProfileGen Builder - client-side JSON to static portfolio
   ============================================================ */

/* Escapes text content for safe HTML output. */
function esc(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* Escapes attribute content for safe HTML output. */
function attr(value) {
    return esc(value).replace(/`/g, '&#096;');
}

/* Keeps a numeric value inside a percentage-friendly range. */
function clampPct(value) {
    var n = parseInt(value, 10);
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
}

/* Returns the current year for generated static footer text. */
function currentYear() {
    return new Date().getFullYear();
}

var AVATAR_SVG = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22400%22 viewBox%3D%220 0 400 400%22%3E%3Crect width%3D%22400%22 height%3D%22400%22 fill%3D%22%23e2e8f0%22%2F%3E%3Ccircle cx%3D%22200%22 cy%3D%22148%22 r%3D%2272%22 fill%3D%22%2394a3b8%22%2F%3E%3Cpath d%3D%22M80 360c18-78 62-118 120-118s102 40 120 118%22 fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E';

var BLOCK_REGISTRY = {
    hero: { label: 'Hero', icon: 'H', defaultCols: 12, description: 'Name, title, CTA buttons' },
    bio: { label: 'About / Bio', icon: 'B', defaultCols: 8, description: 'Your story and photo' },
    skills: { label: 'Skills Grid', icon: 'S', defaultCols: 4, description: 'Skill bars with levels' },
    education: { label: 'Education', icon: 'E', defaultCols: 12, description: 'Degrees, courses, certifications' },
    projects: { label: 'Projects', icon: 'P', defaultCols: 12, description: 'Portfolio project cards' },
    socialLinks: { label: 'Social Links', icon: 'L', defaultCols: 6, description: 'All your social profiles' },
    contact: { label: 'Contact Form', icon: 'C', defaultCols: 12, description: 'Email form and direct links' },
    gallery: { label: 'Image Gallery', icon: 'G', defaultCols: 12, description: 'Photo grid' },
    testimonials: { label: 'Testimonials', icon: 'T', defaultCols: 12, description: 'Client or peer quotes' },
    githubFeed: { label: 'GitHub Feed', icon: 'GH', defaultCols: 6, description: 'Live recent commits' },
    spotify: { label: 'Spotify', icon: 'SP', defaultCols: 6, description: 'Now Playing widget' }
};

/* Returns profile image markup source with inline base64 support. */
function getProfileSrc(schema) {
    return schema.meta && schema.meta.photoBase64 ? schema.meta.photoBase64 : 'assets/img/profile.jpg';
}

/* Builds a fallback favicon SVG data URL from the first initial. */
function buildInitialFavicon(schema) {
    var theme = schema.theme || {};
    var name = (schema.meta && schema.meta.name) || 'P';
    var initial = esc(name.trim().charAt(0).toUpperCase() || 'P');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        + '<circle cx="32" cy="32" r="32" fill="' + (theme.primaryColor || '#0C9B70') + '"/>'
        + '<text x="32" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#fff">' + initial + '</text>'
        + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/* Resolves the favicon href for the generated site. */
function getFaviconHref(schema) {
    return schema.meta && schema.meta.faviconBase64 ? schema.meta.faviconBase64 : buildInitialFavicon(schema);
}

/* Returns the first projects block data from a schema. */
function getProjects(schema) {
    var page = (schema.pages || [])[0] || { blocks: [] };
    var block = (page.blocks || []).find(function(item) { return item.type === 'projects'; });
    if (block && block.data && block.data.projects && block.data.projects.length) return block.data.projects;
    return [
        { title: 'Featured Project', desc: 'Describe what you built, what changed, and why it matters.', category: 'Web', link: '', source: '', imageBase64: '' }
    ];
}

/* Renders a standard block title. */
function renderTitle(text) {
    return '<h2 class="block__title">' + esc(text) + '</h2>';
}

var blockRenderers = {
    hero: function(block, schema) {
        var m = schema.meta || {};
        var anim = schema.theme.animations.style;
        var socials = renderHeroSocials(schema);
        var photoSrc = getProfileSrc(schema);
        return '<section class="bento-block block--hero" data-reveal="' + attr(anim) + '">'
            + '<div class="hero__content">'
            + '<p class="hero__greeting">Hello, I am</p>'
            + '<h1 class="hero__name" data-schema-field="meta.name">' + esc(m.name || 'Your Name') + '</h1>'
            + '<h2 class="hero__title" data-schema-field="meta.title">' + esc(m.title || 'Professional Title') + '</h2>'
            + '<p class="hero__tagline" data-schema-field="meta.tagline">' + esc(m.tagline || 'A concise professional tagline goes here.') + '</p>'
            + '<div class="hero__actions">'
            + '<a href="contact.html" class="btn btn--primary">Get In Touch</a>'
            + '<a href="#projects" class="btn btn--outline">View Work</a>'
            + (m.resumeUrl ? '<a href="' + attr(m.resumeUrl) + '" target="_blank" class="btn btn--outline">Download Resume</a>' : '')
            + '</div>'
            + socials
            + '</div>'
            + '<div class="hero__img-wrap"><img src="' + attr(photoSrc) + '" alt="' + attr(m.name || 'Profile photo') + '" class="hero__img" onerror="this.src=\'' + AVATAR_SVG + '\'"></div>'
            + '</section>';
    },

    bio: function(block, schema) {
        var m = schema.meta || {};
        return '<section class="bento-block block--bio" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('About Me')
            + '<p class="bio__text" data-schema-field="meta.bio">' + esc(m.bio || 'Write a short bio about your background, interests, and work.') + '</p>'
            + (m.email ? '<a href="mailto:' + attr(m.email) + '" class="bio__email" data-schema-field="meta.email"><i class="bx bx-envelope"></i> ' + esc(m.email) + '</a>' : '')
            + '</section>';
    },

    skills: function(block, schema) {
        var skills = block.data && block.data.skills && block.data.skills.length ? block.data.skills : [];
        var bars = skills.map(function(skill) {
            var level = clampPct(skill.level);
            return '<div class="skill__item">'
                + '<div class="skill__header"><span class="skill__name">' + esc(skill.name) + '</span><span class="skill__pct">' + level + '%</span></div>'
                + '<div class="skill__bar"><div class="skill__fill" style="width:' + level + '%"></div></div>'
                + '</div>';
        }).join('');
        return '<section class="bento-block block--skills" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('Skills')
            + '<div class="skills__list">' + (bars || '<p class="muted">Add skills in the generator.</p>') + '</div>'
            + '</section>';
    },

    education: function(block, schema) {
        var education = schema.education && schema.education.length ? schema.education : [];
        var items = education.map(function(item, index) {
            var field = item.field ? ' - ' + esc(item.field) : '';
            var grade = item.grade ? '<span class="edu__grade">' + esc(item.grade) + '</span>' : '';
            var years = [item.startYear, item.endYear].filter(Boolean).join(' - ');
            return '<article class="edu__item">'
                + '<span class="edu__dot"></span>'
                + '<div class="edu__card">'
                + '<h3 data-schema-field="edu.institution.' + index + '">' + esc(item.institution || 'Institution') + '</h3>'
                + '<p class="edu__degree"><span data-schema-field="edu.degree.' + index + '">' + esc(item.degree || 'Degree or course') + '</span>' + field + '</p>'
                + '<div class="edu__meta"><span>' + esc(years || 'Year range') + '</span>' + grade + '</div>'
                + (item.description ? '<p class="edu__desc">' + esc(item.description) + '</p>' : '')
                + '</div>'
                + '</article>';
        }).join('');
        return '<section class="bento-block block--education" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('Education')
            + '<div class="edu__timeline">' + (items || '<p class="muted">No education entries added yet.</p>') + '</div>'
            + '</section>';
    },

    projects: function(block, schema) {
        var projects = block.data && block.data.projects && block.data.projects.length ? block.data.projects : getProjects(schema);
        var cards = projects.map(function(project, index) {
            var media = project.imageBase64
                ? '<img src="' + attr(project.imageBase64) + '" alt="' + attr(project.title || 'Project image') + '" class="project__img">'
                : '<div class="project__img-placeholder" style="background:linear-gradient(135deg, var(--primary), var(--accent));"></div>';
            return '<article class="project__card">'
                + media
                + '<span class="project__cat">' + esc(project.category || 'Project') + '</span>'
                + '<h3 class="project__title" data-schema-field="project.title.' + index + '">' + esc(project.title || 'Untitled Project') + '</h3>'
                + '<p class="project__desc" data-schema-field="project.desc.' + index + '">' + esc(project.desc || 'Describe this project.') + '</p>'
                + '<div class="project__links">'
                + (project.link ? '<a href="' + attr(project.link) + '" target="_blank" class="btn btn--primary btn--sm">Live Demo</a>' : '')
                + (project.source ? '<a href="' + attr(project.source) + '" target="_blank" class="btn btn--outline btn--sm">Source</a>' : '')
                + '</div>'
                + '</article>';
        }).join('');
        return '<section class="bento-block block--projects" data-reveal="' + attr(schema.theme.animations.style) + '" id="projects">'
            + renderTitle('Projects')
            + '<div class="projects__grid">' + cards + '</div>'
            + '</section>';
    },

    socialLinks: function(block, schema) {
        var s = schema.socials || {};
        var links = '';
        if (s.github) links += '<a href="' + attr(s.github) + '" target="_blank" class="social__link"><i class="bx bxl-github"></i><span>GitHub</span><i class="bx bx-chevron-right social__arrow"></i></a>';
        if (s.linkedin) links += '<a href="' + attr(s.linkedin) + '" target="_blank" class="social__link"><i class="bx bxl-linkedin"></i><span>LinkedIn</span><i class="bx bx-chevron-right social__arrow"></i></a>';
        if (s.twitter) links += '<a href="' + attr(s.twitter) + '" target="_blank" class="social__link"><i class="bx bxl-twitter"></i><span>X / Twitter</span><i class="bx bx-chevron-right social__arrow"></i></a>';
        if (s.instagram) links += '<a href="' + attr(s.instagram) + '" target="_blank" class="social__link"><i class="bx bxl-instagram"></i><span>Instagram</span><i class="bx bx-chevron-right social__arrow"></i></a>';
        if (s.website) links += '<a href="' + attr(s.website) + '" target="_blank" class="social__link"><i class="bx bx-globe"></i><span>Website</span><i class="bx bx-chevron-right social__arrow"></i></a>';
        return '<section class="bento-block block--socials" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('Connect')
            + '<div class="socials__list">' + (links || '<p class="muted">No social links added yet.</p>') + '</div>'
            + '</section>';
    },

    contact: function(block, schema) {
        var m = schema.meta || {};
        return '<section class="bento-block block--contact" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('Get In Touch')
            + '<form class="contact__form" onsubmit="handleContact(event)">'
            + '<input type="text" class="contact__input" placeholder="Your Name" required>'
            + '<input type="email" class="contact__input" placeholder="Your Email" required>'
            + '<textarea class="contact__input" placeholder="Your Message" rows="5" required></textarea>'
            + '<button type="submit" class="btn btn--primary">Send Message</button>'
            + '</form>'
            + '<p id="contactMsg" style="display:none;" class="contact__success">Thanks. Connect a form service to receive messages.</p>'
            + (m.email ? '<p class="contact__direct">Or email directly: <a href="mailto:' + attr(m.email) + '" data-schema-field="meta.email">' + esc(m.email) + '</a></p>' : '')
            + '</section>';
    },

    gallery: function(block, schema) {
        return '<section class="bento-block block--gallery" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('Gallery')
            + '<div class="gallery__placeholder"><i class="bx bx-image-add"></i><p>Add gallery images after export if needed.</p></div>'
            + '</section>';
    },

    testimonials: function(block, schema) {
        return '<section class="bento-block block--testimonials" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('Testimonials')
            + '<div class="testimonials__grid"><article class="testimonial__card"><p class="testimonial__quote">Add testimonials in the generator schema when you are ready.</p><div class="testimonial__author"><strong>Client Name</strong><span>Company</span></div></article></div>'
            + '</section>';
    },

    githubFeed: function(block, schema) {
        var username = schema.integrations.githubUsername || 'yourusername';
        return '<section class="bento-block block--github" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('Recent Commits')
            + '<div id="gh-feed" class="github__feed"><div class="github__loading"><i class="bx bx-loader-alt bx-spin"></i> Loading commits...</div></div>'
            + (schema.__previewMode ? '' : '<script>window.__GH_USER = "' + attr(username) + '";<\/script>')
            + '</section>';
    },

    spotify: function(block, schema) {
        return '<section class="bento-block block--spotify" data-reveal="' + attr(schema.theme.animations.style) + '">'
            + renderTitle('Now Playing')
            + '<div id="spotify-widget" class="spotify__widget"><p class="spotify__idle">Configure your Spotify token in assets/js/main.js.</p></div>'
            + '</section>';
    }
};

/* Renders social icon links for the hero block. */
function renderHeroSocials(schema) {
    var s = schema.socials || {};
    var links = '';
    if (s.github) links += '<a href="' + attr(s.github) + '" target="_blank" class="hero__social" aria-label="GitHub"><i class="bx bxl-github"></i></a>';
    if (s.linkedin) links += '<a href="' + attr(s.linkedin) + '" target="_blank" class="hero__social" aria-label="LinkedIn"><i class="bx bxl-linkedin"></i></a>';
    if (s.twitter) links += '<a href="' + attr(s.twitter) + '" target="_blank" class="hero__social" aria-label="X"><i class="bx bxl-twitter"></i></a>';
    if (s.instagram) links += '<a href="' + attr(s.instagram) + '" target="_blank" class="hero__social" aria-label="Instagram"><i class="bx bxl-instagram"></i></a>';
    return links ? '<div class="hero__socials">' + links + '</div>' : '';
}

/* Compiles a single block by type. */
function compileBlock(block, schema) {
    var renderer = blockRenderers[block.type];
    if (!renderer) return '<!-- Unknown block type: ' + esc(block.type) + ' -->';
    return renderer(block, schema);
}

/* Compiles a full page; preview mode skips external scripts and inlines CSS. */
function compilePage(page, schema, previewMode) {
    schema.__previewMode = !!previewMode;
    var sorted = (page.blocks || []).slice().sort(function(a, b) { return (a.order || 0) - (b.order || 0); });
    var cells = sorted.map(function(block) {
        return '<div class="bento-cell" style="grid-column:span ' + (block.cols || 12) + ';">' + compileBlock(block, schema) + '</div>';
    }).join('\n');
    var html = buildPageHead(schema, page.name, previewMode)
        + buildNav(schema, page.name)
        + '<main class="bento-grid">' + cells + '</main>'
        + buildFooter(schema)
        + (previewMode ? '' : buildScriptTags(schema, page.blocks))
        + '</body></html>';
    delete schema.__previewMode;
    return html;
}

/* Builds all head metadata, social preview tags, favicon, and CSS references. */
function buildPageHead(schema, pageName, previewMode) {
    var m = schema.meta || {};
    var label = pageName === 'contact' ? 'Contact' : 'Portfolio';
    var title = (m.name || 'Portfolio') + (m.title ? ' - ' + m.title : '');
    return '<!DOCTYPE html><html lang="en"><head>'
        + '<meta charset="UTF-8">'
        + '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        + '<meta name="description" content="' + attr(m.tagline || m.bio || title) + '">'
        + '<meta name="author" content="' + attr(m.name || '') + '">'
        + '<meta property="og:title" content="' + attr(title) + '">'
        + '<meta property="og:description" content="' + attr(m.tagline || '') + '">'
        + '<meta property="og:type" content="website">'
        + '<meta name="twitter:card" content="summary">'
        + '<meta name="twitter:title" content="' + attr(title) + '">'
        + '<title>' + esc(label) + ' - ' + esc(m.name || 'Portfolio') + '</title>'
        + '<link rel="icon" href="' + attr(getFaviconHref(schema)) + '">'
        + '<link href="https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css" rel="stylesheet">'
        + (previewMode ? '<style>' + buildCSS(schema) + '</style>' : '<link rel="stylesheet" href="assets/css/styles.css">')
        + '</head><body>';
}

/* Builds generated site navigation. */
function buildNav(schema, active) {
    var m = schema.meta || {};
    var themeBtn = schema.theme.darkMode ? '<button class="change-theme bx bx-moon" id="theme-button" type="button" aria-label="Toggle theme"></button>' : '';
    var resume = m.resumeUrl ? '<a href="' + attr(m.resumeUrl) + '" target="_blank" class="nav__link nav__resume">Resume</a>' : '';
    return '<header class="l-header"><nav class="nav">'
        + '<a href="index.html" class="nav__logo">' + esc(m.name || 'Portfolio') + '</a>'
        + '<div class="nav__menu" id="nav-menu"><ul class="nav__list">'
        + '<li><a href="index.html" class="nav__link' + (active === 'index' ? ' active-link' : '') + '">Home</a></li>'
        + '<li><a href="contact.html" class="nav__link' + (active === 'contact' ? ' active-link' : '') + '">Contact</a></li>'
        + '<li>' + resume + '</li>'
        + '</ul></div>'
        + '<div class="nav__btns">' + themeBtn + '<button class="nav__toggle" id="nav-toggle" type="button" aria-label="Open menu"><i class="bx bx-menu"></i></button></div>'
        + '</nav></header>';
}

/* Builds generated site footer with static year and social links. */
function buildFooter(schema) {
    var m = schema.meta || {};
    var s = schema.socials || {};
    var icons = '';
    if (s.github) icons += '<a href="' + attr(s.github) + '" target="_blank" class="footer__icon" aria-label="GitHub"><i class="bx bxl-github"></i></a>';
    if (s.linkedin) icons += '<a href="' + attr(s.linkedin) + '" target="_blank" class="footer__icon" aria-label="LinkedIn"><i class="bx bxl-linkedin"></i></a>';
    if (s.twitter) icons += '<a href="' + attr(s.twitter) + '" target="_blank" class="footer__icon" aria-label="X"><i class="bx bxl-twitter"></i></a>';
    if (s.instagram) icons += '<a href="' + attr(s.instagram) + '" target="_blank" class="footer__icon" aria-label="Instagram"><i class="bx bxl-instagram"></i></a>';
    return '<footer class="footer"><div class="footer__inner">'
        + '<span class="footer__copy">&copy; ' + currentYear() + ' ' + esc(m.name || 'Portfolio') + '</span>'
        + '<div class="footer__socials">' + icons + '</div>'
        + '<span class="footer__credits">Built with <a href="https://github.com/prvthmpcypher" target="_blank">ProfileGen</a></span>'
        + '</div></footer>';
}

/* Builds generated script tags and skips them when previewing. */
function buildScriptTags(schema, blocks) {
    var out = '';
    if (schema.theme.animations.enabled) out += '<script src="https://unpkg.com/scrollreveal"><\/script>';
    out += '<script src="assets/js/main.js"><\/script>';
    return out;
}

/* Builds the generated site's main JavaScript. */
function buildMainJS(schema, blocks) {
    var types = (blocks || []).map(function(block) { return block.type; });
    var out = '/* Auto-generated by ProfileGen. */\n';
    out += 'const navToggle=document.getElementById("nav-toggle"),navMenu=document.getElementById("nav-menu");if(navToggle&&navMenu){navToggle.addEventListener("click",()=>navMenu.classList.toggle("show"));}\n';
    out += 'function handleContact(e){e.preventDefault();const m=document.getElementById("contactMsg");if(m)m.style.display="block";}\n';
    if (schema.theme.darkMode) {
        out += 'const themeBtn=document.getElementById("theme-button");if(themeBtn){const apply=d=>{document.body.classList.toggle("dark-theme",d);themeBtn.className=d?"change-theme bx bx-sun":"change-theme bx bx-moon";localStorage.setItem("theme",d?"dark":"light");};themeBtn.addEventListener("click",()=>apply(!document.body.classList.contains("dark-theme")));apply(localStorage.getItem("theme")==="dark");}\n';
    }
    if (schema.theme.animations.enabled) {
        out += 'if(typeof ScrollReveal!=="undefined"){ScrollReveal({origin:"bottom",distance:"28px",duration:700,interval:90}).reveal("[data-reveal]");}\n';
    }
    if (schema.theme.hoverEffect === 'tilt') {
        out += 'document.querySelectorAll(".bento-block").forEach(card=>{card.addEventListener("mousemove",e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-3px)`;});card.addEventListener("mouseleave",()=>card.style.transform="");});\n';
    }
    if (types.indexOf('githubFeed') !== -1) {
        out += 'async function loadGithub(){const el=document.getElementById("gh-feed"),user=window.__GH_USER;if(!el||!user)return;try{const res=await fetch(`https://api.github.com/users/${user}/events/public?per_page=8`);const data=await res.json();el.innerHTML=data.slice(0,5).map(ev=>`<div class="gh-commit"><div class="gh-repo">${ev.repo.name}</div><div class="gh-msg">${(ev.payload.commits&&ev.payload.commits[0]&&ev.payload.commits[0].message)||ev.type}</div><div class="gh-date">${new Date(ev.created_at).toLocaleDateString()}</div></div>`).join("");}catch(e){el.innerHTML="<p class=\\"muted\\">Unable to load commits.</p>";}}loadGithub();\n';
    }
    if (schema.theme.pageTransitions) {
        out += 'document.body.classList.add("page-ready");document.addEventListener("click",e=>{const a=e.target.closest("a");if(!a||a.target||a.origin!==location.origin||!a.getAttribute("href").endsWith(".html"))return;e.preventDefault();document.body.classList.add("page-exit");setTimeout(()=>location.href=a.href,300);});\n';
    }
    return out;
}

/* Builds generated CSS using the chosen theme. */
function buildCSS(schema) {
    var t = schema.theme || {};
    var gap = t.spacing === 'compact' ? '.75rem' : t.spacing === 'relaxed' ? '2rem' : '1.25rem';
    var font = t.fontFamily || 'Inter';
    var clean = t.aesthetic !== 'brutalism' && t.aesthetic !== 'glassmorphism';
    var blockBase = clean
        ? '.bento-block{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 2px 14px rgba(15,23,42,.06);transition:transform .2s,box-shadow .2s}.bento-block:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(15,23,42,.1)}'
        : t.aesthetic === 'glassmorphism'
            ? '.bento-block{background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.45);border-radius:var(--radius);box-shadow:0 20px 60px rgba(15,23,42,.15);backdrop-filter:blur(18px)}body{background:linear-gradient(135deg,var(--primary),var(--secondary)) fixed}'
            : '.bento-block{background:#fff;border:3px solid #111;border-radius:0;box-shadow:6px 6px 0 #111}.btn{border-radius:0!important;border-width:2px!important;box-shadow:3px 3px 0 #111}';
    var transitionCSS = t.pageTransitions ? 'body{opacity:0;transition:opacity .3s ease}body.page-ready{opacity:1}body.page-exit{opacity:0}\n' : '';
    return '@import url("https://fonts.googleapis.com/css2?family=' + font.replace(/ /g, '+') + ':wght@400;500;600;700;800&display=swap");\n'
        + ':root{--primary:' + (t.primaryColor || '#0C9B70') + ';--secondary:' + (t.secondaryColor || '#042444') + ';--accent:' + (t.accentColor || '#1db88e') + ';--font:"' + font + '",system-ui,sans-serif;--radius:' + (t.borderRadius || '0.75rem') + ';--gap:' + gap + ';--background:#f8fafc;--surface:#fff;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--z-nav:100}\n'
        + '*,::before,::after{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:var(--font);background:var(--background);color:var(--text);line-height:1.6}h1,h2,h3,p{margin:0}a{text-decoration:none;color:inherit}img{max-width:100%;display:block}.muted{color:var(--muted);font-size:.9rem}' + transitionCSS
        + (t.darkMode ? 'body.dark-theme{--background:#0f172a;--surface:#1e293b;--text:#f8fafc;--muted:#94a3b8;--border:#334155}body.dark-theme .l-header{background:rgba(15,23,42,.92)}\n' : '')
        + '.l-header{position:fixed;top:.75rem;left:.75rem;right:.75rem;z-index:var(--z-nav);background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border:1px solid rgba(15,23,42,.08);border-radius:12px;box-shadow:0 8px 28px rgba(15,23,42,.08)}.nav{max-width:1100px;margin:0 auto;padding:.85rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}.nav__logo{font-weight:800;color:var(--primary)}.nav__list{display:flex;align-items:center;gap:1rem;list-style:none;margin:0;padding:0}.nav__link{font-weight:700;font-size:.9rem;color:var(--muted)}.nav__link:hover,.nav__link.active-link{color:var(--primary)}.nav__resume{border:1px solid var(--primary);padding:.42rem .7rem;border-radius:var(--radius);color:var(--primary)}.nav__btns{display:flex;align-items:center;gap:.65rem}.change-theme,.nav__toggle{border:0;background:transparent;color:var(--text);font-size:1.25rem;cursor:pointer}.nav__toggle{display:none}@media(max-width:768px){.nav__toggle{display:block}.nav__menu{display:none;position:fixed;top:4.5rem;left:.75rem;right:.75rem;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1rem}.nav__menu.show{display:block}.nav__list{display:grid;gap:.75rem}}\n'
        + 'main.bento-grid{max-width:1100px;margin:6rem auto 4rem;padding:0 1rem;display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gap)}.bento-cell{min-width:0}@media(max-width:768px){.bento-cell{grid-column:span 12!important}}\n'
        + blockBase + '.bento-block{padding:1.5rem;height:100%;display:flex;flex-direction:column}.block__title{font-size:1rem;font-weight:800;color:var(--primary);margin-bottom:1.15rem}.btn{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;padding:.65rem 1.1rem;border-radius:var(--radius);font-weight:800;font-size:.88rem;border:2px solid transparent;cursor:pointer}.btn--primary{background:var(--primary);border-color:var(--primary);color:#fff}.btn--outline{background:transparent;border-color:var(--primary);color:var(--primary)}.btn--sm{padding:.42rem .72rem;font-size:.8rem}\n'
        + '.block--hero{flex-direction:row;align-items:center;justify-content:space-between;gap:2rem}.hero__greeting{color:var(--primary);font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.14em;margin-bottom:.5rem}.hero__name{font-size:clamp(2rem,5vw,3.6rem);font-weight:800;color:var(--secondary);line-height:1.05}.hero__title{font-size:clamp(1rem,2vw,1.35rem);color:var(--primary);margin:.35rem 0 .7rem}.hero__tagline{color:var(--muted);max-width:520px;margin-bottom:1.25rem}.hero__actions,.hero__socials{display:flex;gap:.7rem;flex-wrap:wrap}.hero__social{width:36px;height:36px;border-radius:50%;background:var(--border);display:grid;place-items:center;color:var(--muted)}.hero__img{width:180px;height:180px;border-radius:var(--radius);object-fit:cover;border:3px solid var(--primary)}@media(max-width:640px){.block--hero{flex-direction:column;align-items:flex-start}.hero__img{width:120px;height:120px}}\n'
        + '.bio__text{color:var(--muted);line-height:1.8;margin-bottom:1rem}.bio__email,.contact__direct a{color:var(--primary);font-weight:800}.skills__list{display:grid;gap:.85rem}.skill__header{display:flex;justify-content:space-between;margin-bottom:.25rem}.skill__name{font-weight:700}.skill__pct{color:var(--primary);font-weight:800}.skill__bar{height:6px;background:var(--border);border-radius:999px;overflow:hidden}.skill__fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--accent))}\n'
        + '.edu__timeline{position:relative;display:grid;gap:1rem;padding-left:1.4rem}.edu__timeline::before{content:"";position:absolute;left:.3rem;top:.2rem;bottom:.2rem;width:2px;background:var(--primary)}.edu__item{position:relative}.edu__dot{position:absolute;left:-1.35rem;top:.85rem;width:12px;height:12px;border-radius:50%;background:var(--primary);box-shadow:0 0 0 4px color-mix(in srgb,var(--primary) 18%,transparent)}.edu__card{background:var(--background);border:1px solid var(--border);border-radius:var(--radius);padding:1rem}.edu__card h3{font-size:1rem}.edu__degree,.edu__desc{color:var(--muted);font-size:.9rem}.edu__meta{display:flex;flex-wrap:wrap;gap:.5rem;margin:.55rem 0;color:var(--primary);font-size:.8rem;font-weight:800}.edu__grade{background:rgba(12,155,112,.12);padding:.15rem .45rem;border-radius:999px}@media(max-width:600px){.edu__timeline{padding-left:0}.edu__timeline::before,.edu__dot{display:none}}\n'
        + '.projects__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}.project__card{background:var(--background);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;display:flex;flex-direction:column;gap:.5rem}.project__img,.project__img-placeholder{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:calc(var(--radius) - 3px);margin-bottom:.35rem}.project__cat{font-size:.7rem;color:var(--primary);font-weight:800;text-transform:uppercase;letter-spacing:.08em}.project__title{font-size:1.05rem}.project__desc{color:var(--muted);font-size:.9rem;flex:1}.project__links{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.35rem}\n'
        + '.socials__list{display:grid;gap:.65rem}.social__link{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:var(--background);border:1px solid var(--border);border-radius:var(--radius);font-weight:700}.social__link i{color:var(--primary);font-size:1.15rem}.social__arrow{margin-left:auto;color:var(--muted)}.contact__form{display:grid;gap:.75rem}.contact__input{width:100%;padding:.75rem .9rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--background);color:var(--text);font:inherit}.contact__input:focus{outline:3px solid rgba(12,155,112,.12);border-color:var(--primary)}.contact__success{margin-top:.75rem;color:#166534;background:#dcfce7;border:1px solid #86efac;padding:.75rem;border-radius:var(--radius)}.contact__direct{color:var(--muted);font-size:.9rem;margin-top:.8rem}.gallery__placeholder{display:grid;place-items:center;gap:.4rem;border:2px dashed var(--border);border-radius:var(--radius);padding:2rem;color:var(--muted)}.testimonials__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}.testimonial__card{background:var(--background);border:1px solid var(--border);border-radius:var(--radius);padding:1rem}.testimonial__quote{color:var(--muted)}.github__feed{display:grid;gap:.5rem}.gh-commit{border-left:3px solid var(--primary);padding:.6rem;background:var(--background);border-radius:0 var(--radius) var(--radius) 0}.gh-repo{font-size:.75rem;color:var(--primary);font-weight:800}.gh-msg{font-size:.85rem}.gh-date{font-size:.75rem;color:var(--muted)}.spotify__widget{color:var(--muted)}\n'
        + '.footer{background:linear-gradient(135deg,var(--secondary),#0b1324);color:#fff;padding:1.5rem;margin-top:1rem}.footer__inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}.footer__copy,.footer__credits{font-size:.82rem;color:rgba(255,255,255,.62)}.footer__credits a{color:var(--accent)}.footer__socials{display:flex;gap:.5rem}.footer__icon{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.1);display:grid;place-items:center;color:#fff}\n';
}

/* Builds a themed 404 page. */
function build404Page(schema) {
    var page = { name: '404', blocks: [{ id: 'missing', type: 'bio', cols: 12, order: 0, data: {} }] };
    var html = compilePage(page, schema, false);
    html = html.replace(/<main class="bento-grid">[\s\S]*?<\/main>/, '<main class="bento-grid"><div class="bento-cell" style="grid-column:span 12;"><section class="bento-block"><h1>404 - Page not found</h1><p class="muted" style="margin:1rem 0;">The page you are looking for is not available.</p><a href="index.html" class="btn btn--primary">Back to home</a></section></div></main>');
    return html;
}

/* Builds a sitemap XML file when a site URL is supplied. */
function buildSitemap(schema) {
    if (!schema.siteURL) return '';
    var base = schema.siteURL.replace(/\/+$/, '');
    var today = new Date().toISOString().slice(0, 10);
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + '<url><loc>' + esc(base) + '/index.html</loc><lastmod>' + today + '</lastmod></url>\n'
        + '<url><loc>' + esc(base) + '/contact.html</loc><lastmod>' + today + '</lastmod></url>\n'
        + '</urlset>';
}

/* Builds robots.txt when a site URL is supplied. */
function buildRobots(schema) {
    if (!schema.siteURL) return '';
    var base = schema.siteURL.replace(/\/+$/, '');
    return 'User-agent: *\nAllow: /\nSitemap: ' + base + '/sitemap.xml\n';
}

/* Builds an updated README that does not require manual file editing. */
function buildReadme(schema) {
    return '# ' + (schema.meta.name || 'Portfolio') + '\n\n'
        + 'This portfolio was generated by ProfileGen and is self-contained. Open `index.html` directly or deploy the folder.\n\n'
        + 'The included `config.json` is a reference copy of the choices used to generate the HTML.\n';
}

/* Builds the downloadable ZIP package. */
function buildZIP(schema) {
    var zip = new JSZip();
    var allBlocks = [];
    zip.folder('assets/css');
    zip.folder('assets/js');
    (schema.pages || []).forEach(function(page) {
        (page.blocks || []).forEach(function(block) { allBlocks.push(block); });
        zip.file(page.name + '.html', compilePage(page, schema, false));
    });
    var hasContactPage = (schema.pages || []).some(function(page) { return page.name === 'contact'; });
    if (!hasContactPage) {
        zip.file('contact.html', compilePage({ name: 'contact', blocks: [{ id: 'contact-auto', type: 'contact', cols: 12, order: 0, data: {} }] }, schema, false));
    }
    zip.file('404.html', build404Page(schema));
    if (schema.siteURL) {
        zip.file('sitemap.xml', buildSitemap(schema));
        zip.file('robots.txt', buildRobots(schema));
    }
    zip.file('assets/css/styles.css', buildCSS(schema));
    zip.file('assets/js/main.js', buildMainJS(schema, allBlocks));
    zip.file('config.json', JSON.stringify(schema, null, 2));
    zip.file('README.md', buildReadme(schema));
    if (!(schema.meta && schema.meta.photoBase64)) {
        zip.folder('assets/img');
        zip.file('assets/img/profile.jpg', 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', { base64: true });
    }
    return zip;
}
