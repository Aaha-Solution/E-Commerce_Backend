const SlideModel = require("../slides/slideModels");

class SlideController {
  static async addSlide(req, res) {
    try {
      console.log("Incoming request body:", req.body);
      console.log("Incoming file:", req.file);

      const { title, description, buttonText, brand, name, collection } = req.body;

      // multer gives file info in req.file
      const imagePath = req.file ? req.file.filename : null;
      console.log("Final imagePath to save:", imagePath);

      const slideId = await SlideModel.createSlide(
        { title, description, buttonText },
        { brand, name, collection, image: imagePath }
      );

      console.log("Slide created with ID:", slideId);

      res.status(201).json({ message: "Slide created", slideId, image: imagePath });
    } catch (error) {
      console.error("Error in addSlide:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getSlides(req, res) {
    try {
      console.log("Fetching all slides...");
      const slides = await SlideModel.getAllSlides();
      console.log("Slides fetched:", slides.length);
      res.json(slides);
    } catch (error) {
      console.error("Error in getSlides:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getSlide(req, res) {
    try {
      console.log("📡 Fetching slide with ID:", req.params.id);
      const slide = await SlideModel.getSlideById(req.params.id);
      if (!slide) {
        console.warn("Slide not found for ID:", req.params.id);
        return res.status(404).json({ message: "Slide not found" });
      }
      console.log("Slide fetched:", slide);
      res.json(slide);
    } catch (error) {
      console.error("Error in getSlide:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SlideController;
