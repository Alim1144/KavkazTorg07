// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const SECTION_LABELS = {
    pallet: 'Поддоны',
    'drink-15': 'Напитки 1,5 л',
    'drink-glass': 'Напитки в стекле',
    'drink-water': 'Минеральная вода',
    'drink-other': 'Напитки'
};

let currentFilter = 'all';

function inferSection(product, categoryKey) {
    if (categoryKey === 'pallets') return 'pallet';
    if (product.section && SECTION_LABELS[product.section]) return product.section;

    const txt = `${product.name || ''} ${product.description || ''}`.toLowerCase();
    const size = String(product.size || '').toLowerCase();
    if (txt.includes('минераль')) return 'drink-water';
    if (txt.includes('стекло') || size.includes('стекл')) return 'drink-glass';
    if (size.includes('1,5') || size.includes('1.5')) return 'drink-15';
    return 'drink-other';
}

function shouldShowProduct(section) {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'pallet') return section === 'pallet';
    return section === currentFilter;
}

// Загрузка и отображение товаров
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const products = productManager.getProducts();
    if (!products) return;

    productsGrid.innerHTML = '';
    const all = [];

    if (products.pallets && products.pallets.length > 0) {
        products.pallets.forEach(product => {
            all.push({ product, category: 'pallets' });
        });
    }

    if (products.drinks && products.drinks.length > 0) {
        products.drinks.forEach(product => {
            all.push({ product, category: 'drinks' });
        });
    }

    all
        .filter(({ product, category }) => shouldShowProduct(inferSection(product, category)))
        .sort((a, b) => (a.product.name || '').localeCompare((b.product.name || ''), 'ru'))
        .forEach(({ product, category }) => {
            const productCard = createProductCard(product, category);
            productsGrid.appendChild(productCard);
        });

    if (!productsGrid.children.length) {
        productsGrid.innerHTML = '<div class="product-item product-category-2"><h3 class="product-title">Нет товаров</h3><p class="product-description">В выбранном разделе пока нет позиций.</p></div>';
    }

    // Анимация появления
    const productCards = productsGrid.querySelectorAll('.product-item');
    productCards.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
}

function createProductCard(product, category) {
    const card = document.createElement('div');
    card.className = `product-item ${category === 'pallets' ? 'product-category-1' : 'product-category-2'}`;
    const section = inferSection(product, category);
    
    let imageHtml = '';
    let iconHtml = '';
    if (product.image && product.image.trim()) {
        imageHtml = `<img src="${product.image}" alt="${product.name}" class="product-image" 
            onerror="this.onerror=null; this.style.display='none'; const icon = this.parentElement.querySelector('.product-icon-fallback'); if(icon) icon.style.display='block';"
            loading="lazy">`;
        // Резервная иконка, которая показывается при ошибке загрузки изображения
        iconHtml = `<div class="product-icon product-icon-fallback" style="display:none;">${product.icon || '📦'}</div>`;
    } else {
        iconHtml = `<div class="product-icon">${product.icon || '📦'}</div>`;
    }

    const sizeHtml = product.size ? `
        <div class="product-spec">
            <span class="spec-label">${category === 'pallets' ? 'Размер:' : 'Объем:'}</span>
            <span class="spec-value">${product.size}</span>
        </div>
    ` : '';

    card.innerHTML = `
        ${imageHtml}
        ${iconHtml}
        <div class="product-subcategory">${SECTION_LABELS[section] || SECTION_LABELS['drink-other']}</div>
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        <h3 class="product-title">${product.name}</h3>
        ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
        ${sizeHtml ? `<div class="product-specs">${sizeHtml}</div>` : ''}
        <div class="product-price">
            <span class="price-value">${product.price} ₽</span>
            ${product.priceNote ? `<span class="price-note">${product.priceNote}</span>` : ''}
        </div>
        <div class="product-decoration"></div>
    `;

    return card;
}

// Слушаем обновления товаров
window.addEventListener('productsUpdated', () => {
    loadProducts();
});

// Также слушаем события storage для синхронизации между вкладками
window.addEventListener('storage', (e) => {
    if (e.key === 'kavkaztorg_products') {
        loadProducts();
    }
});

// Observe all cards and sections with staggered animation
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.products-filter-btn');
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter || 'all';
            loadProducts();
        });
    });

    // Загружаем товары
    loadProducts();

    const animatedElements = document.querySelectorAll('.feature-card, .contact-card, .product-category, .product-item, .stat-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Animate stats numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = !isNaN(parseInt(finalValue));
        
        if (isNumber) {
            const target = parseInt(finalValue);
            let current = 0;
            const increment = target / 30;
            const duration = 2000;
            const stepTime = duration / 30;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                stat.textContent = finalValue;
                                clearInterval(timer);
                            } else {
                                stat.textContent = Math.floor(current) + (finalValue.includes('+') ? '+' : '');
                            }
                        }, stepTime);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        }
    });
});

// Header scroll effect with backdrop blur
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.backdropFilter = 'blur(10px)';
    }
    
    lastScroll = currentScroll;
});

// Parallax effect for hero decorations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const decorations = document.querySelectorAll('.hero-decoration');
    
    decorations.forEach((dec, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        if (scrolled < window.innerHeight) {
            dec.style.transform = `translateY(${yPos}px)`;
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
