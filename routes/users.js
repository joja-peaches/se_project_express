const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;