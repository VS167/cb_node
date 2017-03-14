var mongoose    =   require("mongoose");
mongoose.Promise = global.Promise;

// create instance of Schema
var Schema =   mongoose.Schema;
// create schema
var questionSchema  = new Schema ({
	nameId: { type : String , unique : true, required : true, dropDups: true },
	category: String,
	subCategory: String,
    type: String,
	question : String,
    sendDefault: Boolean,
    options:[{
        option: String
    }]
});
// create model if not exists.
module.exports = mongoose.model('questions', questionSchema);