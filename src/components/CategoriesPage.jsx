async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: 'no-store', 
    });

    if (!res.ok) {
      throw new Error('Failed to fetch categories from Laravel API');
    }

    const data = await res.json();
    return data.data; 
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Categories from Laravel API</h1>

      {categories.length === 0 ? (
        <p className="text-gray-500">No category in Db</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h2 className="text-xl font-semibold text-blue-600">{category.name}</h2>
              <p className="text-sm text-gray-400 mb-2">Slug: {category.slug}</p>
              <p className="text-gray-600">{category.description || 'No description provided.'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}