import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ContentItem {
    _id: string;
    title: string;
    type: string;
    link: string;
}

export function SharePage() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [content, setContent] = useState<ContentItem[]>([]);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        fetch(`http://localhost:8080/api/v1/brain/${id}`)
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to fetch shared content');
                }
                return res.json();
            })
            .then((data) => {
                setUsername(data.username);
                setContent(data.content);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="flex flex-col items-center justify-center min-h-screen">Loading shared content...</div>;
    }
    if (error) {
        return <div className="flex flex-col items-center justify-center min-h-screen text-red-500">{error}</div>;
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">{username}&apos;s Shared Brain</h1>
            {content.length === 0 ? (
                <div className="text-gray-500">No content shared.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {content.map((item) => (
                        <div key={item._id} className="p-4 bg-white rounded-md border shadow">
                            <div className="font-semibold mb-2">{item.title}</div>
                            {item.type === 'youtube' ? (
                                <iframe
                                    className="w-full border-0"
                                    src={`https://www.youtube.com/embed/${getYouTubeId(item.link)}`}
                                    title={item.title}
                                    height="200"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            ) : item.type === 'twitter' ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Tweet</a>
                            ) : (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open Link</a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : '';
} 