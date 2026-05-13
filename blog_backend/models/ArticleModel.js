import {Schema,model,Types} from 'mongoose'

const commentSchema=new Schema({
	user:{
		type:Types.ObjectId,
		ref:"User",
		required:[true,"user ID is required"]
	},comment:{
		type:String,
		required:[true,"this field is required"]
	}
})
const ArticleSchema=new Schema({
    author:{
		type:Types.ObjectId,
		ref:"User",
		required:[true,"author ID is required"]
	},
	title:{
		type:String,
		required:[true,"title is required"],
	},
	category:{
		type:String,
		required:[true,"category is required"],
	},
	content:{
		type:String,
		required:[true,"content is required"],
	},
	comments:[commentSchema],
	isArticleActive:{
     type:Boolean,
	 default:true
}
},{timestamps:true,
	versionKey:false,
	strict:"throw"
})

//create article model
export const ArticleModel=model("Article",ArticleSchema)
