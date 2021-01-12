/**
*
* @package por definir
* @subpackage por definir
* @copyright 2017-onwards Universidad Adolfo Ibanez
* @author José Villar <ernesto.jaramillo@uai.cl>
*/
// Ambiente, ruta y tiempo estimado para el test
var environment = ''
var idcohorte = 3286
var route = '/local/uaio/'
var nombreCohorte = 'Liderazgo y Gestión de Personas Online'
var nombrePrograma = 'Diplomado Online en Liderazgo y Gestión Personas'
var postulacionId = 82895
// Creamos una instancia de Date que usaremos como nuestro random number
// Así nos aseguramos que el número no se vuelva a repetir
var now = new Date()
var datenumber = now.getFullYear().toString()
                    + now.getMonth().toString()
                    + now.getDate().toString()
                    + now.getHours().toString()
                    + now.getMinutes().toString()
                    + now.getSeconds().toString()
var userrandomnumber = getRandomInt(0,9000)
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
// [0] = correo institucional   [5] = id de cohorte                 [10] = Número de OC
// [1] = corre persona          [6] = rut                           [11] = Tags
// [2] = nombre de la cohorte   [7] = nombre                        [12] = Folio SENCE
// [3] = nombre del programa    [8] = apellido                      [13] = ID de la OC
// [4] = id de postulación      [9] = Booleano de usuario SENCE     [14] = sencecode
const userCases = [ //Usuario que tiene información de su nombre y apellido por postulacionid
                    [institutionalemail, personalemail, nombreCohorte, nombrePrograma, postulacionId, idcohorte, rut(), "Usuario", "SENCE" + datenumber.toString()
                    , 1, 12345678, "TAG-SENCE", 123456789, null, 1237977245]
                    
                    ]
// Contador para acceder al n-esimo subarreglo de la matriz userCases
var counter = 0

const url = 'https://onlinedev.uai.cl' + environment

// ***** Comienza el Test *****//

//Test para comprobar el correcto funcionamiento de los distintos casos de matrículas
describe( 'Test de login SENCE' , () => {
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
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC
                    , tags, foliosence, ocid, sencecode) => {
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
                                        &&apellido.length > 0
                if (!parametersuser) {
                    throw "Please provide needed parameters into the URL CREATE USER"
                } else {
                    await page.goto(urlcreateuser)
                    //.then(() => page.screenshot({path: 'imagenes/matricula/Step1_' + rut + '.png'}))
                }
                
                await page.screenshot({path: 'imagenes/sencelogin/Step1_.png'})
                
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
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC
                    , tags, foliosence, ocid, sencecode) => {
                // Url para insertar la matrícula
                let urlmatricula = 'https://onlinedev.uai.cl' + environment + route + 'matricula.php?usuarioid=' + correoPersonal
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
                .then(() => page.screenshot({path: 'imagenes/sencelogin/Step2_.png'}))
                
                // Se espera que dentro de la page se encuentre el mensaje "creado exitosamente"
                const text = await page.evaluate(() => document.body.innerHTML)
               expect(text).toContain('Log insertado exitosamente')
            }
        )
    })



    describe('Create OCs', () => {
        test.each(userCases) (
            "User %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC
                    , tags, foliosence, ocid, sencecode) => {
                // Link para registrar las OCs
                var urlcreateoc = 'https://onlinedev.uai.cl/' + environment + '/local/uaio/createoc.php?cohorteid=' + cohorteid + '&SENCE=' 
                                    + sence + '&numeroc=' + numeroOC + '&tags=' + tags+'&foliosence='+foliosence + '&sencecode=' + sencecode
                // Si la url no contiene alguno de los parametros solicitados, entonces termina todo y manda la excepción
                // De no ocurrir excepción, entonces el usuario es registrado 
                let parametercreateoc = cohorteid != ''
                                        && sence != ''
                                        && numeroOC != ''
                                        && foliosence != ''
                                        
                if (!parametercreateoc) {
                    throw "Please provide needed parameters into the URL: CREATE OC"
                } else {
                    // De no tener error accedemos a la url y se espera que se lance el mensaje "se creo la orden de compra exitosamente"
                    await page.goto(urlcreateoc)
                    await page.screenshot({path: 'imagenes/sencelogin/Step3_.png'})
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
                // Aumentamos el contador para pasar al siguiente usuario
                counter++
                
            }
        )
    })



     // Test para ver si se asigna el usuario a una OC de manera exitosa
    describe('Assign User to OC', () => {
        test.each(userCases) (
            "User %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido, sence, numeroOC
                    , tags, foliosence, ocid, sencecode) => {

               
                // url para asignar usuario a una OC
                var urlassignuser ='https://onlinedev.uai.cl/' + environment + '/local/uaio/usertooc.php?username=' + correoInstitucional
                                    + '&ocid=' + ocid
                
                
                let parametersassignuser = correoInstitucional.length > 0 
                                            && correoPersonal.length > 0 
                                            && cohorteid != ''
                                            && ocid != ''

            
                if (!parametersassignuser) {

                    throw "Please provide needed parameters into the URL: ASSIGN USER"
                } else {
                    // De no existir erro vamos a la url para asignar el usuario a la OC y sacamos screenshot para visualizar
                    await page.goto(urlassignuser)
                    await page.screenshot({path: 'imagenes/sencelogin/Step4_.png'})
                }
                // Se espera el mensage "asignado exitosamente" para dar por exitosa la iteración
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('asignado exitosamente')

            }
        )
    })




    describe("login normal", () => {
        test.each(userCases) (
            "User %p CorreoPersonal %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido) => {
                
                await page.goto(url)
                .then(() => page.waitForSelector('[id="id_username"]'))
                .then(() => page.type('[id="id_username"]', correoInstitucional))
                .then(() => page.click('[id="id_submit"]'))
                .then(() => page.screenshot({path: 'imagenes/sencelogin/Step5_.png'}))
                // .then(() => page.waitForSelector('[id="id_password"]'))
                // .then(() => page.type('[id="id_password"]', 'pepito.1234'))
                // .then(() => page.click('[id="id_submit"]'))
                
                
            }, 70000
        
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