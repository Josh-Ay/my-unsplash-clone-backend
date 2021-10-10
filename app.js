// requiring all the required modules and configuring the port
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 3374;

require('dotenv').config();

// connecting to the database
// mongoose.connect("mongodb://localhost:27017/unsplash-DB")   // LOCAL 
mongoose.connect(`mongodb+srv://admin-ayo:${process.env.PASSWORD}@cluster0.xbul4.mongodb.net/unsplash-DB`)  //AWS


// configuring the express server
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors());


// creating/defining a new schema to be used in the database
const imageSchema = new mongoose.Schema({
    label: String,
    img_url: String
});

// modelling an 'Image' collection to use the 'imagesSchema' above
const Image = mongoose.model("image", imageSchema);



app.get("/images/all", (req, res)=>{   // get all images by last added
    Image.find({}).sort({_id: -1}).exec((err, allImages)=>{
        if(!err){
            res.send(allImages);
        }
    });
});

app.get("/images/image/:id", (req, res)=>{  // get a specific image
    Image.findById({_id: req.params.id}, (err, image)=>{
        if ( (!err) && (image) ){
            res.send(image);
        } else {
            res.status(404).json({"error": "The requested image does not exist on our database."});
        }
        
    });
});

app.get("/images/s/image/:q", (req, res)=>{    // search image by label
    Image.find({label: req.params.q}).sort({_id: -1}).exec((err, imagesFound)=>{
        if (!err) {
            res.send(imagesFound);
        }
    } );
});


app.post("/add", (req, res)=>{  // add a new image(2 inputs): 'label' and 'img_url'
    const {firstInput, secondInput} = req.body;
    const formattedFirstInput = firstInput[0].toUpperCase() + firstInput.slice(1, firstInput.length).toLowerCase();
    const newEntry = new Image({label: formattedFirstInput, img_url: secondInput});
    newEntry.save();

    res.status(200).json({message: "success"});
});

app.post("/delete", (req, res)=>{   // delete an image
    const {id} = req.body;
    Image.findByIdAndDelete({_id: id}, err=>{
        if(!err){
            res.status(200).json({message: "success"});
        }
    })
});

app.listen(port, ()=> { // listening on the appropriate port
    console.log("Server up and running on port "+port);
});
