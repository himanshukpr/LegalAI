import React from 'react'
import axios from 'axios'

const News = () => {
    const [news, setNews] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true)
                const response = await axios.get('http://127.0.0.1:5000/api/get-news')
                // Extract the recent_laws_and_rules_india array from the response
                const newsData = response.data.recent_laws_and_rules_india || []
                setNews(newsData)
                setError(null)
            } catch (err) {
                console.error('Error fetching news:', err)
                setError('Failed to fetch news. Please make sure the backend server is running.')
                setNews([])
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-lg">Loading news...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-red-500 text-center">
                    <p>{error}</p>
                    <p className="text-sm mt-2">Make sure to run: python main.py in the legalai_be folder</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Laws & Rules in India</h2>
            {news.length === 0 ? (
                <div className="text-center text-gray-500">No news available at the moment.</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {news.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 border">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                            <div className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Topic:</span> {item.topic}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Date:</span> {item.date_of_event}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium">Status:</span> {item.implementation_status}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default News