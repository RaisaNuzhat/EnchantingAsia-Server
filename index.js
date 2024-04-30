const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//  middlewares
app.use(cors())
app.use(express.json())

const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9odt6wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
      const database = client.db("touristDB");
      const spotsCollection = database.collection("spots");
      app.get('/spots',async(req,res) =>
      {
          const cursor = spotsCollection.find()
          const result = await cursor.toArray()
          res.send(result)
      })
      app.get('/spots/:id',async(req,res) =>
      {
          const id = req.params.id
          const query = {_id: new ObjectId(id)}
          const result = await spotsCollection.findOne(query)
          res.send(result)
      })
      // email filtering
      app.get('/spot/:email',async(req,res) =>
      {
          console.log(req.params.email)
          const result = await spotsCollection.find({email: req.params.email}).toArray()
          console.log(result)
          res.send(result)
      })
       app.put('/spot/:id',async(req,res) =>
      {
          const id = req.params.id
          const filter = {_id: new ObjectId(id)}
          const options ={upsert : true}
          const updatedspot = req.body
          const updated = {
            $set:{
                spotname:updatedspot.spotname,
                countryname:updatedspot.countryname,
                image:updatedspot.image,
                location:updatedspot.location,
                description:updatedspot.description,
                cost:updatedspot.cost,
                traveltime:updatedspot.traveltime,
                season:updatedspot.season,
                totalvisitors:updatedspot.totalvisitors
            }
          }
          const result = await spotsCollection.updateOne(filter,updated,options)
          res.send(result)
      })

      app.post('/spots',async(req,res) =>
      {
          const spot = req.body
          console.log('new spot',spot)
          const result = await spotsCollection.insertOne(spot);
          res.send(result)
      })
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      //await client.close();
    }
  }
  run().catch(console.dir);
  
  
  app.get('/',(req,res) =>
  {
      res.send('SIMPLE CRUD IS RUNNNING')
  })
  
  app.listen(port , ()=>
  {
      console.log(`simple crud is running on port:${port}`)
  })