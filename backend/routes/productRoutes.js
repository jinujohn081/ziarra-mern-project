const express = require("express");
const Product = require("../models/Products");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

//@route POST  /api/products/
// @desc create a new product
// @access private/Admin

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, //Refernce to the admin user who created it.
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("server Error");
  }
});
//@route PUT /api/products/:id
// @desc Update an existing product ID
// @accesss Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Update product fields safely
      product.name = name ?? product.name;
      product.description = description ?? product.description;
      product.price = price ?? product.price;
      product.discountPrice = discountPrice ?? product.discountPrice;
      product.countInStock = countInStock ?? product.countInStock;
      product.category = category ?? product.category;
      product.brand = brand ?? product.brand;
      product.sizes = sizes ?? product.sizes;
      product.colors = colors ?? product.colors;
      product.collections = collections ?? product.collections;
      product.material = material ?? product.material;
      product.gender = gender ?? product.gender;
      product.images = images ?? product.images;
      product.isFeatured = isFeatured ?? product.isFeatured;
      product.isPublished = isPublished ?? product.isPublished;
      product.tags = tags ?? product.tags;
      product.dimensions = dimensions ?? product.dimensions;
      product.weight = weight ?? product.weight;
      product.sku = sku ?? product.sku;

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET/api/products/best-seller
// @desc Retrieve the products with  highest rating
// @access Public

router.get("/best-seller", async (req, res) => {
  try {
    //res.send("this should  work");
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route GET/api/products/new-arrivals
// @desc Retrieve latest 8 products- Creation date
// @access Public

router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

//@route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// @route GET/api/products
// @desc Get all products with optional  query filters
// @access Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;
    let query = {};

    // filter logic

    if (collection && collection.toLowerCase() !== "all") {
      query.collections = {
        $regex: new RegExp(`^${collection}$`, "i"),
      };
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = {
        $regex: new RegExp(`^${category}$`, "i"),
      };
    }

    if (gender) {
      query.gender = {
        $regex: new RegExp(`^${gender}$`, "i"),
      };
    }

    if (material) {
      query.material = {
        $in: material.split(",").map((m) => new RegExp(`^${m}$`, "i")),
      };
    }

    if (brand) {
      query.brand = {
        $in: brand.split(",").map((b) => new RegExp(`^${b}$`, "i")),
      };
    }

    if (size) {
      query.sizes = {
        $in: size.split(","),
      };
    }

    if (color) {
      query.colors = {
        $in: color.split(",").map((c) => new RegExp(`^${c}$`, "i")),
      };
    }

    //sort logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    //fetch products and apply sorting and limiting

    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("server Error");
  }
});
// @route GET/api/products/:id
// @desc Get a single product by ID
// Access Public

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET/api/products/similiar/:id
//@ desc retrieve similar products based on the current products's gendrr and category
// @access Public

router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json("Message:Product not found");
    }

    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
