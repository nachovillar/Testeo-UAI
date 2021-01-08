const timeout = 30000
describe( '/ (TEST stickProGames)',

 () => {
     let page
     beforeEach(
       async () => {
       page = await global.__BROWSER__.newPage()
       await page.setViewport({ width: 1920, height: 1080 })
       await page.setUserAgent( 'UA-TEST' );
       }
    )
     afterEach(
      async () => {

          await page.close()
        }
      )

     it('nachoGoogle', async() =>{
      let alesChannel = "stickprogames"

      await page.goto('https://google.com')



      .then(() => page.type('[name="q"]' , "stickprogames" ))
      await page.keyboard.press('Escape')
      .then(() => page.click(`[value="Google Search"]`))
      .then(() => page.waitFor(1000))
      await page.screenshot({path: 'imagenes/step1.png'})

      const linkHandlers = await page.$x("//a[contains(text(), 'ElStickman StickProGames - YouTube')]")
      if (linkHandlers.length > 0) {
       await linkHandlers[0].click()
      }

      await page.goto('https://www.youtube.com/channel/UCj5ZMRTno6gLcdIfD1Rzgzw')




      await page.waitFor(1000)

      .then(() => page.waitFor(1000))
      await page.screenshot({path: 'imagenes/step2.png'})
       let text = await page.evaluate(() => document.body.textContent)

      expect(text).toContain('ZtickHacks')
     }, timeout
     )



}
)