const puppeteer = require('puppeteer');

(async () => {

      const browser = await puppeteer.launch({slowMo: 100});
      const page = await browser.newPage();
      await page.setViewport({
          width: 1280,
          height: 720,
          deviceScaleFactor: 0,
      });

      await page.goto('https://onlinedev.uai.cl/alejandro/');

      debugger;
      await page.touchstart;
      //Click Login
      await page.touchscreen.tap(1251   , 29);
      //Click en nombre usuario (Para escribir)
      await page.touchscreen.tap(437   , 187);
      await page.keyboard.type('TestAdmin');
      await page.keyboard.press('Tab');
      await page.keyboard.type('Testadmin1$');
      await page.touchscreen.tap(510   , 337);

      //Fin login

      //Buscamos Logspostula
      await page.touchscreen.tap(110   , 286);

      await page.touchscreen.tap(374   , 414);

      //Bajamos, scroll down
      for (var i = 0; i < 9; i++) {
         await page.keyboard.press('ArrowDown');
      }
      //Click Logspostula
      await page.touchscreen.tap(602   , 645);
      await page.touchscreen.tap(602   , 645);



      await page.touchend

      await page.screenshot({path: 'example.png'});

      await browser.close();
})();