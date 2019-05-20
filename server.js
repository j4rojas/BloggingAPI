'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const {BlogPosts} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

//get

app.get('/posts', (req, res) => {
    BlogPosts
      .find()
      .then(posts => {
        res.json({
          posts: posts.map(
            (post) => restaurant.serialize())
        });
      })
      .catch(
        err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
      });
  });

  // can also request by ID
app.get('/posts/:id', (req, res) => {
    BlogPosts
      .findById(req.params.id)
      .then(post =>res.json(post.serialize()))
      .catch(err => {
        console.error(err);
          res.status(500).json({message: 'Internal server error'})
      });
  });

  //post

  app.post('/restaurants', (req, res) => {

    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
  //create

    BlogPosts
      .create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        })
      .then(
        post => res.status(201).json(post.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
  });

 //update single posts by id 

app.put('/posts/:id', (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    // we return here to break out of this function
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPosts
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//delete with find and remove method

app.delete('/posts/:id', (req, res) => {
    BlogPosts
      .findByIdAndRemove(req.params.id)
      .then(() => res.status(204).end())
      .catch(err => res.status(500).json({message: 'Internal server error'}));
  });


