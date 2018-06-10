const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");

const router = express.Router();

//@route   GET /api/posts/test
//@desc    Tests posts route
//@access  Public
router.get("/test", (req, res) => res.json({ msg: "hey posts" }));

//@route   GET /api/posts
//@desc    Get all the posts
//@access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ msg: "no posts found" }));
});

//@route   GET /api/posts/:id
//@desc    Get post by ID
//@access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ msg: "No post with provided id found" })
    );
});

//@route   POST /api/posts/test
//@desc    Create a new post
//@access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route   POST /api/posts/like:id
//@desc    Like a post
//@access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "You have already liked the post" });
          }
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

//@route   POST /api/posts/unlike:/id
//@desc    Unlike a post
//@access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not liked the post" });
          }
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

//@route   POST /api/posts/comment:id
//@desc    Add comment to post using the post id
//@access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id).then(post => {
      const newComment = {
        text: req.body.text,
        user: req.user.id,
        name: req.body.name,
        avatar: req.body.avatar
      };

      post.comments.unshift(newComment);

      post.save().then(post => res.json(post));
    });
    // .catch(err => res.status(404).json({ postnotfound: "no post found" }));
  }
);

//@route   DELETE /api/posts/comment/:id/:comment_id
//@desc    delete post by ID
//@access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexist: "Comment does not exist" });
        }
        const removeIndex = post.comments
          .map(item => item.user.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ msg: "No post with provided id found" })
      );
  }
);

//@route   DELETE /api/posts/:id
//@desc    delete post by ID
//@access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ unauthorized: "You are not a authorized user " });
          }

          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ msg: "No post with provided id found" })
        );
    });
  }
);

module.exports = router;
