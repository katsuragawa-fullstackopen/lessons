const mongoose = require('mongoose');

// specify DB shape and date types
const noteSchema = new mongoose.Schema({
  content: { type: String, minLength: 5, required: true },
  date: { type: Date, required: true },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// modify all instances of the models produced with noteSchema
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// constructor compiled from schema created before, export CommonJS format
module.exports = mongoose.model('Note', noteSchema);
