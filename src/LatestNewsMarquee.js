import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LatestNewsMarquee() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/search', {
          params: {
            keyword: 'technology', // Default keyword as 'technology'
          },
        });

        if (response.data && response.data.length > 0) {
          setArticles(response.data); // Set all articles
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="marquee-container">
      {articles.length > 0 && (
        <marquee>
          {articles.map((article, index) => (
            <span key={index}>
              <a href={article.webUrl} target="_blank" rel="noopener noreferrer">
                {article.webTitle}
              </a>
              {index < articles.length - 1 && ' | '} {/* Add separator between articles */}
            </span>
          ))}
        </marquee>
      )}
    </div>
  );
}

export default LatestNewsMarquee;
