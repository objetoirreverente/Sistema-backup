//Algoritmo que faz backup de arquivos e os armazena em uma pasta especifica dependendo da data atual

//Os arquivos do backup devem estar na mesma pasta do script. Ele não será incluso no backup.


// Import the filesystem module 
const fs = require('fs');
const path = require('path'); 
const date = new Date();
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
	'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const anoAtual = date.getFullYear();
const mesAtual = months[date.getMonth()];
const diaAtual = date.getDate();


var filesArr = [];


function groupFiles(){
	filesArr = [];
	fs.readdir(__dirname, (err, files) => { 
		if (err) 
			console.log(err); 
		else{ 
    		for(var i = 0; i<files.length;i++){
    			if(files[i] != 'backup' && files[i] != 'sist.js' && files[i] != 'back.bat' && files[i] != '.git'){filesArr.push(files[i]);}
    		}
        
		} 	
	});
} 
groupFiles();


//Tenta acessar a pasta backup
fs.access('./backup/', (error) =>{
	if(error){
		 //Se não existe, a pasta sera criada pela primeira vez
    	fs.mkdir('./backup/', (error) =>{		
        	if(error){
				console.log(error);
	    	}
	    	else{
	    		fs.mkdir('./backup/' + anoAtual, (error) =>{		
	    			if(error){
		    			console.log(error);
	       			}
	       			else{
    					fs.mkdir('./backup/' + anoAtual + '/' + mesAtual, (error) =>{		
	    					if(error){
		    					console.log(error);
	       					}
	       		    		else{
	     						fs.mkdir('./backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual, (error) =>{		
	             					if(error){
		    	    					console.log(error);
	       	       					}
	                				else{
	     		    					console.log('diretorio do mes de' + mesAtual + ' e do dia ' + diaAtual + ' criados :)');
	     		    					filesArr.forEach(fn =>{
                                			copy(fn, './backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual);
                    	        		});
	            	        		}
            	        		});
	                		}
                		});
            		}
        		});
	  		}
	 	});
	}
	else{
		//a pasta backup existe
		//Caso vire o ano, uma nova pasta do ano sera criada:
		fs.mkdir('./backup/' + anoAtual, (error) =>{
			if(error){
				//Porem, se a pasta do ano ja existe, cria pasta do mes.
			    fs.mkdir('./backup/' + anoAtual + '/' + mesAtual, (error) =>{
			    	if(error){
				    	//Se a pasta do mes ja existe. Cria dia atual
			    		fs.mkdir('./backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual, (error) =>{
			    			if(error){
				    			//Se essa pasta ja existe. Reescreva
	    						console.log('Esse diretorio ja existe e sera reescrito');
	    						fs.rmSync('./backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual, { recursive: true, force: true });
	    						groupFiles();

        	   					fs.mkdir('./backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual, (error) =>{
        							if (error){
        								console.log(error);
        							} 
        							else{
	     								filesArr.forEach(fn =>{
                							copy(fn, './backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual);
                	   					});
        		    				}
        						});
							}
	       					else{
	       						//Se a pasta nao existe, crie e copie os arquivos para ela
	     						console.log('diretorio do dia ' + diaAtual + ' criado :)');
	     						filesArr.forEach(fn =>{
                					copy(fn, './backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual);
                				});
	       					}
		       			});
					}
		       });
			}
			else{
			    //Se a pasta do ano foi criada, crie também a pasta do mes
			    fs.mkdir('./backup/' + anoAtual + '/' + mesAtual, (error) =>{
			    	if(error){
			    		//Se a pasta do mes ja existe, crie a pasta do dia e copie os arquivos
			    		fs.mkdir('./backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual, (error) =>{
	     					console.log('diretorio do dia ' + diaAtual + ' criado :)');
	     					filesArr.forEach(fn =>{
                				copy(fn, './backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual);
                			});
			    		});
			    	}
			    	else{
			    		//Se a pasta do mes foi criada, crie tambem a pasta do dia e copie os arquivos
			    		fs.mkdir('./backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual, (error) =>{
	     					console.log('diretorio do dia ' + diaAtual + ' criado :)');
	     					filesArr.forEach(fn =>{
                				copy(fn, './backup/' + anoAtual + '/' + mesAtual + '/' + diaAtual);
                			});
			    		});
			    	}
			    });	  
			}
		});      
	}
});

function copy(file, newPath){
	fs.readFile(file, (err, data) =>{
		const filenoext = file.slice(file.indexOf(path.extname(file)), file.length);
		const enovodir = newPath ? newPath + '/' + file : filenoext + 'copia' + path.extname(file);
	
        fs.stat(file, (error, stats) =>{
        	if(error) throw error;
        	else{
        		if(stats.isDirectory(file)){
        			fs.cp(__dirname + '/' + file, __dirname + '/' + enovodir, {recursive: true}, (error) =>{
        				if(error) throw error;
        				else{console.log('Backup do arquivo ' + file + ' criado');}
        			});
        		}
        		else{
        			const typeData = path.extname(file) != ('.txt' && "") ? data : data.toString();
    				fs.writeFile(enovodir, typeData, (err) =>{
    					if (err){
             				console.log(err);
    					} 
    					else console.log('Backup do arquivo ' + file + ' criado')
    				});
        		}
        	}

        });

	});
}

