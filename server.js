const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let tarefasCollection;

async function start() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
    tarefasCollection = client.db('tarefasdb').collection('tarefas');

    // Buscar todas as tarefas
    app.get('/tarefas', async (req, res) => {
      try {
        const tarefas = await tarefasCollection.find().toArray();
        res.json(tarefas);
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar tarefas');
      }
    });

    // Adicionar nova tarefa
    app.post('/tarefas', async (req, res) => {
      try {
        const tarefa = req.body;
        const result = await tarefasCollection.insertOne(tarefa);
        res.status(201).json(result);
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar tarefa');
      }
    });

    // Atualizar tarefa (PATCH)
    app.patch('/tarefas/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        const result = await tarefasCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send('Tarefa não encontrada');
        }
        res.send('Tarefa atualizada com sucesso');
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar tarefa');
      }
    });

    // Excluir tarefa
    app.delete('/tarefas/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await tarefasCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).send('Tarefa não encontrada');
        }
        res.send('Tarefa excluída com sucesso');
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao excluir tarefa');
      }
    });

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro ao conectar no MongoDB', err);
  }
}

start();
