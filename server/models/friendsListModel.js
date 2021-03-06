const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendsListSchema = new Schema({
  title: {
    type: String,
    required: true, 
  },
  user: [
    {
      type: String,
      ref: "userModule"
    }
  ],
});

module.exports = mongoose.model('Friend', friendsListSchema);