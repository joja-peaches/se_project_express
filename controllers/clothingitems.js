const Item = require("../models/clothingitem");
// working branch
const { BadRequestError } = require("../utils/errors/badRequestError");
const { ForbiddenError } = require("../utils/errors/forbiddenError");
const { DefaultError } = require("../utils/errors/defaultError");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      next(new DefaultError("An error has occurred on the server."));
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(new DefaultError("An error has occurred on the server."));
      }
    });
};

const deleteItem = (req, res, next) => {
  Item.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new Error("Forbidden");
      }
      return Item.findByIdAndDelete(req.params.itemId).exec();
    })
    .then((deletedItem) => {
      if (!deletedItem) {
        throw new Error("Item not deleted");
      }
      res.send({ message: "Item deleted" });
    })
    .catch((err) => {
      if (err.name === "Forbidden") {
        next(
          new ForbiddenError("You do not have permission to delete this item.")
        );
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(new DefaultError("An error has occurred on the server."));
      }
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(new DefaultError("An error has occurred on the server."));
      }
    });
};

const unlikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(new DefaultError("An error has occurred on the server."));
      }
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
