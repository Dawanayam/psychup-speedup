// Explicit one-way import of the six shared runtime files; --check never writes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const args=process.argv.slice(2),check=args.includes('--check');
const source=path.resolve(args.find(a=>a!=='--check')||path.join(root,'..','psychup-addon','modules','speedup'));
const names=['engine.js','controller.js','widget.js','app.js','index.html','style.css'];
const hashes={};
for(const name of names){
 const data=Buffer.from(fs.readFileSync(path.join(source,name),'utf8').replace(/\r\n/g,'\n'));
 const target=path.join(root,'extension','modules','speedup',name);
 if(check){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8').replace(/\r\n/g,'\n')!==data.toString())throw Error('Drift: '+name);}
 else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data);}
 hashes[name]=crypto.createHash('sha256').update(data).digest('hex');
}
if(!check)fs.writeFileSync(path.join(root,'UPSTREAM.json'),JSON.stringify({project:'Psychup Workspace',module:'modules/speedup',direction:'Psychup -> standalone; explicit sync only',sha256:hashes},null,2)+'\n');
console.log(check?'Shared sources identical':'Six runtime files imported; provenance hashes updated');

