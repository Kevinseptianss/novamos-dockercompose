import { useState } from "react";
import ArticleForm from "../components/ArticleForm";
import ArticleList from "../components/ArticleList";
import { createArticle, fetchArticles } from "../api/api";
import ArticleFormEdit from "../components/ArticleFormEdit";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [articleEditId, setArticleEditId] = useState(0);

  const loadArticles = async () => {
    const data = await fetchArticles();
    setArticles(data || []); // Ensure articles is always an array
  };

  const handleSubmit = async (formData) => {
    try {
      // Create article logic
      const newArticle = await createArticle(formData);
      setArticles((prevArticles) => [...prevArticles, newArticle]);
    } catch (error) {
      console.error("Error submitting article:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="p-4">
      {articleEditId === 0 ? (
        <ArticleForm
          onSubmit={handleSubmit}
          loadArticles={loadArticles}
        />
      ) : (
        <ArticleFormEdit
          id={articleEditId}
          setArticleEditId={setArticleEditId}
          loadArticles={loadArticles}
        />
      )}

      <ArticleList
        articles={articles}
        setArticles={setArticles}
        loadArticles={loadArticles}
        articleEditId={articleEditId}
        setArticleEditId={setArticleEditId}
      />
    </div>
  );
};

export default Articles;