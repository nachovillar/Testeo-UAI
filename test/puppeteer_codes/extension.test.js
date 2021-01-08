/**
*
* @package por definir
* @subpackage por definir
* @copyright 2017-onwards Universidad Adolfo Ibanez
* @author José Villar <ernesto.jaramillo@uai.cl>
*/
// Ambiente, ruta y tiempo estimado para el test
var environment = 'ernesto'
var route = '/local/uaio/'
// Creamos una instancia de Date que usaremos como nuestro random number
// Así nos aseguramos que el número no se vuelva a repetir
var now = new Date()
var datenumber = now.getFullYear().toString()
                    + now.getMonth().toString()
                    + now.getDate().toString()
                    + now.getHours().toString()
                    + now.getMinutes().toString()
                    + now.getSeconds().toString()
// Correos dinámicos que se usarán en el test
var institutionalemail = 'INSTITUTIONAL' + datenumber + '@alumnos.uai.clde'
var differentinstitutionalemail = 'differentINSTITUTIONAL' + datenumber + '@alumnos.uai.clde'
var otherinstitutionalemail = 'otherINSTITUTIONALL' + datenumber + '@alumnos.uai.clde'
var personalemail = 'PERSONAL' + datenumber + '@gmail.test'
var differentpersonalemail = 'differentPERSONAL'+ datenumber + '@gmail.test'
var otherpersonalemail = 'otherPERSONAL' + datenumber + '@gmail.test'

// Arreglo con los distintos casos a probar
// Posiciones de cada fila del arreglo: 
// [0] = correo institucional   [4] = id de postulación
// [1] = corre persona          [5] = id de cohorte
// [2] = nombre de la cohorte   [6] = rut
// [3] = nombre del programa
const userCases = [ //Usuario que tiene información de su nombre y apellido por postulacionid
                    [institutionalemail, personalemail,'Cohorte', 'Programa', 71615, 20, 184415521],
                    //ninguno de los dos correos existe, por lo que crea usuario "nombre apellido"
                    [differentinstitutionalemail, differentpersonalemail, 'Cohorte', 'Programa', 234567891, 20, 184415522],
                    //existe correo institucional
                    [otherinstitutionalemail, otherpersonalemail, 'Cohorte', 'Programa', 2345678912, 20, 184415523] ,
                    ]

const url = 'https://onlinedev.uai.cl/' + environment + '/login/index.php'

// ***** Comienza el Test *****//

//Test para comprobar el correcto funcionamiento de los distintos casos de matrículas
describe( 'Test Matricula' , () => {
    let page
    // Antes de cada iteración en el test definimos el largo, ancho, agente y tiempo estimado
    beforeEach(
        async () => {
            page = await global.__BROWSER__.newPage()
            await page.setViewport({width: 1920, height: 1080})
            await page.setUserAgent('UA-TEST')
        }
    )
    // Después de que todo termine cerramos la page
    afterAll(
        async () => {
          await page.close()
        }
    )

    //Test para comprobar que los usuarios son insertados exitosamente
    describe("Create User", () => {
        // Iteración por cada caso en arreglo userCases
        test.each(userCases) (
            // Para cada caso, mostramos el correo institucional y correo personal en la consola
            "User %p CorreoPersonal %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut) => {
                // Url para crear el usuario
                let urlcreateuser = 'https://onlinedev.uai.cl/' + environment + route + 'createuser.php?usuarioid=' + correoInstitucional
                                        + '&correo='+correoPersonal + '&cohorteid=' + cohorteid + '&rut=' + rut
                // Si la url no contiene alguno de los parametros solicitados, entonces termina todo y manda la excepción
                // De no ocurrir excepción, entonces el usuario es registrado y sacamos la screenshot
                let parametersuser = correoInstitucional.length > 0 
                                        && correoPersonal.length > 0 
                                        && cohorteid != ''
                                        && rut != ''
                if (!parametersuser) {
                    throw "Please provide needed parameters into the URL CREATE USER"
                } else {
                    await page.goto(urlcreateuser)
                    
                }
                // Se espera que luego de ingresar al link nos muestre que el usuario fue creado exitosamente
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('Usuario creado')

            }
        )
    })
    //Test para comprobar que los usuarios son matriculados exitosamente
    describe("Create Matricula", () => {
        // Arreglos que se usarán para verificar existencia de usuarios ya registrados previamente
        var institutionalarray = []
        var personalarray = []
        var idsmatriculas = []
        // Iteración por cada caso en arreglo userCases
        test.each(userCases) (
            // Para cada caso, mostramos el correo institucional y correo personal en la consola
            "User %p CorreoPersonal %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut ) => {
                // Url para insertar la matrícula
                let urlmatricula = 'https://onlinedev.uai.cl/' + environment + route + 'addmatricula.php?usuarioid=' + correoInstitucional
                                        + '&correo=' + correoPersonal + '&nombre_cohorte='+nombre_cohorte+'&nombre_programa=' + nombre_programa
                                        + '&postulacionid=' +postulacionid + '&cohorteid=' + cohorteid
                
                
               // Si la url no contiene alguno de los parametros solicitados, entonces termina todo y manda la excepción
                // De no ocurrir excepción, entonces la matrícula es registrada y se obtiene la screenshot correspondiente
                let parametersmatricula = correoInstitucional.length > 0 
                                            && correoPersonal.length > 0 
                                            && cohorteid != ''
                                            && nombre_cohorte.length > 0
                                            && nombre_programa.length > 0
                                            && postulacionid != ''
                if (!parametersmatricula) {
                    throw "Please provide needed parameters into the URL MATRICULA"
                } 
                
                await page.goto(urlmatricula)
                
                // Se espera que dentro de la page se encuentre el mensaje "creado exitosamente"
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('creado exitosamente')
            }
        )
    })

    //Se comprueba que la persona matriculada tenga el botón "Comienza Aquí" en su perfil
    describe("Check Status", () => {
        // Iteración por cada caso en arreglo userCases
        test.each(userCases) (
            // Para cada caso, mostramos el correo institucional y correo personal en la consola
            "User %p CorreoPersonal %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut) => {

            if (!url) {
                throw "Please provide URL as a first argument"
            }

            await page.goto(url)
            
            // Si aparece el botón Salir en alguna de las iteraciones, entonces lo presionamos para confirmar que cerramos sesión
            const [salirbutton] = await page.$x("//button[contains(., 'Salir')]")
            if (salirbutton) {
                await salirbutton.click()
            }
                
            // Login y pantallazo luego de hacerlo
            await page.type('#username', correoPersonal)
            .then(() => page.type('#password', 'pepito.1234'))
            .then(() => page.click('#loginbtn'))
            
    
            // AGREGANDO COSAS
            
            const [comienzaaqui] = await page.$x("//button[contains(., 'Comienza Aquí')]")
            
            if(comienzaaqui) {
                await comienzaaqui.click()
                await page.waitForSelector('.modal-content', { visible: true })
                .then(() => page.select('#formDateSelect', "today")) 
                const [comenzar] = await page.$x("//button[contains(., 'Comenzar')]")
                
                if(!comenzar) {
                    throw new Error('Button "Comenzar" doesn´t exist')
                } else {
                    await comenzar.click()
                }
                
                const [nologin] = await page.$x("//a[contains(., 'Ingresar')]")
            
                if(nologin) {
                    await nologin.click()
                    .then(() => page.type('#username', correoPersonal))
                    .then(() => page.type('#password', 'pepito.1234'))
                    .then(() => page.click('#loginbtn'))
                    
                }
                
                await page.click('.button btn btn-primary certificadod')
                .then(() => page.click('[type="submit"]'))
                .then(() => page.click('.btn btn-primary'))
                
        
                
            }
            

            // Se espera que dentro de la page se encuentre el botón que en su interior tiene el texto "Comienza Aquí"
            const text = await page.evaluate(() => document.body.innerHTML)
            expect(text).toContain('Todavía no se define')
            
            
            // Luego de esto hacemos un logout para poder acceder a la siguiente iteración sin problemas
            await page.goto('https://onlinedev.uai.cl/' + environment + '/login/logout.php')
            .then(() => page.click('[type="submit"]'))

            }
        )
    })
})

// ***** Termina el Test *****//