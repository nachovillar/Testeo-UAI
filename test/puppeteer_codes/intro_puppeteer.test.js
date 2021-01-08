const timeout = 30000
describe( '/ (UAI ONLINE TEST)',
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
    beforeAll(
      async () => {
        //

        }
      )

    it('googlecom', async () => {
      await page.goto('https://google.com')
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('google')
    })

    it('Entrar A LogsPostula',
      async () => {
        let username = "TestAdmin"
        let password = "Testadmin1$"


        await page.goto('https://onlinedev.uai.cl/alejandro/login/index.php')
            .then(() => page.type('#username',username))
            .then(() => page.type('#password',password))
            .then(() => page.click('#loginbtn'))

        await page.waitFor('[href="https://onlinedev.uai.cl/alejandro/admin/search.php"]')
            .then(() => page.click('[href="https://onlinedev.uai.cl/alejandro/admin/search.php"]'))
            .then(() => page.waitFor(300))

        await page.waitFor('.nav-item > [href="#linkuol"]')
          .then(() => page.click('.nav-item > [href="#linkuol"]'))
          .then(() => page.waitFor(300))

        await page.click('[href="https://onlinedev.uai.cl/alejandro/local/uaio/reports/logspostula.php"]')
        .then(() => page.waitFor(1000))



        let text = await page.evaluate(() => document.querySelector('#page-header').textContent)
                //Logout
        await page.goto('https://onlinedev.uai.cl/alejandro/login/logout.php')
        .then(() => page.click('[type="submit"]'))
        expect(text).toContain('Logs Postula')
      },timeout
    )





  }
)

