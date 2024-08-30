//atualizar o texto da task


//1 requirewss
const exports = require('express')
const mysql2 = require('mysql2')
const cors = require('cors')

const mysql_config = require('./inc/mysql_config')
const functions = require('./inc/function')

//2 criação de duas constantes para a verificação da disponibilidade da api e tambem da versão da API

const API_AVAILABILITY=true
const  API_VERSION='4.0.0'

//2iniciar o server
const app = exports()
app.listen(3000,()=>{
    console.log('API executando')
})

app.use((res,res,next)=>{
    if(API_AVAILABILITY){
        next();
    }else{
        res.json(functions.response('atenção','API esta em manutenção. Sinto muito',0,null))
    }
})

const connection=mysql.createConection(mysql_config)


app.use(cors())

//tratamento dos post params
app.use(json());
//instrução que pede que o express trate os dados com json

app.use(express.urlencoded({extended: true}));
//quando é enviado um pedido atravéz do método post, os dados enviados
//atraves de um formulário podem ser interpretados
//SEM ESSES DOIS MIDLEWARE NÃO SERIA POSSIVEL BYSCAR OS PARÂMETRO


//rotas 







//7 rotas
//rota inicial que vai dizer que a API esta disponivel
app.get('./',()=>{
    res.json(functions.response('sucesso','API esta rodando',0,null))
}) 

//9 rota para pegar todas as tarefas
app.get('/tasks',(req,res)=>{
    connection.querry('SELECT * FROM tasks',(err,rows))
})


//10 rota para pegar a task pelo id
app.get('/tasks/:id',(req,res)=>{
    const id=req.params.id
    connection.querry('SELECT * FROM tasks WHERE id=?'[id],(err,rows)=>{
        if(err){
            //devolver os dados da task
            if(rows.lenght>0){
                res.json(functions.response('sucesso','Sucesso na pesquisa',rows.lenght,rows))
            }
            else{
                res.json(functions.response('Atenção','Não foi possivel encontrar a task solicitada',0,rows))
            }
        
        }
        else{
            res.json(functions.response('error',err.message,0,null))
        }
        })
})

//11 atualizar o status de uma task .metodo put

app.put('/tasks/:id/status/status',(req,res)=>{
    const id=req.params.id;
    const status=req.params.status
    connection.querry('UPDATE tasks SET status =? WHERE id =?',(status,id),(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('sucesso','sucesso na lateração do status',rows.affectedRows,null))
            }
            else{
                res.json(functions.response('atenção','task não encontrada',0,null))
            }

        }
        else{
            res.json(functions.response('Erro',err.message,0,null))
        }
    })
})


//rotas para deletar uma tarefa
app.delete('/tasks/:id/delete', (req,res)=>{
    const id = req.params.id;
    connection.quarry('DELETE FROM task WHERE id=?',[id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('Sucessp','Task deletada',rows.affectedRows,null))
            }
            else{
                res.json(functions.response('Atenção','Task n-jao encotrada',0,null))
            }
        }else{
            res.json(functions.response('Erro',err.message,0,null))
        }
    })
})

//rota para inserir uma nova task
//o texto da task sera enviado atravez do body

app.put('/tasks/ :id/update',(req,res)=>{
    const id = req.params.id;
    const post_data = req.body;
    //checar se os dados estão vazios
    if(post_data==undefined){
        res.json(functions.response('atenção','sem dados para uma nova task',0,null))
        return
    }
    //checar se os dados são validos
    if(post_data.task == undefined || post_data.status == undefined){
        res.json(functions.response('atenção','dados invalidos',0,null))
        return
    }
    //declara as variaveis para recepcionar as informações
    const taks= post_data.task;
    const status= post_data.status;

    //atualização dos dados
    connection.quarry('UPDATE tasks SET task =?, update_at = NOW() WHERE id=?',(task,status,id),
        (err,rows)=>{
            if(!err){
                if(!err){
                    res.json(functions.response('Sucesso','Task atualizada',rows.affectedRows,null))
                }else{
                    res.json(functions.response('Atenção','Task não encontrada',rows.affectedRows,null))
                }
            }else{
                res.json(functions.response('Erro',err.message,0,null));
            }
        }
    )
})

app.put('/tasks/create',(req,res)=>{
    //midLware para a recepção dos dados da tarefa(Task)

    //pegando os dados da request
    const post_data = req.body;


    //checar para ver se não estamos sem vazia
    if(post_data==undefined){
        res.json(dunctions.response('Atenção','Sem dados de uma task',0,null))
        return;
    }
    const taks= post_data.task;
    const status= post_data.status;


    //inserindo nova task
    connection.querry('INSERT INTO tasks(task,status,created_At,updated_at) VALUES(?,?,NOW(),NOW()',[task,status],(err,rows)=>{
        if(!err){
            response.json('Sucesso','Task cadastrada com alegria no banco',rows.affectedRows,null)
        }
        else{
            res.json(functions.response('Erro',err.message,0,null))
        }
    })
})












//8 midlaware para caso alguma rota não  sejas encontrada 
app.use((req,res)=>{
    
    res.json(functions.response('atenção','Rota não encontrada',0,null))
})