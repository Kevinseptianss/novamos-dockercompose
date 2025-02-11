/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { deleteItem } from '../api/api'; // Assuming deleteItem is the function to delete an article

const ArticleList = ({ articles, setArticles, loadArticles, setArticlesEdit }) => {

    useEffect(() => {
        loadArticles();
    }, [loadArticles]);

    const handleDelete = async (id) => {
        await deleteItem(id); // Assuming deleteItem deletes an article
        setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
    };

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Articles</h2>
            <ul className="space-y-2">
                {articles.length > 0 ? articles.map(article => (
                    <li key={article.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span>{article.title} - {article?.body?.length > 100 ? `${article?.body?.slice(0, 100)}...` : article.body}</span>
                        <div>
                            <button onClick={() => setArticlesEdit(article.id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2">Edit</button>
                            <button onClick={() => handleDelete(article.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                        </div>
                    </li>
                )) : (
                    <li className="text-gray-500">No articles found.</li> // Display a message if no articles are available
                )}
            </ul>
        </div>
    );
};

export default ArticleList;