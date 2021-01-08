const timeout = 30000
describe( '/ (Test Cursos Multiples)',
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
        //Logout
        //await page.screenshot({path: 'imagenes/prelogout.png'})
        await page.goto('https://onlinedev.uai.cl/alejandro/login/logout.php')
        .then(() => page.click('[type="submit"]'))


        }
      )
    afterAll(
      async () => {
          await page.close()

        }
      )



    test('Inicio Curso Doble',
      async () => {
        let testname = "Inicio_CursoDoble"
        let username = "JuanDoble"
        let cohorte = "20"
        let cohorte2 = "30"
        let path = "imagenes/"
        let password = "pepito.1234"
        //Creamos usuario
        await page.goto('https://onlinedev.uai.cl/alejandro/local/uaio/createManualUser_Testing.php?usuarioid='+username+'&correo='+username+'&cohorteid='+cohorte)
        await page.goto('https://onlinedev.uai.cl/alejandro/local/uaio/createManualUser_Testing.php?usuarioid='+username+'&correo='+username+'&cohorteid='+cohorte2)


        //LOGIN
        await page.goto('https://onlinedev.uai.cl/alejandro/login/index.php')
        await page.type('#username',username)
            .then(() => page.type('#password',password), {delay: 5})
            .then(() => page.click('#loginbtn'))

        // CURSO 1
        await page.waitFor('#miscursos > .row .col-md-6 .tarjeta-curso > button',{visible:true})
            .then(() => page.click('#miscursos > .row .col-md-6 .tarjeta-curso > button'))
            .then(() => page.click('#miscursos > .row .col-md-6 .tarjeta-curso > button'))
            .then(() => page.waitFor(300))

        await page.waitFor('.modal.fade.show')
            .then(() => page.select('select#formDateSelect', 'today'), {delay: 5})
            .then(() => page.click('.modal-footer .btn.btn-primary'), {delay: 5})
            .then(() => page.waitFor(300))

        //FIN CURSO 1
             //Bug de DEV, cuando aceptas cursos te desconecta.
             //LOGIN
        await page.goto('https://onlinedev.uai.cl/alejandro/login/index.php')
            .then(() => page.type('#username',username))
            .then(() => page.type('#password',password))
            .then(() => page.click('#loginbtn'))
            .then(() => page.waitFor(300))



        //CURSO 2
        await page.waitFor('#miscursos > .row .col-md-6 .tarjeta-curso > button',{visible:true})
            .then(() => page.click('#miscursos > .row .col-md-6 .tarjeta-curso > button'))

        await page.waitFor('.modal.fade.show')
            .then(() => page.select('select#formDateSelect', 'today'), {delay: 5})
            .then(() => page.click('.modal-footer .btn.btn-primary'), {delay: 5})
            .then(() => page.waitFor(300))

        //FIN CURSO 1
             //Bug de DEV, cuando aceptas cursos te desconecta.
             //LOGIN
        await page.goto('https://onlinedev.uai.cl/alejandro/login/index.php')
            .then(() => page.type('#username',username))
            .then(() => page.type('#password',password))
            .then(() => page.click('#loginbtn'))
            .then(() => page.waitFor(300))
        const text = await page.evaluate(() => document.querySelector('#miscursos').textContent)
        expect(text).toContain('Estado: CURSANDO')
        //await page.screenshot({path: 'imagenes/cursodoble.png'})
          },9000000
        )

  }
)

