import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'

const PollingApp = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await axios.get(
                    `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`
                );
                const newPost = response.data.hits[0];
                console.log(newPost)
                if (newPost) {
                    setShow(false)
                    setPosts(prevPosts => [...prevPosts, newPost]);
                    setPage(prevPage => prevPage + 1);
                }
            } catch (error) {
                console.log('Error getting posts:', error);
            }
        };
        
 
        const interval = setInterval(fetchData, 10000);
        return () => {
            clearInterval(interval);
        };
    }, [page]);

    return (
        <div>

            {show ? <h1>Wait for 10sec</h1> :
                <table>
                    <thead>
                        <tr style={{ borderWidth: 2, borderColor: 'red' }}>
                            <th>Title</th>
                            <th>URL</th>
                            <th>Created At</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.objectID}>
                                <td>{post.title}</td>
                                <td>
                                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                                        {post.url}
                                    </a>
                                </td>
                                <td>{post.created_at}</td>
                                <td>{post.author}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    );
};

export default PollingApp;