const timeout = 30000
describe( '/ (Multi Login)',
  () => {
    let page
    beforeEach(
      async () => {
      page = await global.__BROWSER__.newPage()
      await page.setViewport({ width: 1366, height: 768 })
      await page.setUserAgent( 'UA-TEST' );
      await page.setDefaultNavigationTimeout( 90000 );
      }
    )
    afterEach(
      async () => {
        }
      )
    afterAll(
      async () => {
          await page.close()

        }
      )

    test('login test',
      async () => {
        let logintype = "uaiusername"
        let testname = "loginUAI"
        let username = "TESTING EL USERNAME"
        let password = "pepito.1234"

        await page.goto('https://onlinedev.uai.cl/ernesto/anglo/')
        ////////////////////////////

        //await page.screenshot({path: 'imagenes/2.png'})
          .then(() => page.select('select#loginType', 'uaiusername'), {delay: 5})
        //await page.screenshot({path: 'imagenes/3.png'})

          .then(() => page.type('#'+logintype+' #id_username',username))
          await page.screenshot({path: 'imagenes/3.png'})
          .then(() => page.click('#'+logintype+' #id_submitbutton'))
          await page.waitFor(300)

          .then(() => page.type('#'+logintype+' #id_password',password))
          .then(() => page.click('#'+logintype+' #id_submitbutton'))
          .then(() => page.waitFor(300))
          //.then(() => page.click('#loginbtn'))
          .then(() => page.screenshot({path: 'imagenes/loginawesence.png'}))
          .then(() => page.waitFor(300))

        let text = await page.evaluate(() => document.body.textContent)
            expect(text).toContain('Estado: CURSANDO')
      },timeout
        )

/*
    test('login corporativo',
      async () => {

        let testname = "loginCorp"
        let username = "TESTING EL USERNAME"
        let password = "pepito.1234"

        await page.goto('https://onlinedev.uai.cl/anglo/')
            .then(() => page.click('#personalusername-tab'))
            .then(() => page.waitFor(300))
            .then(() => page.type('.show #id_username',username))
            .then(() => page.click('.show #id_submitbutton'))
            .then(() => page.waitFor(300))
            .then(() => page.type('.show #id_password',password))
            //.then(() => page.click('#loginbtn'))
            .then(() => page.screenshot({path: 'imagenes/loginawecorp.png'}))
            .then(() => page.waitFor(300))

        let text = await page.evaluate(() => document.body.textContent)
            expect(text).toContain('Estado: CURSANDO')
      },9000000
        )

    test('login rut',
      async () => {

        let testname = "login rut"
        let username = "TESTING EL USERNAME"
        let password = "pepito.1234"

        await page.goto('https://onlinedev.uai.cl/anglo/')
            .then(() => page.click('#rut-tab'))
            .then(() => page.waitFor(300))
            .then(() => page.type('.show #id_username',username))
            .then(() => page.click('.show #id_submitbutton'))
            .then(() => page.waitFor(300))
            .then(() => page.type('.show #id_password',password))
            //.then(() => page.click('#loginbtn'))
            .then(() => page.screenshot({path: 'imagenes/loginawerut.png'}))
            .then(() => page.waitFor(300))

        let text = await page.evaluate(() => document.body.textContent)
            expect(text).toContain('Estado: CURSANDO')
      },9000000
        )

    test('login manual',
      async () => {

        let testname = "login manual"
        let username = "TESTING EL USERNAME"
        let password = "pepito.1234"

        await page.goto('https://onlinedev.uai.cl/anglo/')
            .then(() => page.click('#manualaccount-tab'))
            .then(() => page.waitFor(300))
            .then(() => page.type('#id_username',username))
            .then(() => page.click('.show #id_submitbutton'))
            .then(() => page.waitFor(300))
            .then(() => page.type('.show #id_password',password))
            //.then(() => page.click('#loginbtn'))
            .then(() => page.screenshot({path: 'imagenes/loginawemanual.png'}))
            .then(() => page.waitFor(300))

        let text = await page.evaluate(() => document.body.textContent)
            expect(text).toContain('Estado: CURSANDO')
      },9000000
        )
*/
  }
)

