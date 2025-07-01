const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  validateCardBody,
  validateItemIdParam,
} = require("../middleware/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.use(auth);
router.post("/", validateCardBody, createItem);
router.delete("/:itemId", validateItemIdParam, deleteItem);
router.put("/:itemId/likes", validateItemIdParam, likeItem);
router.delete("/:itemId/likes", validateItemIdParam, unlikeItem);

module.exports = router;
