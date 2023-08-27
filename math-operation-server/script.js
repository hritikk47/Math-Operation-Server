// Simple Equation
// const express = require('express');
// const app = express();

// // Initialize an array to store the history
// const history = [];

// app.get('/math/:operation/:a/:b', (req, res) => {
//   const operation = req.params.operation;
//   const a = Number(req.params.a);
//   const b = Number(req.params.b);

//   let result;

//   switch (operation) {
//     case 'add':
//       result = a + b;
//       break;
//     case 'subtract':
//       result = a - b;
//       break;
//     case 'multiply':
//       result = a * b;
//       break;
//     case 'divide':
//       result = a / b;
//       break;
//     default:
//       res.status(400).send('Invalid operation');
//       return;
//   }

//   // Add the operation and result to the history
//   history.push({ operation, a, b, result });
  
//   // If history length exceeds 20, remove the oldest entry
//   if (history.length > 20) {
//     history.shift();
//   }

//   res.status(200).send(result.toString());
// });

// // Endpoint to get the history
// app.get('/history', (req, res) => {
//   res.status(200).json(history);
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });




//WITHOUT BODMAS

// const express = require('express');
// const app = express();

// const history = [];

// function calculateExpression(tokens) {
//   let result = parseFloat(tokens[0]);

//   for (let i = 1; i < tokens.length; i += 2) {
//     const operator = tokens[i];
//     const operand = parseFloat(tokens[i + 1]);

//     switch (operator) {
//       case 'plus':
//         result += operand;
//         break;
//       case 'minus':
//         result -= operand;
//         break;
//       case 'into':
//         result *= operand;
//         break;
//       case 'over':
//         result /= operand;
//         break;
//     }
//   }

//   return result;
// }

// app.get('/', (req, res) => {
//   const expression = req.query.expr;

//   if (!expression) {
//     res.status(400).send('Expression parameter missing');
//     return;
//   }

//   const tokens = expression.split('/');

//   if (tokens.length % 2 === 0) {
//     res.status(400).send('Invalid expression');
//     return;
//   }

//   const result = calculateExpression(tokens);

//   history.push({ expression, result });

//   if (history.length > 20) {
//     history.shift();
//   }

//   res.status(200).send(result.toString());
// });

// app.get('/history', (req, res) => {
//   res.status(200).json(history);
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });



// //WITH BODMAS
const express = require('express');
const app = express();

const history = [];

function calculateExpression(tokens) {
  const precedence = {
    'plus': 1,
    'minus': 1,
    'into': 2,
    'over': 2,
  };

  const outputQueue = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      outputQueue.push(parseFloat(token));
    } else if (token in precedence) {
      while (
        operatorStack.length &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop(); // Pop the '('
    }
  }

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop());
  }

  const evalStack = [];

  for (const token of outputQueue) {
    if (typeof token === 'number') {
      evalStack.push(token);
    } else {
      const b = evalStack.pop();
      const a = evalStack.pop();
      switch (token) {
        case 'plus':
          evalStack.push(a + b);
          break;
        case 'minus':
          evalStack.push(a - b);
          break;
        case 'into':
          evalStack.push(a * b);
          break;
        case 'over':
          evalStack.push(a / b);
          break;
      }
    }
  }

  return evalStack[0];
}

app.get('/', (req, res) => {
  const expression = req.query.expr;

  if (!expression) {
    res.status(400).json({ error: 'Expression parameter missing' });
    return;
  }

  const tokens = expression
    .replace(/ /g, '')
    .split(/(\+|\-|\*|\/|\(|\))/)
    .filter(token => token !== '');

  const result = calculateExpression(tokens);
  const question = expression;
  
  history.push({ question, answer: result });

  if (history.length > 20) {
    history.shift();
  }

  res.status(200).json({ question, answer: result });
});

app.get('/history', (req, res) => {
  res.status(200).json(history);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});