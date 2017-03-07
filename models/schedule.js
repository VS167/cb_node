var mongoose    =   require("mongoose");
mongoose.Promise = global.Promise;

// create instance of Schema
var Schema =   mongoose.Schema;
// create schema
var scheduleSchema  = new Schema ({
	email: String,
	registrationId: String,
	article: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'articles'
			},
    question: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'questions'
			},
    sendAt: Date
});
// create model if not exists.
module.exports = mongoose.model('schedule', scheduleSchema);