/**
*
* @package por definir
* @subpackage por definir
* @copyright 2017-onwards Universidad Adolfo Ibanez
* @author José Villar <ernesto.jaramillo@uai.cl>
*/
// Ambiente, ruta y tiempo estimado para el test
var environment = ''
var idcohorte = 2292
var route = '/local/uaio/'
// Creamos una instancia de Date que usaremos para crear un número que no se repita
var now = new Date()
var datenumber = now.getFullYear().toString()
                    + now.getMonth().toString()
                    + now.getDate().toString()
                    + now.getHours().toString()
                    + now.getMinutes().toString()
                    + now.getSeconds().toString()
var institutionalemail = 'INSTITUTIONAL' + datenumber + '@alumnos.uai.clde'
var differentinstitutionalemail = 'differentINSTITUTIONAL' + datenumber + '@alumnos.uai.clde'
var otherinstitutionalemail = 'otherINSTITUTIONALL' + datenumber + '@alumnos.uai.clde'
var personalemail = 'PERSONAL' + datenumber + '@gmail.test'
var differentpersonalemail = 'differentPERSONAL'+ datenumber + '@gmail.test'
var otherpersonalemail = 'otherPERSONAL' + datenumber + '@gmail.test'

// Rut generado de forma random solo para testeo
var rut = () => {   
                            var randomnumber = ''
                            for(var i = 0; i < 8; i++){
                                randomnumber += getRandomInt(0, 9).toString()
                            
                            }
                            randomnumber += '-' + getRandomInt(0, 9).toString()
                            return randomnumber
                        }
// Arreglo con los distintos casos a probar
// Posiciones de cada fila del arreglo: 
// [0] = correo institucional   [5] = id de cohorte
// [1] = corre persona          [6] = rut
// [2] = nombre de la cohorte   [7] = nombre
// [3] = nombre del programa    [8] = apellido
// [4] = id de postulación                                

const userCases = [ //Usuario que tiene información de su nombre y apellido por postulacionid
                    [institutionalemail, personalemail,'Cohorte', 'Programa', 71615, idcohorte, rut(), "NombreApellido", "PorPostulacion" + datenumber],
                    //ninguno de los dos correos existe, por lo que crea usuario "nombre apellido"
                    [differentinstitutionalemail, differentpersonalemail, 'Cohorte', 'Programa', 234567891, idcohorte, rut(), "Usuario", "CorreosNoExisten"+ datenumber],
                    //existe correo institucional
                    [institutionalemail, otherpersonalemail, 'Cohorte', 'Programa', 2345678912, idcohorte, rut(), "Correo", "InstitucionaExiste" + datenumber] ,
                    //existe correo personal
                    [otherinstitutionalemail, personalemail, 'Cohorte', 'Programa', 2345678913, idcohorte, rut(), "Correo", "PersonalExiste" + datenumber] ,
                    //existen ambos correos
                    [institutionalemail, personalemail, 'Cohorte', 'Programa', 2345678914, idcohorte, rut(), "AmbosCorreos", "Existen" + datenumber]
                    ]

const url = 'https://onlinedev.uai.cl' + environment + '/login/index.php'

// ***** Comienza el Test *****//

//Test para comprobar que una id de matrícula sea la misma en caso de que uno de sus correos sea el mismo
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
                var urlcreateuser = 'https://onlinedev.uai.cl' + environment + route + 'createuser.php?usuarioid=' + correoPersonal
                                        + '&correo='+correoInstitucional + '&cohorteid=' + cohorteid + '&rut=' + rut + '&nombre=' + nombre 
                                        + '&apellido=' +apellido
                // Si la url no contiene alguno de los parametros solicitados, entonces termina todo y manda la excepción
                let parametersuser = correoInstitucional.length > 0 
                                    && correoPersonal.length > 0 
                                    && cohorteid != ''
                                    && rut != ''
                                    && nombre.length > 0
                                    && apellido.length > 0
                if (!parametersuser) {
                    throw "Please provide needed parameters into the link"
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
    
    //Test para comprobar que los 
    describe("Verify matricula ID", () => {
        // Arreglos que se usarán para verificar existencia de usuarios ya registrados previamente
        var institutionalarray = []
        var personalarray = []
        var idmatriculasarray = []
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
                let parametersmatricula = correoInstitucional.length > 0 
                                            && correoPersonal.length > 0 
                                            && cohorteid != ''
                                            && nombre_cohorte.length > 0
                                            && nombre_programa.length > 0
                                            && postulacionid != ''
                if (!parametersmatricula) {
                    throw "Please provide URLMATRICULA as a first argument"
                } else {
                    
                    await page.goto(urlmatricula)
                    .then(() => page.screenshot({path: 'imagenes/matricula/Step2_' + rut + '.png'}))
                    //Transformamos el json que entrega createoc.php a un objeto javascript
                    var jsobject = await page.evaluate(() => {
                                    return JSON.parse(document.querySelector("body").innerText)})
                    //Asignamos el id de matrícula a matriculaid
                    var matriculaid = jsobject.id.toString()
                    // Booleano que devolverá verdadero si es que el correo institucional de la presente iteración existe
                    var institutionalinarray = institutionalarray.includes(correoInstitucional)
                    // Booleano que devolverá verdadero si es que el correo personal de la presente iteración existe
                    var personalemailinarray = personalarray.includes(correoPersonal)
                    // Booleano que devolverá verdadero si el id de la matrícula de la presente iteración existe
                    var idmatriculainarray = idmatriculasarray.includes(matriculaid)
                    // Si alguno de los correos existe previamente, entonces esperamos que su ID de matrícula ya exista
                    if(institutionalinarray || personalemailinarray) {
                        
                        expect(idmatriculainarray).toBe(true)
                    } else {
                        // Si no se encuentra el correo en los arreglos, espero que el id de matrícula sea distinto
                        expect(idmatriculainarray).toBe(false)
                        // De no existir, hacemos un push de los datos de la persona para así verificar con las futuras iteraciones
                        institutionalarray.push(correoInstitucional)
                        personalarray.push(correoPersonal)
                        idmatriculasarray.push(matriculaid)

                    }
                }
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