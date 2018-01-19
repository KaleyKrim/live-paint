const express = require('express');
const router = express.Router();

const db = require('../models');
const Painting = db.painting;

router.get('/', (req, res) => {
  return Painting.findAll()
  .then(paintings => {
    return res.json(paintings);
  })
  .catch((err) => {
    console.log(err);
  })
});

router.post('/', (req, res) => {
  return Painting.create({
    title: req.body.title,
    data: req.body.data
  })
  .then((painting) => {
    return Painting.findById(painting.id)
    .then((newPainting) => {
      console.log(newPainting);
      return res.json(newPainting);
    })
  })
  .catch((err) => {
    console.log(err);
  })
});

router.put('/:id', (req, res) => {
  let newData = req.body;
  let id = req.params.id;

  return Painting.findById(id)
  .then((painting) => {
    return painting.update(newData, {
      returning: true,
      plain: true
    })
    .then(painting => {
      return res.json(painting);
    })
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = router;