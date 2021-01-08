describe( '/ (Cursos Singulares Test)',
  () => {
    let page
    beforeEach(
      async () => {
      page = await global.__BROWSER__.newPage()
      await page.setViewport({ width: 1366, height: 768 })
      await page.setUserAgent( 'UA-TEST' );
      page.setDefaultNavigationTimeout( 90000 );
      }
    )
    afterEach(
      async () => {
        //Logout
        await page.goto('https://onlinedev.uai.cl/alejandro/login/logout.php')
        //.then(() => page.screenshot({path: 'imagenes/logouterror.png'}))
          .then(() => page.click('[type="submit"]'))
        }
      )

    test('Inicio diplomado',
      async () => {
        let testname = "Inicio_Diplomado"
        let username = "AceptarDiplomado"
        let cohorte = "5" // Diplomado
        let path = "imagenes/"
        let password = "pepito.1234"
        //Creamos usuario
        await page.goto('https://onlinedev.uai.cl/alejandro/local/uaio/createManualUser_Testing.php?usuarioid='+username+'&correo='+username+'&cohorteid='+cohorte)

        await page.goto('https://onlinedev.uai.cl/alejandro/login/index.php')
            .then(() => page.type('#username',username))
            .then(() => page.type('#password',password))
            .then(() => page.click('#loginbtn'))
            .then(() => page.waitFor(300))
        //Aceptamos Curso
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

        //.then(() => page.screenshot({path: 'imagenes/iniciodiplomadoerror.png'}))
        let text = await page.evaluate(() => document.body.textContent)
            expect(text).toContain('Estado: CURSANDO')
      }
    )



  test('Inicio curso',
      async () => {
        let testname = "Inicio_Curso"
        let username = "AceptarCurso"
        let cohorte = "20"
        let path = "imagenes/"
        let password = "pepito.1234"
        //Creamos usuario
        await page.goto('https://onlinedev.uai.cl/alejandro/local/uaio/createManualUser_Testing.php?usuarioid='+username+'&correo='+username+'&cohorteid='+cohorte)

        await page.goto('https://onlinedev.uai.cl/alejandro/login/index.php')
            .then(() => page.type('#username',username))
            .then(() => page.type('#password',password))
            .then(() => page.click('#loginbtn'))
            .then(() => page.waitFor(300))
        //Aceptamos Curso
        await page.waitFor('#miscursos > .row .col-md-6 .tarjeta-curso > button',{visible:true})
            .then(() => page.click('#miscursos > .row .col-md-6 .tarjeta-curso > button'), {delay: 5})

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
      }
    )

  }
)

