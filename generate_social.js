const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
const mustache = require('mustache');

let template = fs.readFileSync('./social.sbnhtml').toString();

mustache.escape = t => t;

glob(
    './content/**/*.md', { absolute: false },
    (e, files) => {
        if(e !== null)
        {
            console.error(e);
            return;
        }
        files.forEach(f => {
            let cpath = ('/c/' + path.relative("./content", f))
                .replaceAll('.md', '')
                .replaceAll('\\', '/');
            let tpath = '.' + cpath + '.html';
            let content = fs.readFileSync(f).toString();
            let metaRegex = /\<\!\-\-\s(?<meta>.*?)\s\-\-\>/gs;
            let metaResult = metaRegex.exec(content);
            if(metaResult !== null)
            {
                console.log(cpath);
                let model = JSON.parse(metaResult.groups.meta);
                if(!('img' in model))
                {
                    model.img = "social_thumb.jpg";
                }
                model.path = cpath;
                let output = mustache.render(template, model);
                fse.outputFileSync(tpath, output);
            }
        })
    }
);