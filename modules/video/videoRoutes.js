var express = require("express");
var router = express.Router();
const videoController = require("./videoController");
const authMiddleware = require("../../middlewares/auth");
const uploadVideo = require("../../middlewares/videoMulter"); // Importa o Multer para vídeos

// Rota para exibir o formulário de upload de vídeo (protegida por autenticação)
router.get("/upload", authMiddleware, (req, res) => {
  res.render("upload", { title: "Upload de Vídeo | Shortz-App" });
});

// Rota para processar o upload de vídeo (protegida por autenticação)
router.post("/upload", authMiddleware, uploadVideo.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]), videoController.uploadVideo);

router.get("/video/:id/stream", videoController.streamVideo);

router.get("/feed", authMiddleware, async (req, res) => {
  try {
    // Busca todos os vídeos, incluindo as informações do usuário que os publicou
    const videos = await videoController.getAllVideos();
    console.log(videos);
    res.render("feed", { title: "Feed | Shortz-App", videos });
  } catch (error) {
    console.error("Erro ao carregar o feed:", error);
    req.flash("error", "Erro ao carregar o feed de vídeos.");
  }
});

router.get("/video/:id", videoController.renderVideoPage);

module.exports = router;