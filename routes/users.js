const router = require("express").Router();
const auth = require("../middleware/auth");
const { validateUpdateUserBody } = require("../middleware/validation");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUserBody, updateProfile);

module.exports = router;