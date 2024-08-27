const mongoose = require('../db/index.js')

const scoreToTrophySchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true
  },
  trophy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trophy',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
module.exports = mongoose.model('scoreToTrophy',scoreToTrophySchema);