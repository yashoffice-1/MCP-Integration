// Monday MCP GPT Integration
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

// Load environment variables from .env
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('MCP server running');
});

// POST /mcp route
app.post('/mcp', async (req, res) => {
  const prompt = req.body?.inputFields?.prompt || '';
  let gptResponse = '';

  if (process.env.OPENAI_API_KEY) {
    try {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      });
      gptResponse = completion.data.choices[0].message.content.trim();
    } catch (err) {
      gptResponse = 'Error: ' + (err.response?.data?.error?.message || err.message);
    }
  } else {
    gptResponse = `Echoed: ${prompt}`;
  }

  res.json({
    outputFields: {
      response: gptResponse,
    },
    outputText: gptResponse,
  });
});

app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
}); 