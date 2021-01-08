/**
*
* @package por definir
* @subpackage por definir
* @copyright 2017-onwards Universidad Adolfo Ibanez
* @author José Villar <ernesto.jaramillo@uai.cl>
*/
//
var environment = 'ernesto'
const url = 'https://onlinedev.uai.cl/' + environment + '/login/index.php'
// Creamos una instancia de Date que usaremos como nuestro random number
// Así nos aseguramos que el número no se vuelva a repetir
var date = new Date()
var fecha = date.getFullYear().toString()
                    + date.getMonth().toString()
                    + date.getDate().toString()
                    + date.getHours().toString()
                    + date.getMinutes().toString()
                    + date.getSeconds().toString()
// Tabla con los distintos casos a probar en el test
// Columnas de cada fila en el arreglo:
// [0]:Tipo de caso                             [5]:Número de OC
// [1]:Correo Institucional                     [6]:Rut
// [2]:Correo Personal                          [7]:Tags
// [3]:Id de la Cohorte                         [8]:Folio Sence
// [4]:Booleano que indica si es usuario SENCE  [9]:Id de la OC
var userCases = [   // Caso1: Usuario sin tag
                    ["OC0-sintagUsername", 'institucional0' + fecha + '@uai.cl', 'SenceUser' + fecha + '@gmail.test', 14341, 1, 123456, "10358400-1", "", 12, null],
                    // Caso2: Usuario con 1 tag
                    ["OC1", 'institucional1' + fecha + '@uai.cl', 'SenceUser2' + fecha + '@gmail.test', 14341, 1, 1234567, "11358400-2", "Tag1"+fecha, 123, null],
                    // Caso3: Usuario con 1 tag y distinto al anterior
                    ["OC2", 'institucional2' + fecha + '@uai.cl', 'SenceUser3' + fecha + '@gmail.test', 14341, 1, 12345678, "12358400-3", "Tag2"+fecha, 12345, null],
                    // Caso4: Usuario con 1 tag igual al Caso2
                    ["OC3-1tagrepetido", 'institucional3' + fecha + '@uai.cl', 'SenceUser4' + fecha + '@gmail.test', 14341, 1, 123456789, "13358400-4", "Tag1"+fecha, 1234567, null],
                    // Caso5: Usuario con 2 tag, 1 igual al Caso2 y otra distinta a las anteriores
                    ["OC4-2tag1repetido", 'institucional4' + fecha + '@uai.cl', 'SenceUser5' + fecha + '@gmail.test', 14341, 1, 1234567891, "14358400-5", "Tag4"+fecha+",Tag1"+fecha, 123456789, null],
                    // Caso6: Usuario con 2 tag iguales al Caso2 y Caso3
                    ["OC5-2tagsrepetidos", 'institucional5' + fecha + '@uai.cl', 'SenceUser6' + fecha + '@gmail.test', 14341, 1, 123456789123, "15358400-6", "Tag1"+fecha+",Tag2"+fecha, 12345678991, null],
                    // Caso7: Usiaroo con 2 tags distintas a los otros casos
                    ["OC6-2tagstistintos", 'institucional6' + fecha + '@uai.cl', 'SenceUser7' + fecha + '@gmail.test', 14341, 1, 12345678912345, "1058400-1", "Tag5"+fecha+",Tag6"+fecha, 123456789999, null],
                    // Caso8: Usuario con el mismo rut que el Caso1 y mismo tag que Caso2
                    ["OC7-mismorutOC0", 'institucional7' + fecha + '@uai.cl', 'SenceUser8' + fecha + '@gmail.test', 14341, 1, 123456, "10358400-1", "Tag1"+fecha, 1234, null]
                ]
// Contador para acceder al n-esimo subarreglo de la matriz userCases
var counter = 0
//***** COMIENZA EL TEST *****//
describe( '/ Verificar tags OC y exportación de reporte' , () => {
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
    // Subtest para verificar que las OCs se están creando exitosamente
    describe('Create OCs', () => {
        test.each(userCases) (
            "User %p",
            async(logintype, correoInstitucional, correoPersonal, cohorteid, sence, numeroOC, rut, tags, foliosence, ocid) => {
                // Link para registrar las OCs
                var urlcreateoc = 'https://onlinedev.uai.cl/' + environment + '/local/uaio/createoc.php?cohorteid=' + cohorteid + '&SENCE=' 
                                    + sence + '&numeroc=' + numeroOC + '&tags=' + tags+'&foliosence='+foliosence
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
                 
                    const text = await page.evaluate(() => document.body.innerHTML)
                    expect(text).toContain('se creo la orden de compra exitosamente.')
                }


                // Transformamos el json que entrega createoc.php a un objeto javascript
                var jsobject = await page.evaluate(() => {
                            return JSON.parse(document.querySelector("body").innerText)})
                // Se damos el valor de la ocid a ocidentifier
                var ocidentifier = jsobject.id.toString()
                // Asignamos la ocid en la que estará cada usuario, con esto se hará de manera dinámica 
                userCases[counter][10] = ocidentifier
                // Aumentamos el contador para pasar al siguiente usuario
                counter++
            }
        )
    })
    
    // Test para ver si se asigna el usuario a una OC de manera exitosa
    describe('Assign User to OC', () => {
        test.each(userCases) (
            "User %p",
            async(logintype, correoInstitucional, correoPersonal, cohorteid, sence, numeroOC, rut, tags, foliosence, ocid) => {

                // Url para crear el usuario
                var urlcreateuser = 'https://onlinedev.uai.cl/' + environment + '/local/uaio/createuser.php?usuarioid=' + correoInstitucional
                                        + '&correo='+correoPersonal + '&cohorteid=' + cohorteid + '&rut=' + rut
                // url para asignar usuario a una OC
                var urlassignuser ='https://onlinedev.uai.cl/' + environment + '/local/uaio/usertooc.php?usuarioid=' + correoPersonal
                                        + '&correo=' + correoInstitucional + '&cohorteid=' + cohorteid + '&ocid=' + ocid
                // Si las url no contienen alguno de los parametros solicitados, entonces termina todo y manda la excepción correspondiente
                // De no ocurrir excepción, entonces el usuario es registrado y asignado a la OC
                let parameterscreateuser = correoInstitucional.length > 0 
                                            && correoPersonal.length > 0 
                                            && cohorteid != ''
                                            && rut != ''
                
                let parametersassignuser = correoInstitucional.length > 0 
                                            && correoPersonal.length > 0 
                                            && cohorteid != ''
                                            && ocid != ''
                                    
                if (!parameterscreateuser) {

                    throw "Please provide needed parameters into the URL: CREATE USER"
                } else {
                    // De no existir error, vamos a la url y se crea el usuario
                    await page.goto(urlcreateuser)
                }

            
                if (!parametersassignuser) {

                    throw "Please provide needed parameters into the URL: ASSIGN USER"
                } else {
                    // De no existir erro vamos a la url para asignar el usuario a la OC y sacamos screenshot para visualizar
                    await page.goto(urlassignuser)
                    //await page.screenshot({path: 'imagenes/oc/Step_2_'+logintype+'.png'})
                }
                // Se espera el mensage "asignado exitosamente" para dar por exitosa la iteración
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain('asignado exitosamente')

            }
        )
    })

    
    describe('check OC report', () => {
        
        test.each(userCases) (
            "User %p",
            async(logintype, correoInstitucional, correoPersonal, cohorteid, sence, numeroOC, rut, tag, foliosence, ocid) => {
                // Arreglo que contendrá los distintos tags al momento de que le entreguemos más de uno por filtro
                var tagarray = []
                
                if (!url) {
                    throw "Please provide URL as a first argument"
                }
                
                await page.goto(url)
                // Si aparece el botón Salir en alguna de las iteraciones, entonces lo presionamos para confirmar que cerramos sesión
                const [salirbutton] = await page.$x("//button[contains(., 'Salir')]")
                if (salirbutton) {
                    await salirbutton.click()
                }
                // Login 
                await page.type('#username', 'joseignacio.villarg@gmail.com')
                .then(() => page.type('#password', 'Uncharted1$'))
                .then(() => page.screenshot({path: 'imagenes/oc/Step_4_' + logintype + '.png'}))
                .then(() => page.click('#loginbtn'))
                                
                await page.goto('https://onlinedev.uai.cl/' + environment + '/local/uaio/reports/grades.php?group=0')
                // Filtramos
                .then(() => page.waitFor('[placeholder="Buscar"]',{visible:true})) 
                .then(() => page.type('[placeholder="Buscar"]', 'UAI Online / Cursos Activos / ONLINE', {delay: 300}))
                .then(() => page.waitFor(300))
                .then(() => page.keyboard.press('Enter'))
                .then(() => page.waitFor(300))
                // Los 4 tabs son para ubicarnos en el filtro de Tags
                for(var i = 0; i < 4; i++) {
                    
                    await page.keyboard.press('Tab')
                }
                // Si tenemos más de un tag en el input, entonces hacemos el arreglo de tags y vamos ingresando uno por uno
                if(tag.includes(',')){
                    tagarray = tag.split(',')
                    for(var count = 0; count < tagarray.length; count++) {
                        
                        await page.keyboard.type(tagarray[count], {delay: 300})
                        .then(() => page.waitFor(300))
                        .then(() => page.keyboard.press('Enter'))
                        .then(() => page.waitFor(300))
                        // Borramos los caracteres para poder ingresar el siguiente tag del array en la próxima iteración
                        for (var character = 0; character < tagarray[count].length; character++) {
                        
                            await page.keyboard.press('Backspace')
                        }
                        
                    }
                } else {
                    // De tener solo un Tag lo ingresamos y nada más
                    await page.keyboard.type(tag)
                    .then(() => page.waitFor(300))
                    .then(() => page.keyboard.press('Enter'))
                    .then(() => page.waitFor(300))
                    
                }
                // Hacemos Click para recibir el reporte con los filtros anteriormente ingresados
                
                await page.click('[aria-controls="id_filter"]')
                .then(() => page.waitFor(300))
                
                .then(() => page.click('[value="Obtener Reporte"]'))
                .then(() => page.waitFor(300))                                 
                //.then(() => autoScroll(page))
                .then(() => page.screenshot({path: 'imagenes/oc/Step_4_' + logintype + '.png'}))
                 
                const text = await page.evaluate(() => document.body.innerHTML)
                expect(text).toContain(correoPersonal)
                
                await page.goto('https://onlinedev.uai.cl/' + environment + '/login/logout.php')
                .then(() => page.click('[type="submit"]'))
                
            }, 80000
        )
    })
})

// Función que sirve para hacer scroll en la página
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0
            var distance = 100
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance

                if(totalHeight >= scrollHeight){
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        })
    })
}


