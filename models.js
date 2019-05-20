"use strict";

const mongoose = require("mongoose");

// this is our schema to represent a post
const blogPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String},
  author: {
    firstName: String,
    lastName: String
  },
  created: {
    type:Date
  }
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
blogPostSchema.virtual('fullName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.author,
    content: this.content,
    title: this.title,
    created: this.created
  };
}
// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const BlogPosts = mongoose.model('BlogPosts', blogPostSchema);

module.exports = {BlogPosts};













