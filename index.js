const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snwbd1q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const recipeCollection = client.db('Recipe-Collection').collection('recipeData');

        // post api 
        app.post('/postRecipe', async (req, res) => {
            const recipeDataStore = req.body;
            const result = await recipeCollection.insertOne(recipeDataStore)
            res.send(result)
        });

        // get api
        app.get('/getRecipe', async (req, res) => {
            const result = await recipeCollection.find().toArray();
            res.send(result)
        })

        // get single api 

        app.get('/getRecipe/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await recipeCollection.findOne(query);
            res.send(result)
        })

        // update api
        app.put('/updateRecipe/:id', async (res, res) => {
            const id = req.params.id;
            const update = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const data = {
                $set: {
                    name: update.name,
                    ingredients: update.ingredients,
                    instruction: update.instruction

                }
            }
            const result = await recipeCollection.updateOne(query, data, options);
            res.send(result)
        })

        // delete api
        app.delete('/deleteRecipe/:id',async(req,res)=>{
            const id = req.params.id;
            const query= {_id: new ObjectId(id)};
            const result=await recipeCollection.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Recipe server Is running')
})
app.listen(port, () => {
    console.log(`Recipe is server running on port: ${port}`)
})