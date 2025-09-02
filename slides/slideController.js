const SlideModel = require("../slides/slideModels");

class SlideController {
  static async addSlide(req, res) {
    try {
      const { title, description, buttonText, brand, name, collection } = req.body;

      // multer gives file info in req.file
      const imagePath = req.file ? req.file.filename : null;

      const slideId = await SlideModel.createSlide(
        { title, description, buttonText },
        { brand, name, collection, image: imagePath }
      );

      res.status(201).json({ message: "Slide created", slideId, image: imagePath });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSlides(req, res) {
    try {
      const slides = await SlideModel.getAllSlides();
      res.json(slides);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSlide(req, res) {
    try {
      const slide = await SlideModel.getSlideById(req.params.id);
      if (!slide) return res.status(404).json({ message: "Slide not found" });
      res.json(slide);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}


module.exports = SlideController;
