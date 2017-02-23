var mongoose    =   require("mongoose");
mongoose.Promise = global.Promise;

// create instance of Schema
var Schema =   mongoose.Schema;
// create schema
var articleSchema  = new Schema ({
	header : String,
    content : String,
	source: String,
	originalLink : String,
	imageUrl : String
});
// create model if not exists.
module.exports = mongoose.model('articles', articleSchema);