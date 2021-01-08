/**
*
* @package por definir
* @subpackage por definir
* @copyright 2017-onwards Universidad Adolfo Ibanez
* @author José Villar <ernesto.jaramillo@uai.cl>
*/
// Ambiente, ruta y tiempo estimado para el test
var environment = '/ernesto'
var idcohorte = 20
var idcohorteSence = 2318
var route = '/local/uaio/'

const url = 'https://onlinedev.uai.cl' + environment

// Creamos una instancia de Date que usaremos como nuestro random number
// Así nos aseguramos que el número no se vuelva a repetir
var now = new Date()
var datenumber = now.getFullYear().toString()
                    + now.getMonth().toString()
                    + now.getDate().toString()
                    + now.getHours().toString()
                    + now.getMinutes().toString()
                    + now.getSeconds().toString()

// Rut generado de forma random solo para testeo
var rut = () => {   
                            var randomnumber = ''
                            for(var i = 0; i < 8; i++){
                                randomnumber += getRandomInt(0, 9).toString()
                            
                            }
                            randomnumber += '-' + getRandomInt(0, 9).toString()
                            return randomnumber
                        }
// Correos dinámicos que se usarán en el test
var institutionalemail = 'INSTITUTIONAL' + datenumber + '@alumnos.uai.cl'
var personalemail = 'PERSONAL' + datenumber + '@gmail.com'

// Arreglo con los distintos casos a probar
// Posiciones de cada fila del arreglo: 
// [0] = correo institucional   [5] = id de cohorte                             [10] = Número de OC
// [1] = corre persona          [6] = rut                                       [11] = Folio Sence
// [2] = nombre de la cohorte   [7] = nombre                                    [12] = Tag
// [3] = nombre del programa    [8] = apellido                                  [13] = ID de la Oc
// [4] = id de postulación      [9] = Booleano que indica si es usuario SENCE   [14] = Código SENCE
const userCases = [
                    [institutionalemail, personalemail,'Cohorte', 'Programa', 71615, idcohorte, rut()
                        , "UsuarioConCursoN", "yCursoSence" + datenumber, 1, 123456, 555555, "TAGdeSENCE" , null, 1237991399]]
                        
                // ***** Comienza el Test *****//
describe("Test para comprobar que la plataforma lleva al Login de SENCE luego de asignar una OC de Sence a un usuario", () => {
    
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
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC, foliosence, tags, ocid) => {
                // Url para crear el usuario
                let urlcreateuser = 'https://onlinedev.uai.cl' + environment + route + 'createuser.php?usuarioid=' + correoPersonal
                                        + '&correo='+correoInstitucional + '&cohorteid=' + cohorteid + '&rut=' + rut + '&nombre=' + nombre 
                                        + '&apellido=' +apellido
                // Si la url no contiene alguno de los parametros solicitados, entonces termina todo y manda la excepción
                // De no ocurrir excepción, entonces el usuario es registrado y sacamos la screenshot
                let parametersuser = correoInstitucional.length > 0 
                                        && correoPersonal.length > 0 
                                        && cohorteid != ''
                                        && rut != ''
                                        && nombre.length > 0
                                        && apellido.length > 0
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
        // Iteración por cada caso en arreglo userCases
        test.each(userCases) (
            // Para cada caso, mostramos el correo institucional y correo personal en la consola
            "User %p CorreoPersonal %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC, foliosence, tags, ocid, sencecode) => {
                // Url para insertar la matrícula
                let urlmatricula = 'https://onlinedev.uai.cl' + environment + route + 'addmatricula.php?usuarioid=' + correoPersonal
                                        + '&correo=' + correoInstitucional + '&nombre_cohorte='+nombre_cohorte+'&nombre_programa=' + nombre_programa
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
    
    
    
    describe("Dar comienzo a un curso normal", () => {
        test.each(userCases) (
            "User %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC, foliosence, tags, ocid, sencecode) => {
            
                await page.goto(url)
                // Login
                .then(() => page.type('#id_username', correoPersonal)) 
                .then(() => page.click('#id_submit'))
                .then(() => page.waitFor(300))
                
                .then(() => page.type('#id_password', 'pepito.1234'))
                
                .then(() => page.click('#id_submit'))
                .then(() => page.waitFor(300))
                
                
                //await page.click('[class="btn btn-primary"]')
                
                
                //.then(() => page.waitForSelector('[data-flexitour="container"]', {visible: true}))
                
                //.then(() => page.click('[data-role="end"]'))
                
                const [comienzaAqui] = await page.$x("//button[contains(., 'Comienza Aquí')]")
            
                if(!comienzaAqui) {
                    throw new Error('Button "Comienza Aquí" doesn´t exist')
                    
                } else {
                    await comienzaAqui.click()
                    .then(() => page.waitFor(300))
                    
                }
                
                await page.waitForSelector('.modal-content', { visible: true }) 
                
                .then(() => page.select('#formDateSelect', "today")) 
                
                const [comenzar] = await page.$x("//button[contains(., 'Comenzar')]")
                
                if(!comenzar) {
                    throw new Error('Button "Comenzar" doesn´t exist')
                    
                } else {
                    await comenzar.click()
                    .then(() => page.waitFor(300))
                }
                
                // CODIGO QUE SE DEBE RETIRAR EN STAGING
                
                await page.type('#id_username', correoPersonal)
                .then(() => page.click('#id_submit'))
                .then(() => page.waitFor(300))
                
                .then(() => page.type('#id_password', 'pepito.1234'))
                
                .then(() => page.click('#id_submit'))
                .then(() => page.waitFor(300))
                // ******************* //
                
                
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('Comportamiento del Consumidor')
                
                // Luego de esto hacemos un logout para poder acceder a la siguiente iteración sin problemas
                await page.goto('https://onlinedev.uai.cl' + environment + '/login/logout.php')
                .then(() => page.click('[type="submit"]'))
                
            }, 70000)
    })
    
    
    // Subtest para verificar que las OCs se están creando exitosamente
    describe('Create OCs', () => {
        let counter = 0
        test.each(userCases) (
            "User %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC, foliosence, tags, ocid, sencecode) => {
                // Link para registrar las OCs
                var urlcreateoc = 'https://onlinedev.uai.cl' + environment + '/local/uaio/createoc.php?sencecode=' + sencecode + '&SENCE=' 
                                    + sence + '&numeroc=' + numeroOC + '&tags=' + tags+'&foliosence='+foliosence
                // Si la url no contiene alguno de los parametros solicitados, entonces termina todo y manda la excepción
                // De no ocurrir excepción, entonces el usuario es registrado 
                let parametercreateoc = sence != ''
                                        && numeroOC != ''
                                        && foliosence != ''
                                        && sencecode != ''
                                        && tags.length > 0
                                        
                if (!parametercreateoc) {
                    throw "Please provide needed parameters into the URL: CREATE OC"
                } else {
                    // De no tener error accedemos a la url y se espera que se lance el mensaje "se creo la orden de compra exitosamente"
                    await page.goto(urlcreateoc)
                    
                
                 
                    const text = await page.evaluate(() => document.body.innerHTML)
                    expect(text).toContain('se creo la orden de compra exitosamente.')
                }


                // Transformamos el json que entrega createoc.php a un objeto javascript
                var jsobject = await page.evaluate(() => {
                            return JSON.parse(document.querySelector("body").innerText)})
                // Se damos el valor de la ocid a ocidentifier
                var ocidentifier = jsobject.id.toString()
                // Asignamos la ocid en la que estará cada usuario, con esto se hará de manera dinámica 
                userCases[counter][13] = ocidentifier
                // Aumentamos el contador para pasar al siguiente usuario si es que hubiera
                counter++
            }
        )
    })
    
    // Test para ver si se asigna el usuario a una OC de manera exitosa
    describe('Assign User to OC', () => {
        test.each(userCases) (
            "User %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC, foliosence, tags, ocid, sencecode) => {
                
                // url para asignar usuario a una OC
                var urlassignuser ='https://onlinedev.uai.cl' + environment + '/local/uaio/usertooc.php?username=' + correoInstitucional
                                        + '&ocid=' + ocid
                // Si las url no contienen alguno de los parametros solicitados, entonces termina todo y manda la excepción correspondiente
                // De no ocurrir excepción, entonces el usuario es asignado a la OC
        
                
                let parametersassignuser = correoPersonal.length > 0
                                            && cohorteid != ''
                                            && ocid != ''
                                    
                if (!parametersassignuser) {

                    throw "Please provide needed parameters into the URL: ASSIGN USER"
                } else {
                    // De no existir erro vamos a la url para asignar el usuario a la OC y sacamos screenshot para visualizar
                    await page.goto(urlassignuser)
                    
                }
                // Se espera el mensage "asignado exitosamente" para dar por exitosa la iteración
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('asignado exitosamente')

            }
        )
    })
    
    describe("verificar login Sence", () => {
        test.each(userCases)(
            "User %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC, foliosence, tags, ocid, sencecode) => {
                
                await page.goto(url)
                await page.screenshot({path: 'imagenes/expectSenceLogin/Step_3_'+rut+'.png'})
                
                .then(() => page.type('#id_username', correoPersonal)) 
                .then(() => page.click('#id_submit'))
                .then(() => page.waitFor(300))
                await page.screenshot({path: 'imagenes/expectSenceLogin/Step_3_'+rut+'.png'})
                
                // Se espera el mensage "asignado exitosamente" para dar por exitosa la iteración
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('Inicio Sesión SENCE')
                
                
                
            }
        )
    })
    
})

// ***** Termina el Test *****//

function getRandomInt(min, max) {
       if (max < min) {
           [min, max] = [min, max];
       }

       let range = max - min + 1;
       return Math.floor(Math.random() * range) + min;
}