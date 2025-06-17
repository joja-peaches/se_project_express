const router = require("express").Router();
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors/errors");
const clothingItemRouter = require("./clothingitems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;