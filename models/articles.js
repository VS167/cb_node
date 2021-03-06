var mongoose    =   require("mongoose");
mongoose.Promise = global.Promise;

// create instance of Schema
var Schema =   mongoose.Schema;
// create schema
var articleSchema  = new Schema ({
	nameId: { type : String , unique : true, required : true, dropDups: true },
	category: String,
	subCategory: String,
	header : String,
    content : String,
	source: String,
	originalLink : String,
	imageUrl : String,
	sendDefault: Boolean
});
// create model if not exists.
module.exports = mongoose.model('articles', articleSchema);