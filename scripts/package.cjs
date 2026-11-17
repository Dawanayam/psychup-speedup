// Dependency-free ZIP (stored entries, CRC32). Only extension/ is shipped.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),base=path.join(root,'extension');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]).sort();}
function crc(data){let n=0xffffffff;for(const b of data){n^=b;for(let k=0;k<8;k++)n=(n>>>1)^((n&1)?0xedb88320:0);}return(n^0xffffffff)>>>0;}
let offset=0;const local=[],central=[];
for(const f of walk(base)){
 const name=Buffer.from(path.relative(base,f).split(path.sep).join('/')),data=fs.readFileSync(f),sum=crc(data);
 const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(33,12);h.writeUInt32LE(sum,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(name.length,26);
 local.push(h,name,data);
 const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);h.copy(c,6,4,30);c.writeUInt32LE(offset,42);central.push(c,name);offset+=h.length+name.length+data.length;
}
const directory=Buffer.concat(central),end=Buffer.alloc(22),count=central.length/2;
end.writeUInt32LE(0x06054b50);end.writeUInt16LE(count,8);end.writeUInt16LE(count,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
const zip=Buffer.concat([...local,directory,end]),version=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'))).version;
const out=path.join(root,'dist');fs.mkdirSync(out,{recursive:true});const name='psychup-speedup-'+version+'.zip';
fs.writeFileSync(path.join(out,name),zip);fs.writeFileSync(path.join(out,'SHA256SUMS.txt'),crypto.createHash('sha256').update(zip).digest('hex')+'  '+name+'\n');console.log(name+' ('+zip.length+' bytes)');

