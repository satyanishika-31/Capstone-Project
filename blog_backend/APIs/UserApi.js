import exp from 'express'
import mongoose from 'mongoose'
import { verifyToken } from '../middleware/VerifyToken.js'
import { ArticleModel } from '../models/ArticleModel.js'
export const userApp = exp.Router()

const ensureDbConnected = (res) => {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({message:"Database is not connected. Check DB_URL and restart the backend."})
        return false
    }

    return true
}

userApp.get("/articles",verifyToken("USER"),async(req,res)=>{
    if (!ensureDbConnected(res)) return
    //read articles
    const articlesList=await  ArticleModel.find({isArticleActive:true}).populate("author","firstName lastName email")
    //send res
    res.status(200).json({message:"articles",payload:articlesList})
})

userApp.get("/article/:id",verifyToken("USER","AUTHOR"),async(req,res)=>{
    if (!ensureDbConnected(res)) return
    const article=await ArticleModel.findById(req.params.id)
        .populate("author","firstName lastName email")
        .populate("comments.user","email firstName lastName")

    if(!article){
        return res.status(404).json({message:"Article not found"})
    }

    res.status(200).json({message:"article",payload:article})
})

//!xxs and csrf work on it  cross side scripting   crf-cross site resouse fortuin 
//adding commint to the article
userApp.put("/articles",verifyToken("USER"),async(req,res)=>{
    if (!ensureDbConnected(res)) return
    //get body from req
    const {articleId,comment} = req.body
    //chck article
    const articleDocument = await ArticleModel.findOne({_id:articleId,isArticleActive:true})

    if(!articleDocument){
        return res.status(404).json({message:"Article not found"})
         
    }
    //get user id
    const userId=req.user?.id
    articleDocument.comments.push({user:userId,comment:comment})
    await articleDocument.save()

    const updatedArticle = await ArticleModel.findById(articleId)
        .populate("author","firstName lastName email")
        .populate("comments.user","email firstName lastName")

    res.status(200).json({message:"the comment added sucessfully",payload:updatedArticle})

})
