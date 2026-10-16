import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
const base='http://127.0.0.1:8765/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const problems=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>problems.push('JS: '+e.message));
 page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))problems.push('Recurso externo: '+r.url())});
 await page.goto(base,{waitUntil:'load'});
 await page.waitForURL(/v070\.html/);
 assert.match(await page.title(),/Indicadores qualificados/);
 assert.equal(await page.locator('.kpi-interactive').count(),8);
 assert.equal(await page.locator('.status.nd').count(),3);
 assert.match(await page.locator('#exploreName').innerText(),/Conclusão/);
 mkdirSync('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/painel-desktop.png',fullPage:true});
 const values=['81,9%','14 dias','4,38','N/D','N/D','N/D','39,9','528,7'];
 for(let i=1;i<=8;i++){
    await page.locator('#selIndicador').selectOption(String(i));
    assert.equal(await page.locator('#exploreNumber').innerText(),values[i-1],'Indicador '+i);
    for(const section of ['formula','investigate','action','limits']){
      await page.locator('#tab-'+section).click();
      assert.ok((await page.locator('#explainBody').innerText()).length>35);
    }
 }
 await page.locator('.kpi-interactive[data-indicator="4"]').click();
 assert.equal(await page.locator('#exploreNumber').innerText(),'N/D');
 await page.locator('.kpi-interactive[data-indicator="2"]').focus();
 await page.keyboard.press('Enter');
 assert.equal(await page.locator('#exploreNumber').innerText(),'14 dias');
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.locator('#selIndicador').isVisible());
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth > window.innerWidth+5);
 assert.equal(overflow,false,'Rolagem horizontal indevida no celular');
 await page.screenshot({path:'artifacts/painel-mobile.png',fullPage:true});
 await page.emulateMedia({media:'print'});
 assert.equal(await page.locator('.quick-nav').isVisible(),false);
 assert.deepEqual(problems,[]);
 console.log('PASS E2E: 8 fichas, 5 dimensoes, teclado, mobile, impressao, JS e recursos locais');
} finally {
 await browser.close();
}
