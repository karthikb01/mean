const Post = require("../models/post")

exports.createPost = (req, res, next) => {
    // const post = req.body
    // console.log(post);
    // res.status(201).json({
    //     message : "Post added successfully!"
    // })
    const url = req.protocol + '://localhost:3000'
    // + req.get('host')
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images' + '/' + req.file.filename,
        creator: req.userData.userId
    })
    post.save().then(createdPost => {
        // console.log(result._id);
        res.status(201).json({
            message: "Post added successfully!",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        })

    }).catch(error => {
        res.status(500).json({
            message: "Failed to create a post"
        })
    })
    // console.log(post);

}

exports.updatePost = (req, res, next) => {
    // console.log(req.file);
    let imagePath = req.body.imagePath
    if (req.file) {
        const url = req.protocol + "://localhost:3000/"
        imagePath = url + "images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creatorId: req.userData.userId
    })

    // console.log(post);

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        console.log(result);
        if (result.modifiedCount >= 0) {
            res.status(200).json({
                message: "Updated!",
                // imagePath : 
            })
        } else {
            res.status(401).json({
                message: "Not authorised!!"
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Could not update post"
        })
    })
}

exports.getPosts = (req, res, next) => {
    // const posts = [
    //     {
    //         id: "tcekuwqcvef",
    //         title: "First server post",
    //         content: "Content of the first post"
    //     },
    //     {
    //         id: "asdfjsh",
    //         title: "Second server post",
    //         content: "Content of the second post"
    //     },
    //     {
    //         id: "hmgwsnatg",
    //         title: "Third server post",
    //         content: "Content of the third post"
    //     }
    // ]

    // res.status(200).json({
    //     message: "Post fetched successfully",
    //     posts: posts
    // })
    // console.log(req.query);
    const pageSize = +req.query.pageSize
    const currentPage = +req.query.currentPage
    const postQuery = Post.find()
    let fetchedPosts = undefined
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents
            return Post.countDocuments()
        })
        .then(count => {
            res.status(200).json({
                message: "Post fetched successfully",
                posts: fetchedPosts,
                postsCount: count
            })
        }).catch(error => {
            res.status(500).json({
                message: "Failed to fetch posts"
            })
        })

}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(401).json({
                message: "Post not found!"
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Failed to fetch post"
        })
    })
}

exports.deletePost = (req, res, next) => {
    // console.log(req.params.id);
    Post.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId
    }).then(result => {
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).json({
                message: "Post deleted"
            })
        } else {
            res.status(401).json({
                message: "Not authorised!"
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Failed to delete the post"
        })
    })
}