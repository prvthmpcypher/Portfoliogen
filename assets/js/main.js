
/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    if (navMenu) navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

const navToggle = document.getElementById('nav-toggle')
const navMenu = document.getElementById('nav-menu')

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show')
        navToggle.setAttribute('aria-expanded', navMenu.classList.contains('show') ? 'true' : 'false')
    })
}

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(!sectionsClass) return

        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2000,
        delay: 200,
    });

    sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
    sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
    sr.reveal('.home__social-icon',{ interval: 200}); 
    sr.reveal('.skills__data, .work__card, .contact__input',{interval: 200});
}

/*===== SKILL BARS ANIMATION ON SCROLL =====*/
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
}
/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'

function applyTheme(theme) {
    const isDark = theme === 'dark'
    document.body.classList.toggle(darkTheme, isDark)

    if (!themeButton) return

    themeButton.classList.remove('bx-moon', 'bx-sun')
    themeButton.classList.add(isDark ? 'bx-sun' : 'bx-moon')
    themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode')
    themeButton.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode')
    themeButton.setAttribute('aria-pressed', String(isDark))
}

const savedTheme = localStorage.getItem('selected-theme')
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'))

if (themeButton) {
    themeButton.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains(darkTheme) ? 'light' : 'dark'
        applyTheme(nextTheme)
        localStorage.setItem('selected-theme', nextTheme)
    })
}
/*==================== WORK FILTER ENGINE ====================*/
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.work__card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active-filter class from all buttons and add to clicked button
        filterButtons.forEach(btn => btn.classList.remove('active-filter'));
        button.classList.add('active-filter');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            // If "All" clicked, show everything. Otherwise check matching dataset category
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hide-card');
            } else {
                card.classList.add('hide-card');
            }
        });
    });
});
/*==================== ARCHITECTURE DRAWER ENGINE ====================*/
const drawerTriggers = document.querySelectorAll('.drawer-trigger-btn');

drawerTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const targetId = trigger.getAttribute('data-target');
        const targetDrawer = document.getElementById(targetId);
        
        if(targetDrawer) {
            targetDrawer.classList.toggle('drawer-open');
            trigger.classList.toggle('active-btn');
        }
    });
});
/*==================== CONTACT VALIDATION & TOAST CONTROLLER ====================*/
const contactForms = document.querySelectorAll('.contact__form');
let toastContainer = document.getElementById('toast-notification-box');

// If the toast container doesn't exist on the page, create it
if (!toastContainer) {
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-notification-box';
  toastContainer.className = 'toast__container';
  document.body.appendChild(toastContainer);
}

contactForms.forEach((contactForm) => {
    contactForm.addEventListener('submit', (e) => {
        // Stop default reload
        e.preventDefault();
        
        // Grab values
        const userName = contactForm.querySelector('input[type="text"]').value.trim();
        const userEmail = contactForm.querySelector('input[type="email"]').value.trim();
        
        // Clear old toast nodes
        toastContainer.innerHTML = '';

        // Validation Rules
        if(userName.length < 2) {
            showToast('Please enter a valid name', 'error');
            return;
        }

        if(!userEmail.includes('@') || userEmail.length < 5) {
            showToast('Please provide a valid email address.', 'error');
            return;
        }

        // Success execution path simulation
        if (contactForm.classList.contains('review-form')) {
            showToast('Thanks for your review.', 'success');
            contactForm.reset();
            return;
        }

        showToast(contactForm.getAttribute('aria-label') === 'Newsletter form' ? 'Thanks for subscribing.' : 'Proposal has been sent.', 'success');
        contactForm.reset(); // Wipes clean the visual form input data blocks
    });
});

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.classList.add('toast__card');
    if(type === 'error') toast.classList.add('toast--error');
    
    // Pick visual display vector icons
    const icon = type === 'error' ? "bx-error-circle" : "bx-check-circle";
    
    toast.innerHTML = `<i class='bx ${icon}' style='color: ${type === 'error' ? '#f44336' : '#ff8c42'}; font-size: 1.2rem;'></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    // Clean memory reference from HTML layer after slide out animation ends
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

/* ==================== ACCESSIBILITY: SKIP LINK + KEYBOARD FOCUS HANDLING ==================== */
document.addEventListener('DOMContentLoaded', () => {
    // Inject a skip link if one doesn't already exist
    if (!document.querySelector('.skip-link')) {
        const target = document.querySelector('main, [role="main"], #main, .home__data') || document.body;
        if (!target.id) target.id = 'main-content';
        const skip = document.createElement('a');
        skip.className = 'skip-link';
        skip.href = '#' + target.id;
        skip.textContent = 'Skip to content';
        document.body.insertBefore(skip, document.body.firstChild);
    }

    // Add a body class on first Tab press to enable focus outlines in older browsers
    function handleFirstTab(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
            window.removeEventListener('keydown', handleFirstTab);
        }
    }

    window.addEventListener('keydown', handleFirstTab);
});
