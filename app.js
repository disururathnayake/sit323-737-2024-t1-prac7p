const express= require("express");
const app= express();
const fs = require('fs');
const winston = require('winston');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error", err));


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
    new winston.transports.Console({
    format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level:
   'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
   });
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  const Calculation = mongoose.model("Calculation", {
    type: String,
    input1: Number,
    input2: Number,
    result: Number,
    timestamp: { type: Date, default: Date.now },
  });
const add= (n1,n2) => {
    return n1+n2;
}

const subtract= (n1,n2) => {
    return n1-n2;
}

const multiply= (n1,n2) => {
    return n1*n2;
}

const divide= (n1,n2) => {
    return n1/n2;
}



app.get("/add", async(req, res) => {
    try {
        const num1 = parseFloat(req.query.num1); 
        const num2 = parseFloat(req.query.num2); /

        if (isNaN(num1)) {
            logger.error("num1 is incorrectly defined");
            throw new Error("num1 incorrectly defined");
        }
        if (isNaN(num2)) {
            logger.error("num2 is incorrectly defined");
            throw new Error("num2 incorrectly defined");
        }

        const result = add(num1, num2);

    logger.info(`Parameters ${num1} and ${num2} received for addition`);

    
    await Calculation.create({
      type: "add",
      input1: num1,
      input2: num2,
      result
    });
    console.log("🔁 ADD endpoint hit");

    res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error.toString()); 
        res.status(500).json({statuscode: 500, msg: error.toString()}); 
    }
});

app.get("/subtract", async(req, res) => {
    try {
        const n1 = parseFloat(req.query.num1); 
        const n2 = parseFloat(req.query.num2); 

        if (isNaN(n1)) {
            logger.error("num1 is incorrectly defined");
            throw new Error("num1 incorrectly defined");
        }
        if (isNaN(n2)) {
            logger.error("num2 is incorrectly defined");
            throw new Error("num2 incorrectly defined");
        }

        logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for subtract');
        const result = subtract(n1, n2);
await Calculation.create({
  type: "subtract",
  input1: n1,
  input2: n2,
  result
});

        res.status(200).json({statuscode: 200, data: result}); 
    } catch (error) {
        logger.error(error.toString()); 
        res.status(500).json({statuscode: 500, msg: error.toString()}); 
    }
});

app.get("/multiply", async(req, res) => {
    try {
        const n1 = parseFloat(req.query.num1); 
        const n2 = parseFloat(req.query.num2); 

        if (isNaN(n1)) {
            logger.error("num1 is incorrectly defined");
            throw new Error("num1 incorrectly defined");
        }
        if (isNaN(n2)) {
            logger.error("num2 is incorrectly defined");
            throw new Error("num2 incorrectly defined");
        }

        logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for multiply');
        const result = multiply(n1, n2);
await Calculation.create({
  type: "multiply",
  input1: n1,
  input2: n2,
  result
});

        res.status(200).json({statuscode: 200, data: result}); 
    } catch (error) {
        logger.error(error.toString()); 
        res.status(500).json({statuscode: 500, msg: error.toString()}); 
});

app.get("/divide", async(req, res) => {
    try {
        const n1 = parseFloat(req.query.num1); 
        const n2 = parseFloat(req.query.num2); 

        if (isNaN(n1)) {
            logger.error("num1 is incorrectly defined");
            throw new Error("num1 incorrectly defined");
        }
        if (isNaN(n2)) {
            logger.error("num2 is incorrectly defined");
            throw new Error("num2 incorrectly defined");
        }

        logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for divide');
        const result = divide(n1, n2);
await Calculation.create({
  type: "divide",
  input1: n1,
  input2: n2,
  result
});

        res.status(200).json({statuscode: 200, data: result}); 
    } catch (error) {
        logger.error(error.toString());
        res.status(500).json({statuscode: 500, msg: error.toString()}); 
    }
});

app.get("/history", async (req, res) => {
    console.log("✅ /history route was hit");
    try {
      const history = await Calculation.find().sort({ timestamp: -1 });
      res.status(200).json({ statuscode: 200, data: history });
    } catch (error) {
      console.error("❌ Error fetching history:", error);
      res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
  });
  

  app.put("/calculation/:id", express.json(), async (req, res) => {
    try {
      const { result } = req.body;
      const updated = await Calculation.findByIdAndUpdate(
        req.params.id,
        { result },
        { new: true }
      );
      res.status(200).json({ statuscode: 200, data: updated });
    } catch (error) {
      res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
  });

  app.delete("/calculation/:id", async (req, res) => {
    try {
      await Calculation.findByIdAndDelete(req.params.id);
      res.status(200).json({ statuscode: 200, msg: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
  });
const port=3040;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
})