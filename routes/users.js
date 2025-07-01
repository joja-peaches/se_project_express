const router = require("express").Router();
const auth = require("../middleware/auth");
const { validateUserBody } = require("../middleware/validation");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateUserBody, updateProfile);

module.exports = router;