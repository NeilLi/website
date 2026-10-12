/* Static-site interactions. This site never issues robot authority or submits contact data. */
document.documentElement.classList.add('js');
initNavigation();
initGallery();
initContact();
initArmPreview();

function initNavigation() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.getElementById('site-menu');
  if (!toggle || !nav) return;
  toggle.hidden = false;
  const mobile = window.matchMedia('(max-width: 800px)');
  function close(restoreFocus = false) {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) close(true);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) close();
  });
  mobile.addEventListener('change', () => close());
}

function initGallery() {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const status = document.getElementById('filter-status');
  if (!buttons.length) return;
  function filter(category) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    let count = 0;
    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count++;
    });
    if (status) status.textContent = `${count} reference${count === 1 ? '' : 's'}`;
  }
  buttons.forEach(button => button.addEventListener('click', () => filter(button.dataset.filter)));
  function revealFragment() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const card = cards.find(item => item.id === id);
    if (card && card.hidden) {
      filter('all');
      card.scrollIntoView({block: 'start'});
    }
  }
  window.addEventListener('hashchange', revealFragment);
  revealFragment();
}

function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const interest = form.elements.interest;
  const requested = new URLSearchParams(location.search).get('interest');
  if ([...interest.options].some(option => option.value === requested)) interest.value = requested;
  const draft = document.getElementById('email-draft');
  const draftText = document.getElementById('draft-text');
  const link = document.getElementById('draft-link');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    if (!name || !message) { status.textContent = 'Please add your name and a short message.'; draft.hidden = false; return; }
    const topic = interest.selectedOptions[0].textContent;
    const body = `Hello SeedCore,\n\n${message}\n\nTopic: ${topic}\nFrom: ${name}\nReply to: ${email}`;
    draftText.value = body;
    link.href = `mailto:hello@seedcore.ai?subject=${encodeURIComponent('SeedCore — ' + topic)}&body=${encodeURIComponent(body)}`;
    draft.hidden = false;
    status.textContent = 'Your draft is ready. Review it in your email app, then send it when you’re ready.';
    link.click();
  });
  // Native submission stays disabled until the local draft handler is installed.
  form.querySelector('[type=submit]').disabled = false;
  document.getElementById('copy-draft').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draftText.value);
      status.textContent = 'Message copied. Paste it into an email to hello@seedcore.ai.';
    } catch {
      draftText.focus();
      draftText.select();
      status.textContent = 'Select and copy the prepared message, then email it to hello@seedcore.ai.';
    }
  });
}

function initArmPreview() {
  const canvas = document.getElementById('simArmCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const button = document.getElementById('previewPause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let frame = 0;
  let time = 0;
  let previous = null;
  let width = 0;
  let height = 0;
  function updateButton() {
    button.textContent = paused ? 'Play preview' : 'Pause preview';
    button.setAttribute('aria-pressed', String(paused));
  }
  function draw() {
    const scale = Math.min(width / 480, height / 300);
    const base = {x: width * .46, y: height * .78};
    const a = -.95 + Math.sin(time * .65) * .32;
    const b = -.85 + Math.cos(time * .8) * .45;
    const elbow = {x:base.x + Math.cos(a)*105*scale,y:base.y + Math.sin(a)*105*scale};
    const tip = {x:elbow.x + Math.cos(a+b)*90*scale,y:elbow.y + Math.sin(a+b)*90*scale};
    ctx.clearRect(0,0,width,height);
    ctx.setLineDash([3,7]);ctx.strokeStyle='#afc299';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(base.x,base.y,195*scale,Math.PI,0);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#b5c5a1';ctx.beginPath();ctx.ellipse(base.x,base.y+10,50*scale,10*scale,0,0,Math.PI*2);ctx.fill();
    ctx.lineCap='round';
    for(const [p,q] of [[base,elbow],[elbow,tip]]) {
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineWidth=24*scale;ctx.strokeStyle='#315c41';ctx.stroke();
      ctx.lineWidth=15*scale;ctx.strokeStyle='#b8d28f';ctx.stroke();
    }
    for(const p of [base,elbow]) {
      ctx.beginPath();ctx.arc(p.x,p.y,16*scale,0,Math.PI*2);ctx.fillStyle='#e7dfbd';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#315c41';ctx.stroke();
      ctx.beginPath();ctx.arc(p.x,p.y,5*scale,0,Math.PI*2);ctx.fillStyle='#315c41';ctx.fill();
    }
    ctx.beginPath();ctx.arc(tip.x,tip.y,7*scale,0,Math.PI*2);ctx.fillStyle='#d38d53';ctx.fill();
    ctx.font='10px monospace';ctx.fillStyle='#617559';ctx.fillText('J01',base.x-39*scale,base.y-12*scale);ctx.fillText('J02',elbow.x+21*scale,elbow.y);
    ctx.fillText('XY / LOCAL PREVIEW',18,height-18);
  }
  function loop(timestamp) {
    frame=0;
    if (paused || document.hidden) { previous=null; return; }
    if (previous !== null) time += Math.min((timestamp-previous)/1000,.05);
    previous=timestamp;draw();frame=requestAnimationFrame(loop);
  }
  function schedule() {
    cancelAnimationFrame(frame);frame=0;previous=null;
    if (!paused && !document.hidden) frame=requestAnimationFrame(loop);
  }
  function resize() {
    const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;
    const ratio=Math.min(window.devicePixelRatio || 1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);draw();
  }
  new ResizeObserver(resize).observe(canvas);
  button.addEventListener('click', () => { paused=!paused;updateButton();schedule(); });
  reducedMotion.addEventListener('change', event => { paused=event.matches;updateButton();schedule(); });
  document.addEventListener('visibilitychange', schedule);
  updateButton();resize();schedule();
}
