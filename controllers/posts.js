const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Farm = require("../models/Farm");



module.exports = {
   getFeed: async (req, res) => {
    console.log('farmfunction')
    try {     const res = await Map.find({ user: req.user.id });
              const data = await res.json();
              res.render("feed.ejs", { farms: farms, user: req.user })
              const farms = data.data.map(farm => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            farm.location.coordinates[0],
            farm.location.coordinates[1]
          ]
        },
        properties: {
          farmId: farm.farmId,
          icon: 'shop',
        }
      };
    }); 
    loadMap(farms);
    } catch (err) {
      console.log(err, 'getFarmsfaild')
    }
  },
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getShopper: async (req, res) => {
    try {console.log('getShopper')
      const farms = await Farm.find().sort({ createdAt: "desc" }).lean();
      const farmsUser = await Farm.find({ user: req.user.id });
      res.render("shopper.ejs", { farms: farms, farmsUser: farms, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id})
      console.log('comments')
      console.log(`Params.id ${req.params.id}`)
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        farmid: req.body.farmid,
        address: req.body.farmaddress,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};