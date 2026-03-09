import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductsDetails from "../components/Products/ProductsDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollections from "../components/Products/FeaturedCollections";
import FeatureSection from "../components/Products/FeatureSection";

const placeholderProducts = [
  {
    _id: 1,
    name: "Prodcut 1",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=5",
      },
    ],
  },
  {
    _id: 2,
    name: "Prodcut 2",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=6",
      },
    ],
  },
  {
    _id: 3,
    name: "Prodcut 3",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=7",
      },
    ],
  },
  {
    _id: 4,
    name: "Prodcut 4",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=8",
      },
    ],
  },
  {
    _id: 1,
    name: "Prodcut 1",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=5",
      },
    ],
  },
  {
    _id: 2,
    name: "Prodcut 2",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=6",
      },
    ],
  },
  {
    _id: 3,
    name: "Prodcut 3",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=7",
      },
    ],
  },
  {
    _id: 4,
    name: "Prodcut 4",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=8",
      },
    ],
  },
];

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* best seller */}

      <h2 className="text-3xl text-center font-bold mb-4">Best seller</h2>
      <ProductsDetails />
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for women
        </h2>
        <ProductGrid products={placeholderProducts} />
      </div>
      <FeaturedCollections />
      <FeatureSection />
    </div>
  );
};

export default Home;
