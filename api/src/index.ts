// Imports
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// Inicializa a aplicação Express
const app = express();
// Definindo a porta em que o servidor irá rodar
const PORT = process.env.PORT || 3006;

// Middleware para parsear JSON nas requisições
app.use(bodyParser.json());
app.use(cors());

// Conectando ao bd MongoDB
mongoose.connect('mongodb://localhost:27017/guestbook', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Esquema de coleção Message
const messageSchema = new mongoose.Schema({
  name: String,
  text: String,
  date: { type: Date, default: Date.now }
});

// Modelo para a coleção Message
const Message = mongoose.model('Message', messageSchema);

// Rota para a página inicial
app.get('/', (req, res) => {
  res.send('Ok');
});

// GET para obter todas as mensagens, ordenadas por data decrescente
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST para submeter uma nova mensagem
app.post('/api/message/submit', async (req, res) => {
  try {
    // Cria uma nova mensagem com os dados recebidos
    const newMessage = new Message({
      name: req.body.name,
      text: req.body.text
    });

    // Salva a mensagem
    const savedMessage = await newMessage.save();

    // Retorna a mensagem salva
    res.status(201).json(savedMessage);
  } catch (error) { // tratamento de erros
    console.error('Failed to submit message', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
