const express = require("express");
require('dotenv').config()
const app = express();  
const PORT = process.env.PORT || 4000;
const connectdb= require('./models/connectDb')
const Person = require('./models/Person')
const { mongo } = require("mongodb");
// const { ObjectID } = require("bson");
ObjectID = require('mongodb').ObjectId,
app.use(express.json())
//connect to mongodb database 
connectdb();


//Create and Save a Record of a Model:
app.post("/mongoose-model", (req, res) => {
  var p = new Person({name:req.body.name,
  age:req.body.age, favoriteFoods:req.body.favoriteFoods});
  p.save()
 .then((result)=> res.send(result)) 
    .catch((err)=>console.error(err));

});

//Create Many Records with model.create()
app.post("/create-many-people", (req, res) => {
  const y= req.body
   Person.create(y)
 .then((result)=> res.send(result)) 
    .catch((err)=>console.error(err));

});

 //Use model.find() to Search Your Database
app.post('/Find-by-name', function (req, res) {
  var Name = req.body.name;
  

  Person.find({name: Name},  function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  })
});

 // Use model.findOne() to Return a Single Matching Document from Your Database
app.post('/Find-one-by-food', function (req, res) {
  var FavouriteFood = req.body.favoriteFoods;
  

  Person.findOne({favoriteFoods: FavouriteFood},  function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  })
});

  //Use model.findById() to Search Your Database By _id
// app.post('/Find-by-id/:id', function (req , res) {
//   var id = req.params.id;       
//   var fetched_id = new ObjectID(id);
//   console.log(good_id);

//   Person.findOne({_id:fetched_id},  function(err, Person) {
//     if(err) return next(err);
//     if(Person) return res.send(Person);
//   })
// });
  

app.get('/Find-by-id', function (req, res) {
  var fetchedID = req.body._id;
  

  Person.findOne({_id: fetchedID},  function(err, Person) {
    if(err) return next(err);
    if(Person) return res.send(Person);
  })
});

 //Perform Classic Updates by Running Find, Edit, then Save
app.put('/Find-Edit', function (req, res){
  const personId = req.body._id;
   const foodToAdd = "hamburger";
   
   Person.findById({_id: personId})
   
   .then((result) => {
       console.log(res)
   result.favoriteFoods.push(foodToAdd)
   console.log('your favouriteFoods is updated successfully')
        result.save()
        res.send(result)
    
        })
        .catch((err) => console.log(err))
  
  });

   //Perform New Updates on a Document Using model.findOneAndUpdate()
    app.put('/Find-One-Update', function (req, res){

  
      var personName = req.body.name;
      var ageToSet = 20;
       Person.findOneAndUpdate(
         {"name": personName},
          {$set: {"age":ageToSet}},
          {new : true},
      
          function(err, Person) {
          if(err) return next(err);
          if(Person) return res.send(Person);
        }
      )});

  //Delete One Document Using model.findByIdAndRemove
  app.delete('/Find-By-Id-Remove', function (req, res){
    var personId = req.body._id;
     Person.findByIdAndRemove({_id: personId},  function(err, Person) {
        if(err) return next(err);
        if(Person) return res.send(Person);
      })
    });

  //MongoDB and Mongoose - Delete Many Documents with model.remove()
  app.delete('/Find-Remove', function (req, res){
    var person_Name = 'Mary'
    Person.remove({name: person_Name},  function(err, Person) {
        if(err) return next(err);
        if(Person) return res.send(Person);
      })
    
    });

  //Chain Search Query Helpers to Narrow Search Results
  app.post('/FindSort',function (req, res){
    const chainSearch = "Cake";
       Person.find({ favoriteFoods: chainSearch })
      .sort({ name: 1 })
      .limit(2)
      .select({age:0})
      .exec((err, Person) =>
        err
          ? next(err)
          : res.send(Person)
      )
    
    })
  
//port
app.listen(PORT, () => console.log(`server started on port ${PORT}`));

