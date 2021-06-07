const mongoose = require("mongoose");

// url to database
const url = process.env.MONGODB_URI; // mongoDB URI as env variable

// connect to database
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

// specify DB shape and date types
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

// modify all instances of the models produced with noteSchema
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// constructor compiled from schema created before, export CommomJS format
module.exports = mongoose.model("Note", noteSchema);