// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const postsRouter = express.Router()

postsRouter.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    }
    catch {
       res.status(500).json({
           message: "The posts information could not be retrieved"
       }) 
    }
})

postsRouter.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body
        if(!title || !contents){
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        }
        else {
            const id = await Post.insert(req.body)
            res.status(201).json({...req.body, id})
        }
    }
    catch {
       res.status(500).json({
           message: "There was an error while saving the post to the database"
       }) 
    }
})

postsRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        else {
            res.status(200).json(post)
        }
    }
    catch {
        res.status(500).json({
            message: "The post information could not be retrieved"
        }) 
    }
})

postsRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, contents } = req.body
        const post = await Post.findById(id)

        if(!title || !contents){
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        }
        else if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        else {
            await Post.update(id, req.body)
            const updatedPost = await Post.findById(id)
            res.status(200).json(updatedPost)
        }
    }
    catch {
        res.status(500).json({
            message: "The post information could not be modified"
        }) 
    }
})

postsRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
 
        if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        else {
            const deletedPost = await Post.remove(id)
            res.status(200).json(post)
        }
    }
    catch {
        res.status(500).json({
            message: "The post could not be removed"
        }) 
    }
})

postsRouter.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const comments = await Post.findPostComments(id)
        if(comments.length === 0) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        else {
            res.status(200).json(comments)
        }
    }
    catch {
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
})

module.exports = postsRouter