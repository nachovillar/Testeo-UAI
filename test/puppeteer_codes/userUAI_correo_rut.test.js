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
                    [institutionalemail, personalemail,'Cohorte', 'Programa', 71615, idcohorte, rut(), "Correo", "Institucional " + datenumber],
                    //ninguno de los dos correos existe, por lo que crea usuario "nombre apellido"
                    [differentinstitutionalemail, differentpersonalemail, 'Cohorte', 'Programa', 234567891, idcohorte, rut(), "Correo", "Personal" + datenumber],
                    //existe correo institucional
                    [institutionalemail, otherpersonalemail, 'Cohorte', 'Programa', 2345678912, idcohorte, rut(), "Rut", "Personal" + datenumber],
                    //existe correo personal
                    [otherinstitutionalemail, personalemail, 'Cohorte', 'Programa', 2345678913, idcohorte, '88888' + rut(), "Pasaporte", "Personal" + datenumber]
                    ]

const url = 'https://onlinedev.uai.cl' + environment

// ***** Comienza el Test *****//

//Test para comprobar el correcto funcionamiento de los distintos casos de matrículas
describe( 'Test New Login' , () => {
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
                    .then(() => page.screenshot({path: 'imagenes/matricula/Step1_' + rut + '.png'}))
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
            async(correoInstitucional, correoPersonal, nombre_cohorte, nombre_programa, postulacionid, cohorteid, rut, nombre, apellido) => {
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
                .then(() => page.screenshot({path: 'imagenes/matricula/Step2_' + rut + '.png'}))
                
                // Se espera que dentro de la page se encuentre el mensaje "creado exitosamente"
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('creado exitosamente')
            }
        )
    })
    
    describe("Test de usuario con correo UAI-correo")
})

function getRandomInt(min, max) {
       if (max < min) {
           [min, max] = [min, max];
       }

       let range = max - min + 1;
       return Math.floor(Math.random() * range) + min;
}
