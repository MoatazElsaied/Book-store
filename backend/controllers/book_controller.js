const bookModel = require("../models/book_model");
const fs = require("fs");
const path = require("path");

class Book {
  static allBooks = async (req, res) => {
    try {
      const books = await bookModel.find();
      res.status(200).send({ success: true, data: books });
    } catch (e) {
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };
  static singleBook = async (req, res) => {
    try {
      const book = await bookModel.findById(req.params.bookId);
      res.status(200).send({ success: true, data: book });
    } catch (e) {
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };
  static addBook = async (req, res) => {
    try {
      const data = JSON.parse(req.body.data);
      const book = new bookModel({ image: req.file.filename, ...data });
      await book.save();
      res.status(200).send({ success: true, data: book });
    } catch (e) {
      console.log(e);
      if (req.feile)
        fs.unlinkSync(path.join(__dirname, "../images/" + req.file.filename));
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };

  static updateBook = async (req, res) => {
    const bookId = req.params.bookId;
    try {
      let imageChanged = false;
      const data = JSON.parse(req.body.data);
      const book = await bookModel.findById(bookId);
      const prevImg = book.image;
      for (let prop in data) {
        book[prop] = data[prop];
      }
      if (req.file) {
        imageChanged = true;
        book.image = req.file.filename;
      }
      await book.save();
      if (imageChanged)
        fs.unlinkSync(path.join(__dirname, "../images/" + prevImg));
      res.status(200).send({ success: true, data: book });
    } catch (e) {
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };
  static deleteBook = async (req, res) => {
    const bookId = req.params.bookId;
    try {
      const book = await bookModel.findById(bookId);
      const prevImg = book.image;
      await book.remove();
      fs.unlinkSync(path.join(__dirname, "../images/" + prevImg));
      res.status(200).send({ success: true, msg: "deleted successfully" });
    } catch (e) {
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };
}

module.exports = Book;
