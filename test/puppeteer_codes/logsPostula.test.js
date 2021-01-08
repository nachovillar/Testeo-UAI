/**
*
* @package por definir
* @subpackage por definir
* @copyright 2017-onwards Universidad Adolfo Ibanez
* @author José Villar <ernesto.jaramillo@uai.cl>
*/
// Ambiente, ruta y tiempo estimado para el test
var environment = ''
var idcohorte = 2324
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
var differentinstitutionalemail = 'differentINSTITUTIONAL' + datenumber + '@alumnos.uai.cl'
var otherinstitutionalemail = 'otherINSTITUTIONALL' + datenumber + '@alumnos.uai.cl'
var personalemail = 'PERSONAL' + datenumber + '@gmail.com'
var differentpersonalemail = 'differentPERSONAL'+ datenumber + '@gmail.com'
var otherpersonalemail = 'otherPERSONAL' + datenumber + '@gmail.com'

// Arreglo con los distintos casos a probar
// Posiciones de cada fila del arreglo: 
// [0] = correo institucional   [5] = id de cohorte
// [1] = corre persona          [6] = rut
// [2] = nombre de la cohorte   [7] = nombre
// [3] = nombre del programa    [8] = apellido
// [4] = id de postulación      
const userCases = [ //Usuario que tiene información de su nombre y apellido por postulacionid
                    [institutionalemail, personalemail, nombreCohorte, nombrePrograma, postulacionId, 9, rut(), "NombreApellido", "PorPostulacion" + datenumber],
                    //ninguno de los dos correos existe, por lo que crea usuario "nombre apellido"
                    [differentinstitutionalemail, differentpersonalemail, nombreCohorte, nombrePrograma, postulacionId, idcohorte, rut(), "Usuario", "CorreosNoExisten"+ datenumber],
                    //existe correo institucional
                    [otherinstitutionalemail, otherpersonalemail, nombreCohorte, nombrePrograma, postulacionId, 1314, rut(), "Correo", "InstitucionaExiste" + datenumber]
                    ]

const url = 'https://onlinedev.uai.cl' + environment
const urlLogPostula = 'https://onlinedev.uai.cl'+ environment +'/local/uaio/reports/logspostula.php'

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
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido) => {
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
                // Se espera que luego de ingresar al link nos muestre que el usuario fue creado exitosamente
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('Usuario creado')

            }
        )
    })
    //Test para comprobar que los usuarios son matriculados exitosamente
    describe("Create Matricula", () => {
        var postulacion = 0
        // Iteración por cada caso en arreglo userCases
        test.each(userCases) (
            // Para cada caso, mostramos el correo institucional y correo personal en la consola
            "User %p CorreoPersonal %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido) => {
                
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
                .then(() => page.screenshot({path: 'imagenes/matricula/Step2_' + rut + '.png'}))
                
                const text = await page.evaluate(() => document.body.innerHTML)
                
                if(postulacion == 0) {
                    expect(text).toContain('discrepan')
                } else {
                    expect(text).toContain('Log insertado exitosamente')
                }

                postulacion++
            }
        )
    })

    describe("visualización en LogsPostula", () => {
        var postulacion = 0
        test.each(userCases)(
            "User %p correoPersonal %p",
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido) => {
                
                
                
                await page.goto(url)
                
                .then(() => page.type('[id="id_username"]', 'joseignacio.villarg@gmail.com'))
                .then(() => page.click('[id="id_submit"]'))
                .then(() => page.waitForSelector('[id="id_password"]'))
                .then(() => page.type('[id="id_password"]', 'Uncharted1'))
                .then(() => page.click('[id="id_submit"]'))
                
                .then(() => page.goto(urlLogPostula))
                .then(() => page.screenshot({path: 'imagenes/matricula/Step3_' + rut + '.png'}))
                
                const text = await page.evaluate(() => document.body.innerHTML)
                
                
                
                await page.goto('https://onlinedev.uai.cl' + environment + '/login/logout.php')
                .then(() => page.click('[type="submit"]'))
                
                
                postulacion++
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