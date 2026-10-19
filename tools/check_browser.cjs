// Requires Playwright and an installed Chrome browser. Serve dist/client first.
const { chromium } = require('playwright');
const base = (process.env.SITE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || "chrome"});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
 const errors=[]; const failures=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)failures.push([r.status(),r.url()]);});
 await page.goto(base+'/',{waitUntil:'networkidle'});
 if(await page.getByRole('button',{name:/Menu/}).isVisible())throw new Error('Mobile menu visible on desktop');
 await page.screenshot({path:'/tmp/seedcore-home-desktop.png',fullPage:true});
 const routes=['index.html','develop.html','diy-showcase.html','trading.html','activities.html','about.html','contact.html','sitemap.html','resources/','privacy-policy.html','terms-of-service.html','studio/index.html','studio/tree-lab.html'];
 for(const route of routes){
  await page.goto(base+'/'+route);
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:900});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow)throw new Error(`Horizontal overflow at ${route} / ${width}`);
  }
 }
 await page.goto(base+'/');
 await page.getByRole('tab',{name:'Execution receipt',exact:true}).click();
 if(!await page.locator('#receipt-code').isVisible()||await page.locator('#intent-code').isVisible())throw new Error('Receipt tab did not switch panels');
 await page.keyboard.press('Home');
 if(!await page.locator('#intent-code').isVisible()||await page.locator('#receipt-code').isVisible())throw new Error('Keyboard contract navigation failed');
 await page.getByRole('button',{name:'2-link',exact:true}).click();
 if(await page.locator('#previewLinkCount').textContent()!=='2-link chain')throw new Error('Preview model switch failed');
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'/tmp/seedcore-home-mobile.png',fullPage:true});
 const toggle=page.getByRole('button',{name:/Menu/});
 await toggle.click();
 if(await toggle.getAttribute('aria-expanded')!=='true')throw new Error('Menu failed to open');
 await page.keyboard.press('Escape');
 if(await toggle.getAttribute('aria-expanded')!=='false')throw new Error('Escape failed');
 await toggle.click();await page.setViewportSize({width:1440,height:1000});
 if(!await page.getByRole('link',{name:'Build Gallery',exact:true}).first().isVisible())throw new Error('Desktop nav hidden after resize');
 await page.goto(base+'/develop.html');
 await page.screenshot({path:'/tmp/seedcore-develop-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'/tmp/seedcore-develop-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'/diy-showcase.html');
 await page.getByRole('button',{name:'Bipeds',exact:true}).click();
 if(await page.locator('[data-category]:visible').count()!==1)throw new Error('Filter count wrong');
 await page.evaluate(()=>location.hash='reachy');
 await page.waitForFunction(()=>!document.getElementById('reachy').hidden);
 await page.goto(base+'/contact.html?interest=parts');
 // Inspect the local draft without opening the tester's external email client.
 await page.locator('#draft-link').evaluate(link=>link.addEventListener('click',event=>event.preventDefault()));
 if(await page.locator('#interest').inputValue()!=='parts')throw new Error('Prefill failed');
 await page.locator('#name').fill('Test Builder');await page.locator('#email').fill('builder@example.com');
 await page.locator('#message').fill('A small arm & a bounded experiment.');
 await page.getByRole('button',{name:'Prepare email'}).click();
 const href=await page.locator('#draft-link').getAttribute('href');
 if(!href.startsWith('mailto:hello@seedcore.ai?')||!href.includes('small%20arm%20%26'))throw new Error('Invalid draft');
 await page.screenshot({path:'/tmp/seedcore-contact-desktop.png',fullPage:true});
 await page.goto(base+'/studio/index.html');
 await page.getByRole('button',{name:'One step',exact:true}).click();
 await page.waitForFunction(()=>document.getElementById('time').textContent!=='0.00 s');
 await page.waitForFunction(()=>!document.getElementById('save-progress').disabled);
 const checkpointTime=await page.locator('#time').textContent();
 const progressDownload=page.waitForEvent('download');
 await page.getByRole('button',{name:'Save progress',exact:true}).click();
 await (await progressDownload).saveAs('/tmp/seedcore-lab-progress.json');
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 await page.waitForFunction(()=>document.getElementById('time').textContent==='0.00 s'&&!document.getElementById('save-progress').disabled);
 await page.locator('#progress-file').setInputFiles('/tmp/seedcore-lab-progress.json');
 await page.waitForFunction(expected=>document.getElementById('time').textContent===expected&&!document.getElementById('save-progress').disabled,checkpointTime);

 await page.getByRole('button',{name:/Continue/}).click();
 await page.waitForFunction(()=>document.getElementById('download').disabled===false,{},{timeout:15000});
 await page.screenshot({path:'/tmp/seedcore-lab-desktop.png',fullPage:true});
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Save experiment'}).click();
 const download=await downloadPromise;await download.saveAs('/tmp/seedcore-lab-experiment.json');
 const experiment=require('/tmp/seedcore-lab-experiment.json');
 if(experiment.backend !== 'cpp-wasm')throw new Error('Unexpected physics backend: '+experiment.backend);
 if(!experiment.complete || experiment.samples.length !== 361 || experiment.source !== 'local_research_simulation')throw new Error('Incomplete lab export');
 await page.getByRole('button',{name:'Replay observations'}).click();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/seedcore-lab-mobile.png',fullPage:true});
 await page.goto(base+'/studio/tree-lab.html');
 await page.waitForFunction(()=>!document.getElementById('step').disabled);
 if(await page.locator('#joint-table-body tr').count()!==3)throw new Error('3D lab default model is not three-link');
 await page.locator('#step').click();
 await page.waitForFunction(()=>document.getElementById('time-val').textContent!=='0.00 s');
 if(await page.locator('#error-message').textContent())throw new Error('3D lab step failed');
 const treeDownloadPromise=page.waitForEvent('download');
 await page.locator('#export-json').click();
 await (await treeDownloadPromise).saveAs('/tmp/seedcore-tree-state.json');
 const tree=require('/tmp/seedcore-tree-state.json');
 if(tree.schema!=='seedcore.mini-sim.tree-experiment.v1'||tree.kind!=='state_snapshot'||tree.numLinks!==3||tree.tick!==8||tree.engine.abi!==2||tree.source!=='local_research_simulation')throw new Error('Invalid 3D Wasm state export');
 await page.locator('#run').click();
 await page.waitForFunction(()=>document.getElementById('run-status').textContent==='Running');
 await page.waitForFunction(()=>parseFloat(document.getElementById('time-val').textContent)>0.05);
 await page.locator('#run').click();
 if(await page.locator('#run-status').textContent()!=='Paused')throw new Error('3D lab pause failed');
 for(const [model,links] of [['1-link',1],['2-link',2],['3-link',3]]){
  await page.locator('#model-select').selectOption(model);
  if(await page.locator('#time-val').textContent()!=='0.00 s'||await page.locator('#joint-table-body tr').count()!==links)throw new Error('3D model reset failed: '+model);
  await page.locator('#step').click();
  if(await page.locator('#time-val').textContent()==='0.00 s')throw new Error('3D model step failed: '+model);
 }
 await page.locator('#reset').click();
 if(await page.locator('#time-val').textContent()!=='0.00 s')throw new Error('3D lab reset failed');
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'/tmp/seedcore-tree-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'/tmp/seedcore-tree-mobile.png',fullPage:true});
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto(base+'/');
 if(await reduced.locator('#previewPause').textContent()!=='Play preview')throw new Error('Reduced motion ignored');
 if(errors.length||failures.length)throw new Error(JSON.stringify({errors,failures}));
 const noJs=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});
 await noJs.goto(base+'/');
 if(!await noJs.getByRole('link',{name:'Build Gallery',exact:true}).first().isVisible())throw new Error('No-JS navigation unavailable');
 await noJs.goto(base+'/contact.html');
 if(!await noJs.getByRole('button',{name:'Prepare email'}).isDisabled())throw new Error('No-JS form can submit contact data');
 console.log(`PASS: ${routes.length} routes × 4 widths; navigation, contract tabs, preview model, filters/deep links, contact draft, 2D Wasm checkpoint/replay, 3D Wasm run/pause/step/reset/models/export, reduced motion and no-JS fallbacks. No browser errors or failed requests.`);
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
