const Item = require("../models/clothingitem");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  DEFAULT_ERROR_STATUS_CODE,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        res.status(403).send({ message: "Forbidden" });
      } else {
        res.send(item);
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const unlikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("ID not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.statusCode) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
