//editar antes de correr los test
const fecha = "-Staging-17-00Jun2020"
//----------
const timeout = 90000
const casesDevAlejandro = [
  //[Username,cohorte,password,expect]
    ["AACurso",2263,"pepito.1234",'Estado: CURSANDO'],//1/1
    ["ABCursoDoble",2263,"pepito.1234",'Estado: CURSANDO'],//1/2
    ["ACCursoDoble",2262,"pepito.1234",'Estado: CURSANDO'],//2/2
    ["ADDiplomado",2317,"pepito.1234",'Estado: CURSANDO'],//1/1
    ["AEDiplomadoDoble",2317,"pepito.1234",'Estado: CURSANDO'],//1/2
    ["AFDiplomadoDoble",	2319,"pepito.1234",'Estado: CURSANDO'],//2/2
    ["AGDiplomadoYCurso",	2319,"pepito.1234",'Estado: CURSANDO'],//1/2
    ["AGDiplomadoYCurso",2263,"pepito.1234",'Estado: CURSANDO'],//2/2
    ["ZZTableTester","00","pepito.1235",'Datos erróneos. Por favor, inténtelo otra vez']
    ]


describe( '/ (Test Cursos Multiples con tabla)',
() => {
  let page
  //Funciones before y after all
  beforeAll(
    async () => {

      }
    )
  beforeEach(
    async () => {
    page = await global.__BROWSER__.newPage()
    await page.setViewport({ width: 1366, height: 768 })
    await page.setUserAgent( 'UA-TEST' );
    await page.setDefaultNavigationTimeout( timeout )
    }
  )
  afterEach(
    async () => {
      //
      await page.goto('https://onlinedev.uai.cl/login/logout.php')
            .then(() => page.click('[type="submit"]'), {delay: 5})
      await page.close()
      }
    )
  afterAll(
    async () => {

      }
    )
  //Inicio pruebas
  //Separar Test para enrol usuarios (createmanualuser)

  describe("Creamos usuarios de prueba", () => {
    test.each(casesDevAlejandro) (
      //["AGDiplomadoYCurso",2263,"pepito.1234",'Estado: CURSANDO'],//2/2
      "Matriculación %p [tablas] %p",
      //"Matriculación AGDiplomadoYCurso [tablas] 2263 pepito.1234",
      async (username,cohorte,password,resultado) => {
        username = username+fecha
         if (resultado == 'Estado: CURSANDO'){
          //console.log(username)
          //link de test
          //https://onlinedev.uai.cl/local/uaio/createManualUser_Testing.php?usuarioid=testname&correo=testname&cohorteid=2263
          await page.goto('https://onlinedev.uai.cl/local/uaio/createManualUser_Testing.php?usuarioid='+username+'&correo='+username+'&cohorteid='+cohorte)
          const text = await page.evaluate(() => document.body.innerHTML)
          //await page.screenshot({path: 'imagenes/'+username+'AAmatricula.png'})
          expect(text).toContain('creado exitosament')
         }
       },timeout
    )
  })


  describe("multiple courses", () => {
    test.each(casesDevAlejandro)(
      "Inicio %p [tablas] %p",
      async (username,cohorte,password,resultado) => {
        username = username+fecha
        //console.log(username)
        //console.log(username,cohorte,resultado)
        //LOGIN
        await page.goto('https://onlinedev.uai.cl/login/index.php')
        //await page.screenshot({path: 'imagenes/'+username+'ABlogin.png'})
        await page.type('#username',username)
            .then(() => page.type('#password',password), {delay: 5})
            .then(() => page.click('#loginbtn'))
        //await page.screenshot({path: 'imagenes/'+username+'KKMid.png'})
        if (resultado == 'Estado: CURSANDO'){
          // CURSO 1
          //console.log('Inicio Curso 1')
          await page.waitFor('#miscursos > .row .col-md-6 .tarjeta-curso > button',{visible:true})
              .then(() => page.click('#miscursos > .row .col-md-6 .tarjeta-curso > button'))
              .then(() => page.click('#miscursos > .row .col-md-6 .tarjeta-curso > button'))
              .then(() => page.waitFor(300))

          //console.log('eligiendo fecha')

          await page.waitFor('.modal.fade.show', {
              waitUntil: 'load'
          })
          //await page.screenshot({path: 'imagenes/2.png'})
            .then(() => page.select('select#formDateSelect', 'today'), {delay: 5})
          //await page.screenshot({path: 'imagenes/3.png'})
            .then(() => page.click('.modal-footer .btn.btn-primary'), {delay: 5})
            .then(() => page.waitFor(300))
          //await console.log("Selección de fecha exitosa.")

          //Nos vamos a la segura y refrescamos la pagina por si demora mucho en cargar.
          await page.goto('https://onlinedev.uai.cl/')

          //await console.log("Evaluando...")

          const text = await page.evaluate(() => document.querySelector('#miscursos').textContent)
          //await page.screenshot({path: 'imagenes/'+username+'ZZEND.png'})
          await page.goto('https://onlinedev.uai.cl/login/logout.php')
            .then(() => page.click('[type="submit"]'), {delay: 5})
          expect(text).toContain(resultado)




        }else{
          //Al no conectarnos no necesitamos logout.
          await page.waitFor(300)
          const text = await page.evaluate(() => document.querySelector('.alert.alert-danger').textContent)
          expect(text).toContain(resultado)

        }
        //await page.screenshot({path: 'imagenes/cursodoble.png'})

     },timeout
    )
  })

  }
)

