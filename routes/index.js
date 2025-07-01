const router = require("express").Router();
const { NotFoundDataError } = require("../utils/errors/notFoundDataError");
const clothingItemRouter = require("./clothingitems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const { validateLoginBody, validateUserBody } = require("../middleware/validation");

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res, next) => {
  next(new NotFoundDataError("The requested resource was not found."));
});

module.exports = router;