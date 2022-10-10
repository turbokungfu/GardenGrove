const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment")


module.exports = {
  getIndex: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("index.ejs", { posts: posts , user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getAbout: (req, res) => {
    res.render("about.ejs");
  },
  getFront: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("index.ejs", { posts: posts , user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
};
