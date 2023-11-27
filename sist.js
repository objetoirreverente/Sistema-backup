//Algoritmo que faz backup de arquivos e os armazena em uma pasta especifica dependendo da data atual

//Os arquivos do backup devem estar na mesma pasta do script. Ele não será incluso no backup.


// Import the filesystem module 
const fs = require('fs');
const path = require('path'); 
const date = new Date();
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
	'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const mesAtual = months[date.getMonth()];
const diaAtual = date.getDate();


const filesArr = [];

fs.readdir(__dirname, (err, files) => { 
	if (err) 
		console.log(err); 
	else { 
    	for(var i = 0; i<files.length;i++){
    		if(files[i] != 'backup' && files[i] != 'sist.js' && files[i] != 'back.bat'){filesArr.push(files[i]);}
    	}

	} 	
}) 



fs.access('./backup/', (error) =>{
	if(error){
		fs.mkdir('./backup/', (error) =>{		
	    	if(error){
				console.log(error);
	    	}
	    	else{
    			fs.mkdir('./backup/' + mesAtual, (error) =>{		
	    			if(error){
		    			console.log(error);
	       			}
	       		    else{
	     				fs.mkdir('./backup/' + mesAtual + '/' + diaAtual, (error) =>{		
	             			if(error){
		    	    			console.log(error);
	       	       			}
	                		else{
	     		    			console.log('diretorio do mes de' + mesAtual + ' e do dia ' + diaAtual + ' criados :)');
	     		    			filesArr.forEach(fn =>{
                                	copy(fn, './backup/' + mesAtual + '/' + diaAtual);
                    	        });
	            	        }
            	        });
	                }
                });
            }
        });
	}
	else{
    	fs.mkdir('./backup/' + mesAtual + '/' + diaAtual, (error) =>{
	    	if(error){
		    	console.log(error);
	        }
	        else{
	     		console.log('diretorio do dia ' + diaAtual + ' criado :)');
	     		filesArr.forEach(fn =>{
                	copy(fn, './backup/' + mesAtual + '/' + diaAtual);
                });
	        }
        });
	}
})

function copy(file, newPath){
	fs.readFile(file, (err, data) =>{
		const filenoext = file.slice(file.indexOf(path.extname(file)), file.length);
		const typeData = path.extname(file) != '.txt' ? data : data.toString();
		const enovodir = newPath ? newPath + '/' + file : filenoext + 'copia' + path.extname(file);

    	fs.writeFile(enovodir, typeData, (err) =>{
    		if (err) throw err;
    		else console.log('Backup do arquivo ' + file + ' criado')
    	});
	});
}

