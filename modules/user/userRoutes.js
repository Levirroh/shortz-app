var express = require("express");
var router = express.Router();
const userController = require("./userController");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");
router.get("/register", (req, res) => {
  res.render("register", { title: "Criar Conta" });
});

router.post("/register", userController.register);

router.get("/login", (req, res) => {
  res.render("login", { title: "Entrar" });
});
router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.get("/feed", authMiddleware, async (req, res) => {
  res.render("feed", { title: "Feed | Shortz-App" });
});

router.get("/profile/edit", authMiddleware, async (req, res) => {
  res.render("edit-profile", { title: "Editar Perfil | Shortz-App" });
});

router.post("/profile/edit", authMiddleware, upload.single("profilePicture"), userController.updateProfile);
module.exports = router;
