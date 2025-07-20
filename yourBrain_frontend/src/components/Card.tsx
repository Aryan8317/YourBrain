import { useEffect } from "react";
import { ShareIcon } from "../icons/ShareIcon";

interface CardProps {
    title: string; 
    link: string; 
    type: "twitter" | "youtube"; 
}

export function Card({ title, link, type }: CardProps) {
    console.log("Card props:", { title, link, type });
    // Function to extract YouTube video ID and create embed URL
    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return "";
        const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        if (videoIdMatch) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        }
        return url;
    };

    // Function to get Twitter embed URL
    const getTwitterEmbedUrl = (url: string) => {
        if (!url) return "";
        return url.replace("x.com", "twitter.com");
    };

    useEffect(() => {
        if (type === "twitter") {
            // Wait for Twitter widget to load
            const loadTwitterWidget = () => {
                if ((window as any).twttr) {
                    (window as any).twttr.widgets.load();
                } else {
                    // Retry after a short delay if widget isn't loaded yet
                    setTimeout(loadTwitterWidget, 100);
                }
            };
            loadTwitterWidget();
        }
    }, [type, link]);

    return (
        <div>
            <div className="p-4 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72">
                <div className="flex justify-between">
                    <div className="flex items-center text-md">
                        <div className="text-gray-500 pr-2">
                            <ShareIcon />
                        </div>
                        {title}
                    </div>
                    <div className="flex items-center">
                        <div className="pr-2 text-gray-500">
                            <a href={link} target="_blank">
                                <ShareIcon />
                            </a>
                        </div>
                    </div>
                </div>

               
                <div className="pt-4">
                    {type === "youtube" && link && (
                        <iframe
                            className="w-full border-0"
                            src={getYouTubeEmbedUrl(link)}
                            title="YouTube video player"
                            height="200"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    )}

                    {type === "twitter" && link && (
                        <blockquote className="twitter-tweet">
                            <a href={getTwitterEmbedUrl(link)}></a>
                        </blockquote>
                    )}

                    {(!link || link === "") && (
                        <div className="text-gray-400 text-center py-8">
                            No content to display
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}