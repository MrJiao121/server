
const mongoose = require('../db/index.js')
const trophySchema = new mongoose.Schema({
  type: {
    type: String,
    required: false,
    enum: ['bronze', 'silver', 'gold','platinum','diamond','star','king',""]
  },
  finishMedal: { type: Boolean, default: false },
  count: {
    type: Number,
    min: 0
  },

});


module.exports = mongoose.model('trophy',trophySchema);