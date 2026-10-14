/* Static-site interactions. This site never issues robot authority or submits contact data. */
document.documentElement.classList.add('js');
initNavigation();
initGallery();
initContact();
initArmPreview();
initContractTabs();

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
  const button = document.getElementById('previewPause');
  if (!ctx || !button) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const modelButtons = [...document.querySelectorAll('[data-preview-model]')];
  let paused = reducedMotion.matches;
  let links = 3;
  let frame = 0;
  let time = 0;
  let previous = null;
  let width = 0;
  let height = 0;
  let visible = true;
  let lastReadout = -1;
  button.hidden = false;
  function updateButton() {
    button.textContent = paused ? 'Play preview' : 'Pause preview';
    button.setAttribute('aria-pressed', String(paused));
  }
  function pose(t) {
    const angles = [1.95 + Math.sin(t * .55) * .22, -1.25 + Math.cos(t * .7) * .24, -.7 + Math.sin(t * .8) * .3];
    const lengths = [96, 86, 59];
    const points = [{x:0, y:16, z:0}];
    let angle = 0;
    for (let i = 0; i < links; i++) {
      angle += angles[i];
      const p = points[i];
      points.push({x:p.x + Math.cos(angle)*lengths[i], y:p.y + Math.sin(angle)*lengths[i], z:0});
    }
    return {points, angle, firstAngle:angles[0]};
  }
  function draw() {
    const scale = Math.min(width / 540, height / 310);
    const project = p => ({x:width*.43 + (p.x*.94-p.z*.67)*scale, y:height*.82 + (-p.y+p.x*.23+p.z*.37)*scale});
    function line(a, b, color, thickness = 1) {
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=thickness;ctx.stroke();
    }
    ctx.clearRect(0,0,width,height);
    ctx.lineCap='round';
    for (let n = -240; n <= 300; n += 30) {
      line(project({x:n,y:0,z:-220}),project({x:n,y:0,z:220}),'#263e535f');
      line(project({x:-240,y:0,z:n}),project({x:300,y:0,z:n}),'#263e535f');
    }
    line(project({x:-240,y:0,z:0}),project({x:300,y:0,z:0}),'#49727d70');
    line(project({x:0,y:0,z:-220}),project({x:0,y:0,z:220}),'#44648070');
    const base = project({x:0,y:0,z:0});
    ctx.beginPath();ctx.ellipse(base.x,base.y+4*scale,57*scale,15*scale,0,0,Math.PI*2);ctx.fillStyle='#040b15a0';ctx.fill();
    ctx.beginPath();ctx.ellipse(base.x,base.y,35*scale,12*scale,0,0,Math.PI*2);ctx.fillStyle='#335169';ctx.fill();
    ctx.beginPath();ctx.ellipse(base.x,base.y-5*scale,35*scale,12*scale,0,0,Math.PI*2);ctx.fillStyle='#879eac';ctx.fill();
    ctx.beginPath();ctx.ellipse(base.x,base.y-6*scale,25*scale,8*scale,0,0,Math.PI*2);ctx.fillStyle='#152c3d';ctx.fill();
    ctx.beginPath();
    for (let n = 0; n <= 65; n++) {
      const past = pose(time - 7 + n*7/65).points[links];
      const p = project(past);
      if (n===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
    }
    ctx.strokeStyle='#60dce066';ctx.lineWidth=1.3;ctx.setLineDash([3,4]);ctx.stroke();ctx.setLineDash([]);
    const state = pose(time);
    const points = state.points.map(project);
    for (let n = 0; n < links; n++) {
      const a=points[n],b=points[n+1];
      line({x:a.x+3*scale,y:a.y+5*scale},{x:b.x+3*scale,y:b.y+5*scale},'#02081399',27*scale);
      const metal=ctx.createLinearGradient(a.x-10*scale,a.y,b.x+10*scale,b.y);
      metal.addColorStop(0,'#5d788b');metal.addColorStop(.32,'#d0dce2');metal.addColorStop(.67,'#a7becb');metal.addColorStop(1,'#6e8d9f');
      line(a,b,'#36556c',25*scale);line(a,b,metal,19*scale);
      const insetA={x:a.x+(b.x-a.x)*.2,y:a.y+(b.y-a.y)*.2};
      const insetB={x:a.x+(b.x-a.x)*.8,y:a.y+(b.y-a.y)*.8};
      line(insetA,insetB,'#192f41',4*scale);line(insetA,insetB,'#69d9de',1.2*scale);
    }
    for (let n = 0; n < links; n++) {
      const p=points[n],radius=(n===0?17:14)*scale;
      ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fillStyle='#86a1b0';ctx.fill();ctx.lineWidth=1.5*scale;ctx.strokeStyle='#c7dbe5';ctx.stroke();
      ctx.beginPath();ctx.arc(p.x,p.y,radius*.72,0,Math.PI*2);ctx.fillStyle='#102639';ctx.fill();ctx.strokeStyle='#5ccfd7';ctx.stroke();
      ctx.beginPath();ctx.arc(p.x,p.y,3.4*scale,0,Math.PI*2);ctx.fillStyle='#70e5e2';ctx.fill();
      const side=n===0?-1:1;
      line({x:p.x+side*radius,y:p.y},{x:p.x+side*32*scale,y:p.y-9*scale},'#4b718b',.8);
      ctx.fillStyle='#9fbbcd';ctx.font=`${Math.max(8,9*scale)}px monospace`;
      ctx.textAlign=side<0?'right':'left';ctx.fillText('J0'+(n+1),p.x+side*36*scale,p.y-8*scale);
    }
    ctx.textAlign='left';
    const tip=points[links],last=points[links-1];
    const gripAngle=Math.atan2(tip.y-last.y,tip.x-last.x);
    ctx.save();ctx.translate(tip.x,tip.y);ctx.rotate(gripAngle);ctx.strokeStyle='#94b5c5';ctx.lineWidth=4*scale;
    ctx.beginPath();ctx.moveTo(0,-6*scale);ctx.lineTo(15*scale,-10*scale);ctx.lineTo(22*scale,-5*scale);ctx.moveTo(0,6*scale);ctx.lineTo(15*scale,10*scale);ctx.lineTo(22*scale,5*scale);ctx.stroke();ctx.restore();
    ctx.beginPath();ctx.arc(tip.x,tip.y,4*scale,0,Math.PI*2);ctx.fillStyle='#69e1e0';ctx.fill();
    ctx.font=`${Math.max(8,9*scale)}px monospace`;ctx.fillStyle='#7dd5dd';ctx.fillText('END EFFECTOR',tip.x+16*scale,tip.y-20*scale);
    if (Math.abs(time-lastReadout)>.12 || lastReadout<0) {
      const angle=document.getElementById('previewAngle');
      if (angle) angle.textContent=(state.firstAngle*180/Math.PI).toFixed(1)+'°';
      lastReadout=time;
    }
  }
  function loop(timestamp) {
    frame=0;
    if (paused || document.hidden || !visible) {previous=null;return;}
    if (previous!==null) time+=Math.min((timestamp-previous)/1000,.05);
    previous=timestamp;draw();frame=requestAnimationFrame(loop);
  }
  function schedule() {
    cancelAnimationFrame(frame);frame=0;previous=null;
    if (!paused && !document.hidden && visible) frame=requestAnimationFrame(loop);
  }
  function resize() {
    const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;
    if (!width || !height) return;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);draw();
  }
  modelButtons.forEach(modelButton => modelButton.addEventListener('click',()=>{
    links=Number(modelButton.dataset.previewModel);
    modelButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===modelButton)));
    document.getElementById('previewLinkCount').textContent=links+'-link chain';
    document.getElementById('previewModelLabel').textContent=links+'-DOF MANIPULATOR';
    canvas.setAttribute('aria-label',`Animated kinematic preview of a ${links}-link articulated robot arm`);
    lastReadout=-1;draw();
  }));
  new ResizeObserver(resize).observe(canvas);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;schedule();
  }).observe(canvas);
  button.addEventListener('click',()=>{paused=!paused;updateButton();schedule();});
  reducedMotion.addEventListener('change',event=>{paused=event.matches;updateButton();schedule();});
  document.addEventListener('visibilitychange',schedule);
  updateButton();resize();schedule();
}

function initContractTabs() {
  const tabs=[...document.querySelectorAll('[data-code-tab]')];
  if (!tabs.length) return;
  function activate(tab) {
    tabs.forEach(item=>{
      const selected=item===tab;
      item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;
      document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;
    });
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab));
    tab.addEventListener('keydown',event=>{
      const offsets={ArrowRight:1,ArrowLeft:-1,Home:-index,End:tabs.length-1-index};
      if (!(event.key in offsets)) return;
      event.preventDefault();
      const next=tabs[(index+offsets[event.key]+tabs.length)%tabs.length];
      activate(next);next.focus();
    });
  });
}
