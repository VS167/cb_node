var mongoose    =   require("mongoose");
mongoose.Promise = global.Promise;

// create instance of Schema
var Schema =   mongoose.Schema;
// create schema
var scheduleQuesSchema  = new Schema ({
	email: String,
	registrationId: String,
	question: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'questions'
			},
    sendAt: Date
});
// create model if not exists.
module.exports = mongoose.model('scheduleQues', scheduleQuesSchema);