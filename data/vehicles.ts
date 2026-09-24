export type Vehicle = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  category: string;
  horsepower: number;
  acceleration: string;
  transmission: string;
  pricePerDay: number;
  image: string;
};

export const vehicles: Vehicle[] = [
  {
    id: 1,
    slug: "porsche-911",
    brand: "Porsche",
    model: "911 Carrera",
    category: "Performance",
    horsepower: 385,
    acceleration: "4.2 SEC",
    transmission: "Automatic",
    pricePerDay: 18500,
    image: "/images/porsche-911.png",
  },
  {
    id: 2,
    slug: "bmw-m4",
    brand: "BMW",
    model: "M4 Competition",
    category: "Performance",
    horsepower: 503,
    acceleration: "3.9 SEC",
    transmission: "Automatic",
    pricePerDay: 16500,
    image: "/images/bmw-m4.png",
  },
  {
    id: 3,
    slug: "mercedes-amg-gt-63",
    brand: "Mercedes-AMG",
    model: "GT 63",
    category: "Grand Touring",
    horsepower: 577,
    acceleration: "3.2 SEC",
    transmission: "Automatic",
    pricePerDay: 22000,
    image: "/images/amg-gt.png",
  },
];