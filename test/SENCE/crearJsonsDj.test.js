
const url = 'https://lce.sence.cl/CertificadoAsistencia/'
const urlUAIO = 'https://onlinedev.uai.cl/'
const urlJson = 'https://lce.sence.cl/CertificadoAsistencia/DetalleAccion/ParticipantesList?jtStartIndex=0&jtPageSize=10&jtSorting=Rut%20ASC'
const rut = '193225071'
const pass = 'Pepito1234'

var fs = require('fs')
var cursos
var listaCursos  = fs.readFile('SENCE/Jsons/listaCursos.txt', 'utf8', (err, data)=> {
                                    if (err) {
                                        throw new Error(err)
                                    }
                        
                                    cursos = data.split(',')
                                    console.log(cursos)
                                    return cursos
                    })
            



describe("Extraer Json de cursos", () => {
    let page

    beforeEach(
        async () => {
            page = await global.__BROWSER__.newPage()
            await page.setViewport({width: 1920, height: 1080})
            await page.setUserAgent('UA-TEST')
        }
    )

    afterAll(
        async () => {
          await page.close()
        }
    )
    

    
    describe("Iteración por curso", () => {
        test.each(listaCursos) (
            "Curso %p",
            async(curso) => {
                
                await page.goto(url)
                .then(() => page.click('[type="submit"]'))
                .then(() => page.screenshot({path: 'imagenes/SENCE/Step1_' + curso + '.png'}))
            
                .then(() => page.type('[placeholder="RUT Usuario"]', rut))
                .then(() => page.type('#ClaveSence', pass))
                .then(() => page.click('[type="submit"]'))
                .then(() => page.waitForSelector('[id="cmbPerfiles"]'))
                
                .then(() => page.select('[id="cmbPerfiles"]', '73'))
                .then(() => page.waitFor(300))
                .then(() => page.waitForSelector('[id="cmbInstituciones"]'))
                .then(() => page.select('[id="cmbInstituciones"]', '71543200'))
                .then(() => page.click('#Rbtn_Destino_2'))
                .then(() => page.click('#btnSeleccionar'))
                .then(() => page.screenshot({path: 'imagenes/SENCE/Step2_' + curso + '.png'}))
                .then(() => page.waitFor(300))
                .then(() => page.waitForSelector('[id="FilterTipoPrograma"]'))
                .then(() => page.waitFor(300))
                
                .then(() => page.select('[id="FilterTipoPrograma"]', '3'))
                .then(() => page.select('[id="FilterTipobusqueda"]', '1'))
                .then(() => page.type('[placeholder="ID Acción"]', curso))
                
                .then(() => page.click('#btnBusquedaCursos'))
                .then(() => page.waitForSelector('[id="btnCerrarGrilla"]'))
                
                
                
                    
                .then(() => page.waitForSelector('[title="Declaración Emitida"]')) 
                .then(() => page.waitFor(300))
                .then(() => page.click('[title="Declaración Emitida"]')) 
                
            
                .then(() => page.evaluate( ()=> {
                    const urlJson = 'https://lce.sence.cl/CertificadoAsistencia/DetalleAccion/ParticipantesList?jtStartIndex=0&jtPageSize=10&jtSorting=Rut%20ASC'
                    return fetch(urlJson, {method: 'POST', body: ''})
                    .then(res => res.json())
                })). then(data => {
                    
                        var filesystem = require('fs')
                        filesystem.writeFile('SENCE/Jsons/' + curso.toString() + '.json', JSON.stringify(data), function(err){
                            if(err){
                                console.log("Pencil")
                            }
                        })
                    
                })
                    
            
                    
                
                
                    
                
            }, 70000
        )
    })
    
    
    
})




