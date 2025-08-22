import React from 'react'
import axios from 'axios'

const News = () => {
    const [news, setNews] = React.useState([])

    React.useEffect(() => {
        const fetchNews = async () => {
            const response = await axios.get('http://127.0.0.1:5000/api/get-news')
            setNews(response)
        }
        fetchNews()
    }, [])


  return (
    <div>News</div>
  )
}

export default News