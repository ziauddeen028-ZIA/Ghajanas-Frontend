import type { Product } from '../types';

export const products: Product[] = [
  // --- SWEETENERS ---
  {
    id: 'prod-naatu-sakkarai',
    name: 'Pure Organic Naatu Sakkarai (Country Sugar)',
    tamilName: 'இயற்கை நாட்டு சர்க்கரை',
    slug: 'pure-organic-naatu-sakkarai',
    categoryId: 'sweeteners',
    categoryName: 'Naatu Sakkarai & Vellam',
    shortDescription: '100% natural, unbleached, and chemical-free sugarcane brown sugar rich in minerals and iron.',
    description: 'Our traditional Naatu Sakkarai is crafted using heirloom sugarcane varieties cultivated in the Bhavani river basin of Erode. Extracted without sulfur or chemical clarifiers, it preserves native molasses, giving it an earthy caramel aroma and vital micronutrients. Perfect substitute for white sugar in tea, coffee, baby foods, and traditional sweets.',
    benefits: [
      'Zero refined chemicals, no bone-char or sulfur used',
      'Naturally rich in Iron, Calcium, and Potassium',
      'Aids digestion and purifies blood naturally',
      'Pleasant aromatic sweetness with low glycemic load'
    ],
    origin: 'Erode, Tamil Nadu',
    rating: 4.9,
    reviewCount: 328,
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'ns-500g', label: '500 g', price: 65, originalPrice: 75, inStock: true, stockCount: 150 },
      { id: 'ns-1kg', label: '1 kg', price: 120, originalPrice: 145, inStock: true, stockCount: 220 },
      { id: 'ns-5kg', label: '5 kg (Saver Pack)', price: 575, originalPrice: 700, inStock: true, stockCount: 45 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: true,
    badge: 'Bestseller',
    nutritionHighlights: {
      'Iron': '2.4 mg / 100g',
      'Calcium': '80 mg / 100g',
      'Processing': 'Cold Clarified',
      'Preservatives': 'Zero'
    }
  },
  {
    id: 'prod-karupatti-palm-jaggery',
    name: 'Authentic Udangudi Karupatti (Palm Jaggery)',
    tamilName: 'உடன்குடி பனை கருப்பட்டி',
    slug: 'authentic-udangudi-karupatti-palm-jaggery',
    categoryId: 'sweeteners',
    categoryName: 'Naatu Sakkarai & Vellam',
    shortDescription: 'Original Udangudi palm jaggery made from unfermented palmyra sap without adulteration.',
    description: 'Directly sourced from traditional palm climbing artisans in Udangudi, Tuticorin. Made by slow boiling pure padhaneer in heavy brass cauldrons until it sets into dense, dark, nutrient-dense blocks. Packed with medicinal properties, ideal for Sukku Kaapi (ginger coffee) and postpartum nourishment.',
    benefits: [
      'Rich in vitamin B-complex and essential dietary minerals',
      'Effective traditional remedy for cough, throat relief & breathing vitality',
      'Extremely low glycemic index compared to normal cane sugars',
      'Pure single-origin harvest from coastal Palmyra palms'
    ],
    origin: 'Udangudi, Tamil Nadu',
    rating: 4.95,
    reviewCount: 214,
    images: [
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'kp-250g', label: '250 g', price: 95, originalPrice: 110, inStock: true, stockCount: 80 },
      { id: 'kp-500g', label: '500 g', price: 180, originalPrice: 210, inStock: true, stockCount: 120 },
      { id: 'kp-1kg', label: '1 kg', price: 350, originalPrice: 410, inStock: true, stockCount: 65 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: true,
    badge: 'Traditional GI Tagged',
    nutritionHighlights: {
      'Potassium': '1050 mg / 100g',
      'Iron': '11 mg / 100g',
      'Additives': '0% Nil'
    }
  },
  {
    id: 'prod-manda-vellam',
    name: 'Golden Round Jaggery (Urundai Vellam)',
    tamilName: 'உருண்டை வெல்லம்',
    slug: 'golden-round-jaggery-urundai-vellam',
    categoryId: 'sweeteners',
    categoryName: 'Naatu Sakkarai & Vellam',
    shortDescription: 'Traditional round jaggery balls naturally hardened without chemical colors or sodium hydrosulfite.',
    description: 'Golden-amber traditional round jaggery molded with organic okro (ladies finger) plant mucilage as a natural clarifier. Offers the classic rich taste required for festival Sakkarai Pongal, Payasam, Kozhukattai, and daily cooking.',
    benefits: [
      'No artificial yellow colorants or chemical bleaching',
      'Warm and comforting digestion booster after meals',
      'Essential authentic base for festival sweets and sweets',
      'Pure sugarcane juice concentrate'
    ],
    origin: 'Pollachi, Tamil Nadu',
    rating: 4.8,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'mv-500g', label: '500 g', price: 55, originalPrice: 65, inStock: true, stockCount: 90 },
      { id: 'mv-1kg', label: '1 kg', price: 105, originalPrice: 125, inStock: true, stockCount: 140 }
    ],
    isFeatured: false,
    isTopSeller: false,
    isOrganic: true,
    badge: 'Festival Essential'
  },

  // --- TRADITIONAL RICE ---
  {
    id: 'prod-mappillai-samba',
    name: 'Mappillai Samba Traditional Red Rice',
    tamilName: 'மாப்பிள்ளை சம்பா அரிசி',
    slug: 'mappillai-samba-traditional-red-rice',
    categoryId: 'heritage-rice',
    categoryName: 'Traditional Rice',
    shortDescription: 'The legendary "Bridegroom\'s Rice" celebrated for stamina, nerve strength, and iron density.',
    description: 'Mappillai Samba is a native Tamil Nadu red rice variety famous for building robust physical endurance and stamina. Naturally pest-resilient, it is grown using Vedic agricultural practices. It has high dietary fiber, a firm bite, and an earthy nutty taste when cooked. Best enjoyed with sambar, rasam, curd, or fermented as probiotic Neeragaram.',
    benefits: [
      'Extremely rich in Iron and Zinc to combat anemia',
      'Supports healthy blood sugar balance with slow-release carbs',
      'Strengthens muscles, nerves, and bodily stamina',
      'Superb for making fermented probiotic Kanji (pazhaiya sadham)'
    ],
    origin: 'Thiruvannamalai, Tamil Nadu',
    rating: 4.9,
    reviewCount: 189,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'ms-1kg', label: '1 kg', price: 135, originalPrice: 160, inStock: true, stockCount: 110 },
      { id: 'ms-5kg', label: '5 kg (Saver Pack)', price: 640, originalPrice: 750, inStock: true, stockCount: 30 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: true,
    badge: 'Stamina Superfood',
    nutritionHighlights: {
      'Fiber': '7.8 g / 100g',
      'Iron': '4.8 mg / 100g',
      'GI Index': 'Low (< 55)'
    }
  },
  {
    id: 'prod-karuppu-kavuni',
    name: 'Karuppu Kavuni Black Rice (Emperor\'s Rice)',
    tamilName: 'கருப்பு கவுனி அரிசி',
    slug: 'karuppu-kavuni-black-rice',
    categoryId: 'heritage-rice',
    categoryName: 'Traditional Rice',
    shortDescription: 'The crown jewel of Chettinad heritage, packed with more anthocyanin antioxidants than blueberries.',
    description: 'Karuppu Kavuni is an ancient heirloom black rice historically served to royalty in Chettinad and Southeast Asia. The deep purple-black pigment is powered by Anthocyanin—a potent antioxidant that supports cellular repair and cardiovascular wellness. Traditionally cooked into decadent Kavuni Arisi sweet pudding or savory porridge.',
    benefits: [
      'Contains supreme levels of Anthocyanin antioxidants',
      'Anti-inflammatory properties that support heart and vascular health',
      'Helps detoxify liver and regulate lipid levels',
      'Deep, luxurious nutty flavor with wholesome chewy texture'
    ],
    origin: 'Karaikudi / Sivagangai, Tamil Nadu',
    rating: 4.98,
    reviewCount: 260,
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'kk-500g', label: '500 g', price: 110, originalPrice: 130, inStock: true, stockCount: 75 },
      { id: 'kk-1kg', label: '1 kg', price: 210, originalPrice: 250, inStock: true, stockCount: 140 },
      { id: 'kk-5kg', label: '5 kg', price: 990, originalPrice: 1200, inStock: true, stockCount: 20 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: true,
    badge: 'Antioxidant King',
    nutritionHighlights: {
      'Antioxidants': 'Anthocyanin Dense',
      'Protein': '8.5 g / 100g',
      'Fibre': '8.9 g / 100g'
    }
  },
  {
    id: 'prod-seeraga-samba',
    name: 'Jeeraga Samba Biryani Rice (Seeraga Samba)',
    tamilName: 'சீரக சம்பா பிரியாணி அரிசி',
    slug: 'seeraga-samba-biryani-rice',
    categoryId: 'heritage-rice',
    categoryName: 'Traditional Rice',
    shortDescription: 'Fragrant petite rice grains with a cumin-seed resemblance, the soul of authentic South Indian Biryani.',
    description: 'Known as the fragrance of South India, Seeraga Samba produces exquisite aromatic Dindigul, Thalappakatti, and Ambur Biryanis. The short, pearl-like grains absorb spices and ghee deeply without turning mushy. Age-cured naturally for over 12 months.',
    benefits: [
      'Captivating natural aroma that transforms any biryani or pulao',
      'Easier to digest than heavy long-grain polished basmati',
      'Cured for 1 year for non-sticky, flaky separation',
      'Authentic heirloom seed strain from the Cauvery delta'
    ],
    origin: 'Tiruchirappalli / Thanjavur, Tamil Nadu',
    rating: 4.88,
    reviewCount: 175,
    images: [
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'ss-1kg', label: '1 kg', price: 140, originalPrice: 165, inStock: true, stockCount: 180 },
      { id: 'ss-5kg', label: '5 kg (Saver Pack)', price: 680, originalPrice: 790, inStock: true, stockCount: 60 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: false,
    badge: 'Biryani Special'
  },
  {
    id: 'prod-poongar-rice',
    name: 'Poongar Traditional Women\'s Red Rice',
    tamilName: 'பூங்கார் பாரம்பரிய அரிசி',
    slug: 'poongar-traditional-womens-red-rice',
    categoryId: 'heritage-rice',
    categoryName: 'Traditional Rice',
    shortDescription: 'Centuries-old therapeutic red rice traditionally prescribed for women\'s hormonal and maternal wellness.',
    description: 'Poongar is an indigenous drought-resistant red rice with exceptional nutritional value. Highly acclaimed in traditional Siddha medicine for balancing hormones, boosting hemoglobin, and assisting during pregnancy and lactation. Makes heavenly soft idlis and crisp red dosas.',
    benefits: [
      'Celebrated for female hormonal balance and lactation support',
      'Abundant in natural zinc, iron, and mineral salts',
      'Enhances gut microbiota and digestion',
      'Makes delightfully soft idlis and dosas'
    ],
    origin: 'Nagapattinam, Tamil Nadu',
    rating: 4.91,
    reviewCount: 92,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'pg-1kg', label: '1 kg', price: 130, originalPrice: 155, inStock: true, stockCount: 85 },
      { id: 'pg-5kg', label: '5 kg', price: 620, originalPrice: 720, inStock: true, stockCount: 25 }
    ],
    isFeatured: false,
    isTopSeller: false,
    isOrganic: true,
    badge: 'Women\'s Wellness'
  },

  // --- MILLETS ---
  {
    id: 'prod-thinai-foxtail-millet',
    name: 'Organic Foxtail Millet (Thinai / Kangni)',
    tamilName: 'நாட்டு தினை அரிசி',
    slug: 'organic-foxtail-millet-thinai',
    categoryId: 'millets',
    categoryName: 'Millets & Ancient Grains',
    shortDescription: 'Golden ancient millet grain packed with protein, vitamin B12, and nervous system nourishment.',
    description: 'Thinai is among humanity\'s oldest cultivated grains, famously relished with pure honey in Sangam literature. Unpolished and naturally processed to retain the nutritious bran layer. Highly recommended for children, athletes, and diabetic diets.',
    benefits: [
      'Remarkable 12.3% plant-protein concentration',
      'Steady glucose release with a very low glycemic index',
      'Gluten-free alternative to wheat and polished white rice',
      'Cooks in just 15 minutes for upma, pongal, or pulao'
    ],
    origin: 'Dharmapuri, Tamil Nadu',
    rating: 4.84,
    reviewCount: 136,
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'th-500g', label: '500 g', price: 60, originalPrice: 75, inStock: true, stockCount: 90 },
      { id: 'th-1kg', label: '1 kg', price: 115, originalPrice: 140, inStock: true, stockCount: 130 }
    ],
    isFeatured: true,
    isTopSeller: false,
    isOrganic: true,
    badge: 'High Protein'
  },
  {
    id: 'prod-varagu-kodo-millet',
    name: 'Unpolished Kodo Millet (Varagu Arisi)',
    tamilName: 'நாட்டு வரகு அரிசி',
    slug: 'unpolished-kodo-millet-varagu',
    categoryId: 'millets',
    categoryName: 'Millets & Ancient Grains',
    shortDescription: 'Fibre-dense ancient millet grain that naturally aids weight management and heart wellness.',
    description: 'Varagu (Kodo millet) is renowned for having up to 300% more dietary fiber than polished white rice. Our grains undergo gentle destoning and single-pass dehusking so the live germ and aleurone layers stay fully intact.',
    benefits: [
      'Incredible dietary fibre (9g/100g) for healthy bowel motility',
      'Helps maintain healthy cholesterol and weight balance',
      'Rich in polyphenols and protective phytochemicals',
      'Light on the stomach, no post-meal heaviness'
    ],
    origin: 'Salem, Tamil Nadu',
    rating: 4.8,
    reviewCount: 104,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'vr-500g', label: '500 g', price: 65, originalPrice: 80, inStock: true, stockCount: 75 },
      { id: 'vr-1kg', label: '1 kg', price: 120, originalPrice: 145, inStock: true, stockCount: 110 }
    ],
    isFeatured: false,
    isTopSeller: false,
    isOrganic: true,
    badge: 'Weight Management'
  },
  {
    id: 'prod-kuthiraivali-barnyard-millet',
    name: 'Native Barnyard Millet (Kuthiraivali Arisi)',
    tamilName: 'குதிரைவாலி அரிசி',
    slug: 'native-barnyard-millet-kuthiraivali',
    categoryId: 'millets',
    categoryName: 'Millets & Ancient Grains',
    shortDescription: 'The lowest-calorie, fastest-digesting millet, loaded with bioavailable iron and phosphorus.',
    description: 'Kuthiraivali has tiny, delicate grains that cook tenderly, resembling traditional ponni rice. Its exceptionally low calorie density and high iron content make it the premier choice for fasting days, weight control diets, and diabetic meal plans.',
    benefits: [
      'Lowest carbohydrate and calorie content among all millets',
      'Superior bioavailable iron for fighting fatigue',
      'Easy to cook, makes tender idlis, upma, and porridge',
      'Sourced directly from rainfed dryland farmers'
    ],
    origin: 'Madurai, Tamil Nadu',
    rating: 4.86,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'kv-500g', label: '500 g', price: 65, originalPrice: 80, inStock: true, stockCount: 80 },
      { id: 'kv-1kg', label: '1 kg', price: 125, originalPrice: 150, inStock: true, stockCount: 95 }
    ],
    isFeatured: false,
    isTopSeller: false,
    isOrganic: true,
    badge: 'Diabetic Choice'
  },

  // --- HONEY ---
  {
    id: 'prod-wild-forest-raw-honey',
    name: 'Western Ghats Wild Forest Raw Honey',
    tamilName: 'இயற்கை மலைத்தேன்',
    slug: 'western-ghats-wild-forest-raw-honey',
    categoryId: 'honey',
    categoryName: 'Pure Forest Honey',
    shortDescription: 'Unheated, unfiltered multi-flora raw honey harvested from wild Apis Dorsata combs.',
    description: 'Sourced from the pristine canopy of the Western Ghats by indigenous tribal gatherers. Extracted without heat treatment, fine pasteurization, or micro-filtering, keeping live enzymes, bee pollen, and natural royal propolis fully intact. Dark, thick, with notes of blooming forest medicinal flora.',
    benefits: [
      'Zero added jaggery, corn syrup, or inverted sugar',
      'Active natural enzymes that boost daily immunity',
      'Soothes throat irritation and seasonal dry cough',
      'Direct tribal ethical partnership, sustainable harvesting'
    ],
    origin: 'Western Ghats (Anaimalai Hills), Tamil Nadu',
    rating: 4.97,
    reviewCount: 310,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'wh-250g', label: '250 g', price: 195, originalPrice: 240, inStock: true, stockCount: 60 },
      { id: 'wh-500g', label: '500 g', price: 360, originalPrice: 440, inStock: true, stockCount: 95 },
      { id: 'wh-1kg', label: '1 kg (Glass Bottle)', price: 680, originalPrice: 820, inStock: true, stockCount: 40 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: true,
    badge: '100% Raw & Pure',
    nutritionHighlights: {
      'Purity': 'NMR Tested 100%',
      'Pasteurization': 'Never Heated',
      'Bee Pollen': 'Intact'
    }
  },
  {
    id: 'prod-agumbe-stingless-honey',
    name: 'Medicinal Stingless Bee Honey (Kombu Thaen / Cheruthen)',
    tamilName: 'கொம்பு தேன் (சிறுதேனீ தேன்)',
    slug: 'medicinal-stingless-bee-honey-kombu-thaen',
    categoryId: 'honey',
    categoryName: 'Pure Forest Honey',
    shortDescription: 'Rare therapeutic nectar gathered by tiny stingless bees from small medicinal herbs.',
    description: 'Cheruthen (Stingless bee honey) is nature\'s most prized medicinal liquid. These miniature bees collect nectar from the tiniest wildflowers that large bees cannot access. Distinctive tangy-sweet flavor, slightly thinner viscosity, and renowned for deep medicinal potency in Ayurveda and Siddha.',
    benefits: [
      'Exceptional antibacterial and wound-healing biocidal potency',
      'Treasured tonic for children\'s respiratory health and appetite',
      'Rich in antioxidant phenolic compounds',
      'Extremely scarce harvest, limited seasonal availability'
    ],
    origin: 'Agumbe Rainforest, Karnataka',
    rating: 5.0,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'sh-150g', label: '150 g', price: 340, originalPrice: 390, inStock: true, stockCount: 30 },
      { id: 'sh-300g', label: '300 g', price: 650, originalPrice: 750, inStock: true, stockCount: 15 }
    ],
    isFeatured: true,
    isTopSeller: false,
    isOrganic: true,
    badge: 'Rare Medicinal'
  },

  // --- DATES & DRY FRUITS ---
  {
    id: 'prod-royal-medjool-dates',
    name: 'Royal Medjool Jumbo Dates (Jordan Valley)',
    tamilName: 'ராயல் மஜ்ஹூல் பேரீச்சம்பழம்',
    slug: 'royal-medjool-jumbo-dates',
    categoryId: 'dates-dryfruits',
    categoryName: 'Dates & Dry Fruits',
    shortDescription: 'King of Dates — plump, moist, large-sized with decadent caramel undertones.',
    description: 'Hand-selected Jumbo Medjool dates imported fresh from the warm Jordan Valley. Known as the King of Dates for their opulent size, soft creamy skin, and melt-in-mouth caramel sweetness without any sticky glucose coating.',
    benefits: [
      '100% natural energy booster without processed sugar',
      'High in Potassium for muscle endurance and electrolyte balance',
      'Soluble fiber helps regulate healthy digestion',
      'Free from chemical glazing or artificial preservative sprays'
    ],
    origin: 'Jordan Valley',
    rating: 4.96,
    reviewCount: 220,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'md-500g', label: '500 g Box', price: 490, originalPrice: 580, inStock: true, stockCount: 65 },
      { id: 'md-1kg', label: '1 kg Box', price: 950, originalPrice: 1150, inStock: true, stockCount: 40 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: true,
    badge: 'Jumbo Size',
    nutritionHighlights: {
      'Energy': '277 kcal / 100g',
      'Potassium': '696 mg / 100g',
      'Added Sugar': '0%'
    }
  },
  {
    id: 'prod-kimia-black-dates',
    name: 'Original Kimia Soft Black Dates (Bam Origin)',
    tamilName: 'கிமியா கருப்பு பேரீச்சம்பழம்',
    slug: 'original-kimia-soft-black-dates',
    categoryId: 'dates-dryfruits',
    categoryName: 'Dates & Dry Fruits',
    shortDescription: 'Silky, melt-in-the-mouth soft black dates celebrated for high natural moisture and iron.',
    description: 'Authentic Bam Kimia dates packed in protective temperature-controlled boxes. Renowned for their pitch-black glossy appearance, incredibly tender flesh, and gentle sweetness. A staple household favorite for daily breakfast bowls and smoothies.',
    benefits: [
      'Soft and easy to chew, ideal for elders and toddlers',
      'Helps instantly elevate hemoglobin and body vitality',
      'Rich in vital micronutrients: Magnesium, Manganese & Copper',
      'Pure single-layer clean packing'
    ],
    origin: 'Bam, Iran',
    rating: 4.88,
    reviewCount: 340,
    images: [
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'km-500g', label: '500 g Box', price: 220, originalPrice: 270, inStock: true, stockCount: 160 },
      { id: 'km-1kg', label: '1 kg (2 Boxes)', price: 420, originalPrice: 520, inStock: true, stockCount: 90 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: true,
    badge: 'Family Favorite'
  },
  {
    id: 'prod-ajwa-madinah-dates',
    name: 'Royal Ajwa Dates of Madinah (Original VIP)',
    tamilName: 'அஜ்வா பேரீச்சம்பழம் (மதீனா)',
    slug: 'royal-ajwa-dates-of-madinah',
    categoryId: 'dates-dryfruits',
    categoryName: 'Dates & Dry Fruits',
    shortDescription: 'Sacred small-grain black dates with fine white lines, revered for heart wellness and vitality.',
    description: 'Sourced directly from certified orchards in Al-Madinah Al-Munawwarah. Ajwa is celebrated worldwide for its distinctive dry-soft texture, dark matte skin with delicate crinkles, and well-documented traditional health benefits.',
    benefits: [
      'Rich in bioactive polyphenols supporting cardiac health',
      'Centuries of revered medicinal reputation',
      'Clean sorted Grade-A harvest',
      'Zero preservative treatment'
    ],
    origin: 'Medina, Saudi Arabia',
    rating: 4.99,
    reviewCount: 195,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'aj-250g', label: '250 g Box', price: 450, originalPrice: 550, inStock: true, stockCount: 45 },
      { id: 'aj-500g', label: '500 g Box', price: 880, originalPrice: 1050, inStock: true, stockCount: 30 }
    ],
    isFeatured: false,
    isTopSeller: false,
    isOrganic: true,
    badge: 'Madinah Origin'
  },
  {
    id: 'prod-afghan-anjeer-figs',
    name: 'Afghan Premium Handpicked Anjeer (Dried Figs)',
    tamilName: 'அத்திப்பழம் (அஞ்சீர்)',
    slug: 'afghan-premium-handpicked-anjeer-figs',
    categoryId: 'dates-dryfruits',
    categoryName: 'Dates & Dry Fruits',
    shortDescription: 'Sun-dried golden ring figs rich in calcium, iron, and gut-healthy soluble seeds.',
    description: 'Large, round, naturally dried figs strung on cotton cords from the sunny hills of Kandahar. Crisp seed crunch enveloped in sweet, chewy, naturally dried fig pulp. Soaking 2 figs overnight in water is a classic regimen for bone strength and relieving constipation.',
    benefits: [
      'One of nature\'s highest plant sources of bioavailable Calcium',
      'Mild natural laxative effect for smooth regular digestion',
      'High in protective antioxidants and potassium',
      'Pure sun-dried, no sulfur or bleaching applied'
    ],
    origin: 'Kandahar, Afghanistan',
    rating: 4.92,
    reviewCount: 165,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'an-250g', label: '250 g', price: 340, originalPrice: 395, inStock: true, stockCount: 60 },
      { id: 'an-500g', label: '500 g', price: 650, originalPrice: 780, inStock: true, stockCount: 45 }
    ],
    isFeatured: true,
    isTopSeller: false,
    isOrganic: true,
    badge: 'Bone Health'
  },
  {
    id: 'prod-golden-raisins-kishmish',
    name: 'Long Golden Afghan Raisins (Kishmish)',
    tamilName: 'உலர்ந்த திராட்சை (கிஷ்மிஷ்)',
    slug: 'long-golden-afghan-raisins-kishmish',
    categoryId: 'dates-dryfruits',
    categoryName: 'Dates & Dry Fruits',
    shortDescription: 'Sweet, juicy, seedless green-golden long raisins sun-dried on desert racks.',
    description: 'Slender, elongated seedless green raisins dried naturally in shade towers. Tender skin, luscious sweet-tangy burst, ideal for garnishing payasam, pongal, biryani, or as a nutritious snack for kids.',
    benefits: [
      'Rich in Iron to support healthy red blood cells',
      'Natural prebiotic fiber for gut comfort',
      'Cleaned, stemmed, and ready to eat',
      'Zero artificial syrup glaze'
    ],
    origin: 'Kabul, Afghanistan',
    rating: 4.81,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'rs-250g', label: '250 g', price: 120, originalPrice: 145, inStock: true, stockCount: 90 },
      { id: 'rs-500g', label: '500 g', price: 230, originalPrice: 280, inStock: true, stockCount: 110 }
    ],
    isFeatured: false,
    isTopSeller: false,
    isOrganic: false
  },

  // --- NUTS & SEEDS ---
  {
    id: 'prod-w240-jumbo-cashews',
    name: 'Mangalore W240 Jumbo Cashew Nuts (Kaju)',
    tamilName: 'முந்திரி பருப்பு (W240)',
    slug: 'mangalore-w240-jumbo-cashew-nuts',
    categoryId: 'nuts-seeds',
    categoryName: 'Nuts & Super Seeds',
    shortDescription: 'Grade W240 whole, creamy white jumbo cashew kernels with a rich buttery crunch.',
    description: 'Freshly shelled whole cashews carefully graded W-240 (standard king size). Crisp texture, pristine ivory color, and an unctuous nutty finish. Sourced from coastal Karnataka & Kerala cashew groves without oily sulfur baths.',
    benefits: [
      'Healthy monounsaturated and polyunsaturated fats',
      'Rich in copper, magnesium, and plant-based protein',
      'Vacuum-sealed packaging ensures garden-fresh crunch',
      'Non-fried, non-salted, 100% whole raw grade'
    ],
    origin: 'Mangalore, Karnataka',
    rating: 4.93,
    reviewCount: 285,
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'cw-250g', label: '250 g', price: 245, originalPrice: 290, inStock: true, stockCount: 95 },
      { id: 'cw-500g', label: '500 g', price: 470, originalPrice: 560, inStock: true, stockCount: 115 },
      { id: 'cw-1kg', label: '1 kg (Vacuum Sealed)', price: 920, originalPrice: 1100, inStock: true, stockCount: 45 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: false,
    badge: 'Grade W240 King'
  },
  {
    id: 'prod-california-almonds',
    name: 'Premium California Nonpareil Almonds (Badam)',
    tamilName: 'கலிஃபோர்னியா பாதாம் பருப்பு',
    slug: 'premium-california-nonpareil-almonds',
    categoryId: 'nuts-seeds',
    categoryName: 'Nuts & Super Seeds',
    shortDescription: 'Supreme whole California almonds with smooth golden-brown shells and crisp sweet kernels.',
    description: 'Selected extra-fancy grade Nonpareil almonds celebrated for uniform size, sweet flavor, and tender skin. Packed with natural Vitamin E, dietary fibre, and protein. Ideal for morning soaked badam routine.',
    benefits: [
      'High in Vitamin E for radiant skin and cellular protection',
      'Supports healthy memory and brain alertness',
      'Plant protein powerhouse (21g / 100g)',
      'Crisp, fresh harvest without bitter kernels'
    ],
    origin: 'Central Valley, California',
    rating: 4.9,
    reviewCount: 360,
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'al-250g', label: '250 g', price: 230, originalPrice: 275, inStock: true, stockCount: 120 },
      { id: 'al-500g', label: '500 g', price: 440, originalPrice: 530, inStock: true, stockCount: 150 },
      { id: 'al-1kg', label: '1 kg (Vacuum Pack)', price: 860, originalPrice: 1040, inStock: true, stockCount: 55 }
    ],
    isFeatured: true,
    isTopSeller: true,
    isOrganic: false,
    badge: 'Super Almond'
  },
  {
    id: 'prod-kashmiri-walnuts',
    name: 'Snow White Kashmiri Walnut Kernels (Akhrot)',
    tamilName: 'காஷ்மீர் அக்ரூட் பருப்பு',
    slug: 'snow-white-kashmiri-walnut-kernels',
    categoryId: 'nuts-seeds',
    categoryName: 'Nuts & Super Seeds',
    shortDescription: 'Fresh, buttery light-half walnut kernels from the misty valleys of Kashmir, high in Omega-3.',
    description: '100% natural walnut halves directly shelled in Kashmir. Free from rancidity, chemical bleaching, or artificial polish. The quintessential "brain food" loaded with plant-based Alpha-Linolenic Acid (ALA Omega-3).',
    benefits: [
      'Essential Omega-3 ALA fatty acids for cognitive vitality',
      'Supports optimal cardiovascular function and mood',
      'Raw, unroasted and naturally sweet without bitterness',
      'Vacuum-packed at origin to seal in volatile oils'
    ],
    origin: 'Anantnag, Kashmir Valley',
    rating: 4.94,
    reviewCount: 154,
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'wn-250g', label: '250 g', price: 330, originalPrice: 390, inStock: true, stockCount: 50 },
      { id: 'wn-500g', label: '500 g', price: 640, originalPrice: 760, inStock: true, stockCount: 70 }
    ],
    isFeatured: false,
    isTopSeller: true,
    isOrganic: true,
    badge: 'Omega-3 Rich'
  },
  {
    id: 'prod-chia-pumpkin-seed-mix',
    name: 'Raw Organic Chia & Roasted Pumpkin Seed Mix',
    tamilName: 'சூப்பர் விதைகள் கலவை',
    slug: 'raw-organic-chia-pumpkin-seed-mix',
    categoryId: 'nuts-seeds',
    categoryName: 'Nuts & Super Seeds',
    shortDescription: 'Powerhouse daily seed blend containing black chia seeds, roasted pumpkin, and sunflower kernels.',
    description: 'A curated daily superfood blend crafted for wellness seekers. Toss a spoonful into your morning curd, oatmeal, smoothie, or salads for an instant boost of bioavailable zinc, magnesium, and dietary fiber.',
    benefits: [
      'Rich in Zinc and Magnesium for immune strength',
      'Packed with soluble prebiotic mucilage fiber',
      'Lightly dry roasted for crisp satisfying bite',
      'Zero oil, zero salt, 100% whole raw seeds'
    ],
    origin: 'Rajasthan / Mysore',
    rating: 4.82,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
    ],
    weightOptions: [
      { id: 'sm-250g', label: '250 g', price: 160, originalPrice: 195, inStock: true, stockCount: 80 },
      { id: 'sm-500g', label: '500 g', price: 295, originalPrice: 370, inStock: true, stockCount: 65 }
    ],
    isFeatured: false,
    isTopSeller: false,
    isOrganic: true,
    badge: 'Daily Superfood'
  }
];
