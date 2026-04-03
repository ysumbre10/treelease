/* ============================================
   TREE LEASE,Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('treelease-theme') || 'dark';

    // Apply saved theme immediately (before paint)
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('treelease-theme', newTheme);
    });

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3s max
    setTimeout(() => preloader.classList.add('hidden'), 3000);

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    });

    // --- Active Nav Link on Scroll ---
    const navSectionLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = [];

    navSectionLinks.forEach(link => {
        const sectionId = link.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) sections.push({ id: sectionId, el: section, link: link });
    });

    function updateActiveNav() {
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;

        let currentSection = null;
        for (let i = sections.length - 1; i >= 0; i--) {
            if (scrollPos >= sections[i].el.offsetTop) {
                currentSection = sections[i].id;
                break;
            }
        }

        navSectionLinks.forEach(link => {
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // --- Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // --- Animated Counters ---
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Hero stat counters
    const heroStatNumbers = document.querySelectorAll('.hero-stat-number');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target, 2000);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    heroStatNumbers.forEach(el => heroObserver.observe(el));

    // Impact section counters
    const impactNumbers = document.querySelectorAll('.impact-number');
    const impactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target, 2500);
                impactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    impactNumbers.forEach(el => impactObserver.observe(el));

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked (if wasn't active)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Marketplace Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const treeCards = document.querySelectorAll('.tree-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            treeCards.forEach(card => {
                if (filter === 'all' || card.dataset.type === filter) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Yield Calculator ---
    const calcTrees = document.getElementById('calcTrees');
    const calcTreesValue = document.getElementById('calcTreesValue');
    const calcTypeBtns = document.querySelectorAll('.calc-type-btn');
    const calcDurBtns = document.querySelectorAll('.calc-dur-btn');

    let calcState = {
        trees: 5,
        price: 4999,
        yieldKg: 40,
        ratePerKg: 800,
        years: 1,
        type: 'mango'
    };

    function updateCalculator() {
        const totalInvestment = calcState.trees * calcState.price * calcState.years;
        const totalYield = calcState.trees * calcState.yieldKg * calcState.years;
        const homeShare = Math.round(totalYield * 0.25); // 25% to consumer
        const commercialYield = totalYield - homeShare;
        const commercialRevenue = commercialYield * calcState.ratePerKg;
        const yieldShare = Math.round(commercialRevenue * 0.40); // 40% to lessee
        // Annualized net return: annual yield share as % of annual investment
        const annualInvestment = calcState.trees * calcState.price;
        const annualYieldShare = yieldShare / calcState.years;
        const netReturn = ((annualYieldShare / annualInvestment) * 100).toFixed(1);

        document.getElementById('calcInvestment').textContent = `₹${totalInvestment.toLocaleString()}`;
        document.getElementById('calcProduce').textContent = `~${homeShare} kg`;
        document.getElementById('calcRevenue').textContent = `₹${commercialRevenue.toLocaleString()}`;
        document.getElementById('calcYieldShare').textContent = `₹${yieldShare.toLocaleString()}`;
        document.getElementById('calcNetReturn').textContent = `~${netReturn}%`;
    }

    calcTrees.addEventListener('input', (e) => {
        calcState.trees = parseInt(e.target.value);
        calcTreesValue.textContent = `${calcState.trees} Tree${calcState.trees > 1 ? 's' : ''}`;
        updateCalculator();
    });

    calcTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            calcTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            calcState.price = parseInt(btn.dataset.price);
            calcState.yieldKg = parseInt(btn.dataset.yield);
            calcState.ratePerKg = parseInt(btn.dataset.rate);
            calcState.type = btn.dataset.type;
            updateCalculator();
        });
    });

    calcDurBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            calcDurBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            calcState.years = parseInt(btn.dataset.years);
            updateCalculator();
        });
    });

    // Initialize calculator
    updateCalculator();

    // --- Social Proof Toast ---
    const toast = document.getElementById('socialProofToast');
    const toastName = document.getElementById('toastName');
    const toastDetail = document.getElementById('toastDetail');

    const proofData = [
        { name: 'Rahul M.', detail: 'Alphonso Mango, Ratnagiri', emoji: '🥭' },
        { name: 'Priya S.', detail: 'Tender Coconut, Mangalore', emoji: '🌴' },
        { name: 'Amit K.', detail: '3 Cashew Trees, Goa', emoji: '🌰' },
        { name: 'Sneha R.', detail: 'Sapota (Chikoo), Navsari', emoji: '🫐' },
        { name: 'Vikram J.', detail: '5 Mango Trees, Ratnagiri', emoji: '🥭' },
        { name: 'Meera D.', detail: 'Coconut Tree, Karnataka', emoji: '🌴' },
        { name: 'Arjun P.', detail: '2 Alphonso Trees, Devgad', emoji: '🥭' },
    ];

    let proofIndex = 0;

    function showToast() {
        const data = proofData[proofIndex];
        toastName.textContent = data.name;
        toastDetail.textContent = data.detail;
        toast.querySelector('.toast-emoji').textContent = data.emoji;

        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 4000);

        proofIndex = (proofIndex + 1) % proofData.length;
    }

    // Show first toast after 8 seconds, then every 15 seconds
    setTimeout(() => {
        showToast();
        setInterval(showToast, 15000);
    }, 8000);

    // --- Tree Card Transition Styles ---
    treeCards.forEach(card => {
        card.style.transition = 'all 0.4s ease';
    });

    // --- Parallax effect for hero orbs ---
    window.addEventListener('mousemove', (e) => {
        const orb1 = document.querySelector('.orb-1');
        const orb2 = document.querySelector('.orb-2');
        if (!orb1 || !orb2) return;

        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;

        orb1.style.transform = `translate(${x}px, ${y}px)`;
        orb2.style.transform = `translate(${-x}px, ${-y}px)`;
    });

});
