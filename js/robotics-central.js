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
      const categories = (card.dataset.category || '').split(/\s+/);
      card.hidden = category !== 'all' && !categories.includes(category);
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
    // Isometric workbench cutting mat grid
    for (let n = -240; n <= 300; n += 30) {
      line(project({x:n,y:0,z:-220}),project({x:n,y:0,z:220}),'#263e5355');
      line(project({x:-240,y:0,z:n}),project({x:300,y:0,z:n}),'#263e5355');
    }
    line(project({x:-240,y:0,z:0}),project({x:300,y:0,z:0}),'#4ade8044', 1.4);
    line(project({x:0,y:0,z:-220}),project({x:0,y:0,z:220}),'#38bdf844', 1.4);
    const base = project({x:0,y:0,z:0});
    // Holographic green calibration rings (inspired by SeedCore sandbox preview)
    ctx.beginPath();ctx.ellipse(base.x,base.y+3*scale,74*scale,21*scale,0,0,Math.PI*2);
    ctx.strokeStyle='#4ade8066';ctx.lineWidth=1.4*scale;ctx.setLineDash([5*scale,4*scale]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.ellipse(base.x,base.y+3*scale,54*scale,15*scale,0,0,Math.PI*2);
    ctx.fillStyle='#4ade8012';ctx.fill();ctx.strokeStyle='#4ade8088';ctx.lineWidth=1.2*scale;ctx.stroke();
    // Tactile 3D-printed base pedestal
    ctx.beginPath();ctx.ellipse(base.x,base.y+4*scale,40*scale,12*scale,0,0,Math.PI*2);ctx.fillStyle='#040b15b0';ctx.fill();
    ctx.beginPath();ctx.ellipse(base.x,base.y,34*scale,11*scale,0,0,Math.PI*2);ctx.fillStyle='#1e293b';ctx.fill();ctx.strokeStyle='#475569';ctx.lineWidth=1.5*scale;ctx.stroke();
    ctx.beginPath();ctx.ellipse(base.x,base.y-5*scale,26*scale,8*scale,0,0,Math.PI*2);ctx.fillStyle='#0f172a';ctx.fill();ctx.strokeStyle='#38bdf866';ctx.stroke();
    // End-effector trajectory trail
    ctx.beginPath();
    for (let n = 0; n <= 65; n++) {
      const past = pose(time - 7 + n*7/65).points[links];
      const p = project(past);
      if (n===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
    }
    ctx.strokeStyle='#4ade8099';ctx.lineWidth=1.6;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    const state = pose(time);
    const points = state.points.map(project);
    // Simplified, tactile 3D-printed link colors (Yellow -> Cyan -> Mint)
    const linkColors = [
      {outer:'#a16207', inner:'#facc15', slot:'#713f12'},
      {outer:'#0369a1', inner:'#38bdf8', slot:'#0c4a6e'},
      {outer:'#15803d', inner:'#4ade80', slot:'#14532d'}
    ];
    for (let n = 0; n < links; n++) {
      const a=points[n],b=points[n+1],pal=linkColors[n % linkColors.length];
      line({x:a.x+3*scale,y:a.y+5*scale},{x:b.x+3*scale,y:b.y+5*scale},'#02081399',25*scale);
      line(a,b,pal.outer,22*scale);
      line(a,b,pal.inner,14*scale);
      const insetA={x:a.x+(b.x-a.x)*.22,y:a.y+(b.y-a.y)*.22};
      const insetB={x:a.x+(b.x-a.x)*.78,y:a.y+(b.y-a.y)*.78};
      line(insetA,insetB,pal.slot,3.6*scale);
    }
    // Realistic Feetech STS3215 Servo Blocks & Brass Spline Horns at Joints
    for (let n = 0; n < links; n++) {
      const p=points[n],radius=(n===0?16:13.5)*scale;
      ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fillStyle='#1e293b';ctx.fill();ctx.lineWidth=2*scale;ctx.strokeStyle='#94a3b8';ctx.stroke();
      ctx.beginPath();ctx.arc(p.x,p.y,radius*.66,0,Math.PI*2);ctx.fillStyle='#0f172a';ctx.fill();ctx.strokeStyle='#4ade80';ctx.lineWidth=1.4*scale;ctx.stroke();
      ctx.beginPath();ctx.arc(p.x,p.y,4*scale,0,Math.PI*2);ctx.fillStyle='#f59e0b';ctx.fill();
      const side=n===0?-1:1;
      line({x:p.x+side*radius,y:p.y},{x:p.x+side*32*scale,y:p.y-9*scale},'#4ade8088',1);
      ctx.fillStyle='#b6d4e4';ctx.font=`${Math.max(8,9*scale)}px monospace`;
      ctx.textAlign=side<0?'right':'left';ctx.fillText('STS-0'+(n+1),p.x+side*36*scale,p.y-8*scale);
    }
    ctx.textAlign='left';
    const tip=points[links],last=points[links-1];
    const gripAngle=Math.atan2(tip.y-last.y,tip.x-last.x);
    ctx.save();ctx.translate(tip.x,tip.y);ctx.rotate(gripAngle);ctx.strokeStyle='#f97316';ctx.lineWidth=4.2*scale;
    ctx.beginPath();ctx.moveTo(0,-6*scale);ctx.lineTo(15*scale,-10*scale);ctx.lineTo(22*scale,-5*scale);ctx.moveTo(0,6*scale);ctx.lineTo(15*scale,10*scale);ctx.lineTo(22*scale,5*scale);ctx.stroke();ctx.restore();
    ctx.beginPath();ctx.arc(tip.x,tip.y,5*scale,0,Math.PI*2);ctx.fillStyle='#4ade80';ctx.fill();
    ctx.font=`${Math.max(8,9*scale)}px monospace`;ctx.fillStyle='#86efac';ctx.fillText('END EFFECTOR',tip.x+16*scale,tip.y-20*scale);
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
