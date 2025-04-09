const Item = require("../models/clothingitem");

const getItems = (req, res) => {
  console.log("Clothing items in Controllers");
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.status(201).send({data:item});
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  Item.deleteOne({}).then().catch();
};

module.exports = { getItems, createItem, deleteItem };
