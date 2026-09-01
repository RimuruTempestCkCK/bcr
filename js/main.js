(function(){
  // ---------- Nav scroll shadow ----------
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  });

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const bar1 = document.getElementById('bar1'), bar2 = document.getElementById('bar2'), bar3 = document.getElementById('bar3');
  let menuOpen = false;
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    menuBtn.setAttribute('aria-expanded', menuOpen);
    bar1.style.transform = menuOpen ? 'translateY(6.5px) rotate(45deg)' : '';
    bar3.style.transform = menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : '';
    bar2.style.opacity = menuOpen ? '0' : '1';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    bar1.style.transform = ''; bar3.style.transform = ''; bar2.style.opacity = '1';
  }));

  // ---------- Hero load-in sequence ----------
  window.addEventListener('load', () => {
    document.getElementById('hero-img').classList.add('is-loaded');
    ['nav-logo','nav-cta','hero-badge','hero-title','hero-spec','hero-desc','hero-cta'].forEach(id=>{
      const el = document.getElementById(id);
      requestAnimationFrame(()=>{ el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    });
    setTimeout(()=>{
      const wa = document.getElementById('wa-float');
      wa.style.opacity = '1';
    }, 1300);
  });

  // ---------- Scroll reveal ----------
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-img').forEach(el => observer.observe(el));

  // ---------- Countdown ----------
  const deadline = new Date('2026-08-31T23:59:59+07:00').getTime();
  function tick(){
    const now = Date.now();
    let diff = Math.max(0, deadline - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2,'0');
    const map = {days, hours, minutes, seconds};
    document.querySelectorAll('[data-cd]').forEach(el=>{
      el.textContent = pad(map[el.dataset.cd]);
    });
  }
  tick();
  setInterval(tick, 1000);

  // ---------- KPR simulator ----------
  const hargaInput = document.getElementById('harga-input');
  const dpInput = document.getElementById('dp-input');
  const tenorInput = document.getElementById('tenor-input');
  const hargaVal = document.getElementById('harga-val');
  const dpVal = document.getElementById('dp-val');
  const tenorVal = document.getElementById('tenor-val');
  const cicilanVal = document.getElementById('cicilan-val');

  function formatJt(n){
    const jt = n/1000000;
    return 'Rp' + jt.toLocaleString('id-ID', {maximumFractionDigits:1}) + ' Jt';
  }

  function calcKPR(){
    const harga = parseInt(hargaInput.value,10);
    const dpPct = parseInt(dpInput.value,10);
    const tenor = parseInt(tenorInput.value,10);
    const rate = 0.065; // estimasi bunga tahunan efektif
    const pokok = harga * (1 - dpPct/100);
    const monthlyRate = rate/12;
    const n = tenor*12;
    const cicilan = pokok * (monthlyRate * Math.pow(1+monthlyRate, n)) / (Math.pow(1+monthlyRate, n) - 1);

    hargaVal.textContent = formatJt(harga);
    dpVal.textContent = dpPct + '%';
    tenorVal.textContent = tenor + ' Tahun';
    cicilanVal.textContent = formatJt(cicilan);
  }
  [hargaInput, dpInput, tenorInput].forEach(el => el.addEventListener('input', calcKPR));
  calcKPR();

  // ---------- Lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gallery-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      lightboxImg.src = item.dataset.full;
      lightboxImg.alt = item.querySelector('img').alt;
      lightbox.classList.remove('pointer-events-none');
      lightbox.style.opacity = '1';
      document.body.style.overflow = 'hidden';
    });
  });
  function closeLightbox(){
    lightbox.style.opacity = '0';
    lightbox.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

  // ---------- Stagger indices for grouped reveals ----------
  document.querySelectorAll('.stagger').forEach(group=>{
    Array.from(group.children).forEach((child,i)=> child.style.setProperty('--i', i));
  });
})();