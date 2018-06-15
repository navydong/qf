import React from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs'
import path from 'path'
import Skeleton from './Skeleton.jsx'

var html = ReactDOMServer.renderToStaticMarkup( <Skeleton /> )

var templatePath = path.resolve(__dirname, '../../public/index.html')
console.log(templatePath)

fs.readFile(templatePath, 'utf-8', (err, data) => {
    if (err) throw err
    var newhtml = data.replace('<!-- skeleton -->', html)
    fs.writeFile(templatePath, newhtml, 'utf-8', (err)=>{
        if(err) throw err
        console.log('success')
    })
})