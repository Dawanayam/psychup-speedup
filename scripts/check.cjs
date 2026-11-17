const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),ext=path.join(root,'extension');
const m=JSON.parse(fs.readFileSync(path.join(ext,'manifest.json')));
assert.equal(m.manifest_version,3);
assert.deepEqual(m.permissions,['activeTab','scripting','storage']);
for(const f of [m.background.service_worker,...m.content_scripts.flatMap(s=>s.js)])assert(fs.existsSync(path.join(ext,f)),f);
for(const [name,hash] of Object.entries(JSON.parse(fs.readFileSync(path.join(root,'UPSTREAM.json'))).sha256)){
 const file=path.join(ext,'modules/speedup',name),data=Buffer.from(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'));
 assert.equal(crypto.createHash('sha256').update(data).digest('hex'),hash,'Shared source drift: '+name);
 assert(!/C:\\\\Users\\\\|gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{32,}/.test(data.toString()),'Private material: '+name);
 if(name.endsWith('.js'))cp.execFileSync(process.execPath,['--check',file]);
}
console.log('PASS manifest, exact shared sources, syntax and basic private-material scan');

