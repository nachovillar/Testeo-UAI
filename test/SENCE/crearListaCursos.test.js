const url = 'https://onlinedev.uai.cl/'

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
    
    
    
    test("añadiendo cursos a lista",
        async() => {
            
            await page.goto(urlUAIO)
            
            .then(() => page.waitForSelector('[id="id_username"]'))
            .then(() => page.type('[id="id_username"]', 'joseignacio.villarg@gmail.com'))
            .then(() => page.click('[id="id_submit"]'))
            .then(() => page.waitForSelector('[id="id_password"]'))
            .then(() => page.type('[id="id_password"]', 'Uncharted1'))
            .then(() => page.click('[id="id_submit"]'))
            .then(() => page.goto('https://onlinedev.uai.cl/admin/tasklogs.php?logid=7556807'))
        
            .then(() => page.screenshot({path: 'imagenes/SENCE/Step0.png'}))
            
            var HTML = await page.evaluate(() => document.body.innerHTML)
            var arr = Array.prototype.slice.call(HTML, 0)
            var string = arr.join('')
            var listaCursos = string.split('\n')
            listaCursos.shift()
            
            for(var i = 0; i < 4; i++) {
                listaCursos.pop()
            }
            
            
            var filesystem = require('fs')
            
            filesystem.writeFile('SENCE/Jsons/listaCursos.txt', listaCursos, function(err){
                if(err){
                    console.log("Pencil")
                }
            })
            
            
    })
})