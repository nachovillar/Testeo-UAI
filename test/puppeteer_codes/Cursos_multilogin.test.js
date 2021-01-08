//editar antes de correr los test
const fecha = "-Staging-23-01Jun2020"
//----------
const timeout = 90000
const casesDevAlejandro = [
  //[Username,cohorte,password,expect,SENCE?,HacerOC,NumeroOC,rut]
  //UAI USERNAME
  ["uaiusername","AACurso",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,0,0,1],//1/1
  ["uaiusername","ABCursoDoble",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,0,0,1],//1/2
  ["uaiusername","ACCursoDoble",2262,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  ["uaiusername","ADDiplomado",2317,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/1
  ["uaiusername","AEDiplomadoDoble",2317,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/2
  ["uaiusername","AFDiplomadoDoble",	2319,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  ["uaiusername","AGDiplomadoYCurso",	2319,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/2
  ["uaiusername","AGDiplomadoYCurso",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  //["uaiusername","AZTableTester","00","pepito.1235",'Usuario no registrado en plataforma.',0,0,0,0,0,1],
  //PERSONAL USERNAME
  ["personalusername","BACurso",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/1
  ["personalusername","BBCursoDoble",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/2
  ["personalusername","BCCursoDoble",2262,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  ["personalusername","BDDiplomado",2317,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/1
  ["personalusername","BEDiplomadoDoble",2317,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/2
  ["personalusername","BFDiplomadoDoble",	2319,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  ["personalusername","BGDiplomadoYCurso",	2319,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/2
  ["personalusername","BGDiplomadoYCurso",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  //["personalusername","BZTableTester","00","pepito.1235",'Usuario no registrado en plataforma.',0,0,0,0,0,1],
  //RUT

  ["rut","CACurso",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,"123-1"],//1/1
  ["rut","CBCursoDoble",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,"123-2"],//1/2
  ["rut","CCCursoDoble",2262,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,"123-3"],//2/2
  ["rut","CDDiplomado",2317,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,"123-4"],//1/1
  ["rut","CEDiplomadoDoble",2317,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,"123-5"],//1/2
  ["rut","CFDiplomadoDoble",	2319,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,"123-6"],//2/2
  ["rut","CGDiplomadoYCurso",	2319,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,"123-7"],//1/2
  ["rut","CGDiplomadoYCurso",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,"123-K"],//2/2
  ["rut","CZTableTester","00","pepito.1235",'Usuario no registrado en plataforma.',0,0,0,0,0,1],/*
  //PASAPORTES
  ["pasaporte","DACurso",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/1
  ["pasaporte","DBCursoDoble",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/2
  ["pasaporte","DCCursoDoble",2262,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  ["pasaporte","DDDiplomado",2317,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/1
  ["pasaporte","DEDiplomadoDoble",2317,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/2
  ["pasaporte","DFDiplomadoDoble",	2319,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  ["pasaporte","DGDiplomadoYCurso",	2319,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//1/2
  ["pasaporte","DGDiplomadoYCurso",2263,"pepito.1234",'Estado: CURSANDO',0,0,0,0,0,1],//2/2
  ["pasaporte","DZTableTester","00","pepito.1235",'Usuario no registrado en plataforma.',0,0,0,0,0,1]
*/
  //SENCE
  ["uaiusername","SenceUser",2495,"cfgo10358",'Estado: CURSANDO',1,1,1237977245,"10358400-0"],//1/1
  ["personalusername","SenceUser",2495,"cfgo10358",'Estado: CURSANDO',1,1,1237977245,"10358400-0"],//1/1
  ["rut","SenceUser",2495,"cfgo10358",'Estado: CURSANDO',1,1,1237977245,"10358400-0"],//1/1
  ["pasaporte","SenceUser",2495,"cfgo10358",'Estado: CURSANDO',1,1,1237977245,"10358400-0"]//1/1

]

const errores = []

describe( '/ (Test Cursos Multiples con tabla)',() => {
  let page
  //Funciones before y after all
  beforeAll(
    async () => {
      ////////////////
    })
  beforeEach(async () => {
    page = await global.__BROWSER__.newPage()
    await page.setViewport({ width: 1366, height: 768 })
    await page.setUserAgent( 'UA-TEST' );
    await page.setDefaultNavigationTimeout( 90000 )
  })
  afterEach(async () => {
    /////////////////////
    })
  afterAll(async () => {
    await page.close()
  })
  //Inicio pruebas
  //Separar Test para enrol usuarios (createmanualuser)

  describe("Creamos usuarios de prueba", () => {
    test.each(casesDevAlejandro) (
      "Matriculación %p [tablas] %p",
      async (logintype,username,cohorte,password,resultado,SENCE,DoOC,numeroOC,rut) => {
        username = username+fecha+SENCE
         if (resultado == 'Estado: CURSANDO'){
            //console.log(username)
            //link de test
            //https://onlinedev.uai.cl/local/uaio/createManualUser_Testing.php?usuarioid=testi&correo=testi&cohorteid=10&rut=12&SENCE=1&DoOc=1&numeroc=5
            //https://onlinedev.uai.cl/local/uaio/createManualUser_Testing.php?usuarioid=SenceUser&correo=SenceUser&cohorteid=416&rut=10358400-0&SENCE=1&DoOc=1&numeroc=1237977245
            await page.goto('https://onlinedev.uai.cl/local/uaio/createManualUser_Testing.php?usuarioid='+username+'&correo='+username+'&cohorteid='+cohorte+'&rut='+rut+'&SENCE='+SENCE+'&DoOc='+DoOC+'&numeroc='+numeroOC)

            //await page.screenshot({path: 'imagenes/'+username+'AAMatricula.png'})
            const text = await page.evaluate(() => document.body.innerHTML)
            expect(text).toContain('creado exitosament')
         }
      },timeout
    )
  })


  describe("multiple courses", () => {
    test.each(casesDevAlejandro)("Inicio %p [tablas] %p",
      async (logintype,username,cohorte,password,resultado,SENCE,DoOC,numeroOC,rut) => {
        username = username+fecha+SENCE
        //console.log(username)
        //console.log(username,cohorte,resultado)
        //LOGIN
        await page.goto('https://onlinedev.uai.cl/anglo/')
        //await page.screenshot({path: 'imagenes/'+username+'ABlogin.png'})
          .then(() => page.select('select#loginType', logintype), {delay: 5})
        //await page.screenshot({path: 'imagenes/abc.png'})
          .then(() => page.type('#'+logintype+' #id_username',username))
          .then(() => page.click('#'+logintype+' #id_submitbutton'))
        await page.waitFor(300)
        //await page.screenshot({path: 'imagenes/'+username+'ABBlogin.png'})
          .then(() => page.type('#'+logintype+' #id_password',password))
          .then(() => page.click('#'+logintype+' #id_submitbutton'))
          .then(() => page.waitFor(300))
        //await page.screenshot({path: 'imagenes/'+username+'KKMid.png'})
        if (resultado == 'Estado: CURSANDO' && SENCE == 0){
          // CURSO 1
          //console.log('Inicio Curso 1')
          await page.waitFor('#miscursos > .row .col-md-6 .tarjeta-curso > button',{visible:true})
              .then(() => page.click('#miscursos > .row .col-md-6 .tarjeta-curso > button'))
              .then(() => page.click('#miscursos > .row .col-md-6 .tarjeta-curso > button'))
              .then(() => page.waitFor(300))
          //console.log('eligiendo fecha')
          await page.waitFor('.modal.fade.show', {waitUntil: 'load'})
            .then(() => page.select('select#formDateSelect', 'today'), {delay: 5})
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
        }else if (resultado == 'Estado: CURSANDO' && SENCE == 1){
          //Inicio de sesion SENCE
          //////////////////////////////
          //////////////////////////////
          //////////////////////////////
          //Sence No selecciona curso. Nos importa que logre acceder a la pagina.
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
})

