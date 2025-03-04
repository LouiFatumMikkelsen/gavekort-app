interface Store {
  id: string;
  name: string;
  primaryLogoUrl: string;
  backupLogoUrl: string;
  website: string;
}

// Liste over danske butikker med backup logoer
export const stores: Store[] = [
  {
    id: '1',
    name: 'H&M',
    primaryLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png',
    backupLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/640px-H%26M-Logo.svg.png',
    website: 'https://www2.hm.com'
  },
  {
    id: '2',
    name: 'Matas',
    primaryLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Matas_logo.svg',
    backupLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Matas_logo.svg/320px-Matas_logo.svg.png',
    website: 'https://www.matas.dk'
  },
  {
    id: '3',
    name: 'Magasin',
    primaryLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Magasin_du_Nord_Logo.svg',
    backupLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Magasin_du_Nord_Logo.svg/320px-Magasin_du_Nord_Logo.svg.png',
    website: 'https://www.magasin.dk'
  },
  {
    id: '4',
    name: 'Føtex',
    primaryLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/F%C3%B8tex_logo.svg',
    backupLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/F%C3%B8tex_logo.svg/320px-F%C3%B8tex_logo.svg.png',
    website: 'https://www.foetex.dk'
  },
  {
    id: '5',
    name: 'Bilka',
    primaryLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Bilka_Logo.svg',
    backupLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Bilka_Logo.svg/320px-Bilka_Logo.svg.png',
    website: 'https://www.bilka.dk'
  },
  {
    id: '6',
    name: 'Normal',
    primaryLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Normal_Logo.svg',
    backupLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Normal_Logo.svg/320px-Normal_Logo.svg.png',
    website: 'https://www.normal.dk'
  },
  {
    id: '7',
    name: 'Imerco',
    primaryLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Imerco_logo.svg',
    backupLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Imerco_logo.svg/320px-Imerco_logo.svg.png',
    website: 'https://www.imerco.dk'
  }
];

// Hjælpefunktion til at finde butik og få det bedste tilgængelige logo
export const getStoreLogo = async (storeName: string): Promise<string> => {
  const store = stores.find(s => s.name.toLowerCase() === storeName.toLowerCase());
  if (!store) return ''; // Returner tom streng hvis butikken ikke findes

  // Tjek om primary logo virker
  try {
    const response = await fetch(store.primaryLogoUrl);
    if (response.ok) {
      return store.primaryLogoUrl;
    }
  } catch (error) {
    console.log('Primær logo fejlede, prøver backup');
  }

  // Returner backup logo hvis primary fejler
  return store.backupLogoUrl;
};

// Funktion til at søge efter butikker
export const searchStores = (query: string): Store[] => {
  if (!query || query.length < 2) return [];
  
  return stores.filter(store => 
    store.name.toLowerCase().includes(query.toLowerCase())
  );
}; 