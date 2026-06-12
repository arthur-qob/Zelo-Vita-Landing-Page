// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
});

mobileClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// Form submission
async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.form-btn');
    const originalText = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
        country: form.country.value,
        medication: form.medication.value,
        message: form.message.value,
    };

    try {
        const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            btn.textContent = '✓ Request Sent! We\'ll be in touch soon.';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            form.reset();
        } else {
            throw new Error('Server error');
        }
    } catch {
        btn.textContent = 'Something went wrong. Please try again.';
        btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }
}

// Testimonial carousel (activates when there are more than 3 cards)
function initTestimonialCarousel() {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.testi-card'));
    if (cards.length <= 3) return;

    const track = document.createElement('div');
    track.className = 'carousel-track';
    grid.parentNode.insertBefore(track, grid);
    track.appendChild(grid);

    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    track.parentNode.insertBefore(nav, track.nextSibling);

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn carousel-prev';
    prevBtn.setAttribute('aria-label', 'Anterior');
    prevBtn.innerHTML = '&#8249;';

    const dotsEl = document.createElement('div');
    dotsEl.className = 'carousel-dots';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn carousel-next';
    nextBtn.setAttribute('aria-label', 'Próximo');
    nextBtn.innerHTML = '&#8250;';

    nav.appendChild(prevBtn);
    nav.appendChild(dotsEl);
    nav.appendChild(nextBtn);

    grid.classList.add('is-carousel');

    let currentIndex = 0;

    function getVisible() {
        if (window.innerWidth < 600) return 1;
        if (window.innerWidth < 960) return 2;
        return 3;
    }

    function maxIndex() {
        return Math.max(0, cards.length - getVisible());
    }

    function getStepPx() {
        const visible = getVisible();
        const gap = 22;
        const cardWidth = (track.offsetWidth - (visible - 1) * gap) / visible;
        return cardWidth + gap;
    }

    function updateCardWidth() {
        const visible = getVisible();
        const gap = 22;
        const cardWidth = (track.offsetWidth - (visible - 1) * gap) / visible;
        grid.style.setProperty('--carousel-card-width', cardWidth + 'px');
    }

    function buildDots() {
        dotsEl.innerHTML = '';
        for (let i = 0; i <= maxIndex(); i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Ir para ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(dot);
        }
    }

    function updateDots() {
        dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex()));
        grid.style.transform = `translateX(-${currentIndex * getStepPx()}px)`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex();
        updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(currentIndex + (diff > 0 ? 1 : -1));
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCardWidth();
            buildDots();
            goTo(Math.min(currentIndex, maxIndex()));
        }, 100);
    });

    updateCardWidth();
    buildDots();
    goTo(0);
}

initTestimonialCarousel();

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
