/* ========================================
   鼠标跟随光晕
======================================== */
const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (cursorGlow) {
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
    }
    requestAnimationFrame(updateGlow);
}
updateGlow();

/* ========================================
   导航栏滚动效果
======================================== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ========================================
   滚动触发动画
======================================== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.about-card, .skill-category, .work-card, .contact-card, .contact-cta').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
});

/* ========================================
   作品筛选
======================================== */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.work-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ========================================
   平滑滚动
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

/* ========================================
   卡片悬浮微动效 - 鼠标靠近时轻微倾斜
======================================== */
document.querySelectorAll('.about-card, .work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -2;
        const rotateY = (x - centerX) / centerX * 2;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
    });
});

/* ========================================
   作品图片画廊
======================================== */
const lightbox = document.getElementById('lightbox');
const lightboxStage = lightbox.querySelector('.lightbox-stage');
const lightboxImg = lightboxStage.querySelector('img');
const lightboxTitle = lightbox.querySelector('.lightbox-title');
const lightboxCounter = lightbox.querySelector('.lightbox-counter');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');
const lightboxClose = lightbox.querySelector('.lightbox-close');

let galleryImages = [];
let galleryIndex = 0;

function renderGalleryImage() {
    lightboxImg.src = galleryImages[galleryIndex];
    lightboxImg.alt = lightboxTitle.textContent;
    lightboxStage.scrollTop = 0;
    lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
    const multi = galleryImages.length > 1;
    lightboxPrev.hidden = !multi;
    lightboxNext.hidden = !multi;
}

function openLightbox(card) {
    const images = (card.dataset.images || '').split('|').filter(Boolean);
    if (!images.length) return;
    galleryImages = images;
    galleryIndex = 0;
    lightboxTitle.textContent = card.dataset.title || '';
    renderGalleryImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
}

function showGalleryImage(step) {
    if (galleryImages.length < 2) return;
    galleryIndex = (galleryIndex + step + galleryImages.length) % galleryImages.length;
    renderGalleryImage();
}

document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showGalleryImage(-1));
lightboxNext.addEventListener('click', () => showGalleryImage(1));

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxStage) {
        closeLightbox();
    }
});

lightboxStage.addEventListener('click', (e) => {
    if (e.target === lightboxImg) {
        showGalleryImage(1);
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showGalleryImage(-1);
    if (e.key === 'ArrowRight') showGalleryImage(1);
});