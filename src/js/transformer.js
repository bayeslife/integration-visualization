//var filename=process.argv[2];



var Rx = require('rxjs/Rx');

var fs = require('fs');

var yargs  = require('yargs')

var strands = require('strands');

var content = strands.strand(" ","","");

var pkg = require('../../package.json');

var argv = process.argv;

var defined_nodes ={};
var referred_nodes ={};


function writenode(json){
  writecontent(json),
  defined_nodes[json.id]=true;
}
function writelink(json){
  writecontent(json),
  referred_nodes[json.source]=true;
  referred_nodes[json.target]=true;
}

function writecontent(json){
  if(typeof json =='object'){
    content(JSON.stringify(json));
    content(',\n');
  }else
    content(json);
}

function renderHierarchy(o){

  writecontent('var exampleNodes = [\n');

  writenode({ type: 'customer-facing-service',id: 'site', parent: null, name: 'site'});
  writenode({ type: 'capability',id: 'Integration', parent: null, name: 'Integration'});
  writenode({ type: 'supplier',id: 'Supplier', parent: 'null', name: 'Supplier'});
  writenode({ type: 'application',id: 'Applications', parent: 'null', name: 'Applications'});
  writenode({ type: 'integration',id: 'DotNet', parent: 'Integration', name: 'DotNet'});
  writenode({ type: 'integration',id: 'Mule', parent: 'Integration', name: 'Mule'});


  o.filter(c => c.type=='Site').subscribe(function(c){
    writenode({ type: 'site',id: c.name, parent: "customer-facing-service", name: c.name })
  })

  o.filter(c => c.type=='Application')
   .subscribe(function(application){
     writenode({ type: 'application',id: application.name, parent: 'Service', name: application.name, min: 4 });
     if(application.apis){
       Rx.Observable.from(application.apis).subscribe(function(api){
         writenode({ type: 'application-api',id: api.name, parent: application.name, name: api.name, min: 4 });

       })
     }
  })

  o.filter(c => c.type=='Supplier')
   .subscribe(function(application){
     writenode({ type: 'supplier',id: application.name, parent: 'Supplier', name: application.name , min: 6 });
     if(application.apis){
       Rx.Observable.from(application.apis).subscribe(function(api){
         writenode({ type: 'supplier-api',id: api.name, parent: application.name, name: api.name, min: 6 });

       })
     }
  })


  o.filter(c => c.type=='WebAPI').subscribe(function(c){
    writenode({ type: 'integration',id: c.name, parent: "Mule", name: c.name, min: 2 })
  })

  o.filter(c => c.type=='DotNetAPI').subscribe(function(c){
    writenode({ type: 'integration',id: c.name, parent: "DotNet", name: c.name, min: 2  })

  })
  o.filter(c => c.type=='SoaAPI').subscribe(function(c){
    writenode({ type: 'integration',id: c.name, parent: "Mule", name: c.name, min: 2  })

  })
  o.filter(c => c.type=='EventProcessor').subscribe(function(c){
    writenode({ type: 'integration',id: c.name, parent: "Mule", name: c.name, min: 2  })
  })

  writecontent('];\n')
}

function renderLinks(o){

  writecontent('\nvar exampleLinks = [')

  o.filter(i => i.type =='EventProcessor')
  .subscribe(function(c){
    writelink({ source: 'openwire',target: c.name, value: 1 });
      if(c.dependencies){
       Rx.Observable.from(c.dependencies).subscribe(function(d){
         writelink({ source: c.name,target: d, value: 1 });
       })
     }
   });

   o.filter(i => i.type =='DotNetAPI' || i.type=='WebAPI' || i.type=='SoaAPI' ||  i.type=='Site')
    .subscribe(function(c){
        if(c.dependencies){
         Rx.Observable.from(c.dependencies).subscribe(function(d){
           writelink({ source: c.name,target: d, value: 1 });
         })
       }
     });


  o.filter(i => i.type =='Application')
   .subscribe(function(a){
     if(a.apis){
       Rx.Observable.from(a.apis).subscribe(function(api){
         if(api.dependencies){
           Rx.Observable.from(api.dependencies).subscribe(function(d){
             writelink({ source: api.name,target: d, value: 1 });
           })
         }
      })
    }
   })

  writecontent('];\n')
}


var args = yargs
    .usage(pkg.description + "\n\n$0 --model [model file] --out [directory] ")
    .version(pkg.version, 'version')
    .demand('o')
    .alias('o', 'out')
    .describe('o', 'Out directory')
    .alias('m', 'model')
    .describe('m', 'Path to model file')
    .parse(argv);

var filename=args['m'];
var outfile=args['o'];

console.log("Source:"+ filename);
console.log("Output:"+ outfile);

fs.readFile(filename,function(err,raw){
  var metadata = JSON.parse(raw);

  var o = Rx.Observable.from(metadata);
  renderHierarchy(o)
  renderLinks(o);

  fs.writeFile(outfile,content.toString());

  for(each in referred_nodes){
    if(!defined_nodes[each]){
      console.log("Missing definition:"+ each);
    }

  }
})
