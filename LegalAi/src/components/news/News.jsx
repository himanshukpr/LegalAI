import React from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FaNewspaper, FaCalendarAlt, FaBalanceScale, FaCheckCircle, FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa'

const News = () => {
    const [news, setNews] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)
    const [selectedArticle, setSelectedArticle] = React.useState(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
            },
        },
    }

    const getStatusIcon = (status) => {
        if (status?.toLowerCase().includes('implemented') || status?.toLowerCase().includes('active')) {
            return <FaCheckCircle className="text-green-400" />
        }
        return <FaExclamationTriangle className="text-yellow-400" />
    }

    const openModal = (article) => {
        setSelectedArticle(article)
        setIsModalOpen(true)
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedArticle(null)
        // Restore body scroll
        document.body.style.overflow = 'unset'
    }

    // Close modal on escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal()
            }
        }
        
        if (isModalOpen) {
            document.addEventListener('keydown', handleEscape)
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isModalOpen])

    // Modal component
    const ArticleModal = ({ article, isOpen, onClose }) => {
        if (!article) return null

        return (
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Modal Content */}
                        <motion.div
                            className="relative bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                                        <FaNewspaper className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">Legal Article Details</h2>
                                        <p className="text-gray-300 text-sm">Complete information</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {/* Title */}
                                <h1 className="text-2xl font-bold text-white mb-6 leading-tight">
                                    {article.title}
                                </h1>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaBalanceScale className="text-blue-400" />
                                            <span className="font-medium text-gray-300">Topic</span>
                                        </div>
                                        <p className="text-white">{article.topic}</p>
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaCalendarAlt className="text-blue-400" />
                                            <span className="font-medium text-gray-300">Date</span>
                                        </div>
                                        <p className="text-white">{article.date_of_event}</p>
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusIcon(article.implementation_status)}
                                            <span className="font-medium text-gray-300">Status</span>
                                        </div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                            article.implementation_status?.toLowerCase().includes('implemented') || 
                                            article.implementation_status?.toLowerCase().includes('active')
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                            {article.implementation_status}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaInfoCircle className="text-blue-400" />
                                        <h3 className="text-lg font-semibold text-white">Full Description</h3>
                                    </div>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {article.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Info (if available) */}
                                {(article.source || article.reference || article.link) && (
                                    <div className="mt-6 bg-gray-900 p-6 rounded-lg border border-gray-700">
                                        <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
                                        <div className="space-y-2">
                                            {article.source && (
                                                <p className="text-gray-300">
                                                    <span className="font-medium">Source:</span> {article.source}
                                                </p>
                                            )}
                                            {article.reference && (
                                                <p className="text-gray-300">
                                                    <span className="font-medium">Reference:</span> {article.reference}
                                                </p>
                                            )}
                                            {article.link && (
                                                <p className="text-gray-300">
                                                    <span className="font-medium">Link:</span> 
                                                    <a 
                                                        href={article.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 ml-2 underline"
                                                    >
                                                        View Original
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-xl text-white">Loading Latest Legal News...</div>
                    <div className="text-gray-400 mt-2">Fetching the most recent laws and regulations</div>
                </motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <motion.div 
                    className="text-center max-w-md mx-auto px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle className="text-red-400 text-2xl" />
                    </div>
                    <div className="text-red-400 text-center bg-gray-800 p-6 rounded-xl border border-red-500/30">
                        <p className="text-lg font-semibold mb-2">{error}</p>
                        <p className="text-sm text-gray-300">Make sure to run: <code className="bg-gray-700 px-2 py-1 rounded">python main.py</code> in the legalai_be folder</p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaNewspaper className="text-2xl text-white" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Latest Legal News
                        </h1>
                        <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                            Stay updated with the most recent laws, rules, and regulations in India
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* News Content */}
            <div className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    {news.length === 0 ? (
                        <motion.div 
                            className="text-center bg-gray-800 p-12 rounded-xl border border-gray-700"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <FaNewspaper className="text-4xl text-gray-500 mx-auto mb-4" />
                            <div className="text-xl text-gray-400">No news available at the moment.</div>
                            <div className="text-gray-500 mt-2">Please check back later for updates</div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {news.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
                                    variants={itemVariants}
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
                                    }}
                                >
                                    {/* Header with Status */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaBalanceScale className="text-blue-400 text-lg" />
                                            <span className="text-sm text-blue-400 font-medium">Legal Update</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {getStatusIcon(item.implementation_status)}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold mb-4 text-white leading-tight line-clamp-2">
                                        {item.title}
                                    </h3>

                                    {/* Info Grid */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <FaBalanceScale className="text-gray-400" />
                                            <span className="font-medium text-gray-300">Topic:</span>
                                            <span className="text-gray-400">{item.topic}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FaCalendarAlt className="text-gray-400" />
                                            <span className="font-medium text-gray-300">Date:</span>
                                            <span className="text-gray-400">{item.date_of_event}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            {getStatusIcon(item.implementation_status)}
                                            <span className="font-medium text-gray-300">Status:</span>
                                            <span className={`text-sm px-2 py-1 rounded-full ${
                                                item.implementation_status?.toLowerCase().includes('implemented') || 
                                                item.implementation_status?.toLowerCase().includes('active')
                                                    ? 'bg-green-500/20 text-green-400' 
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {item.implementation_status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                                        {item.description}
                                    </p>

                                    {/* Read More Button */}
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <button
                                            onClick={() => openModal(item)}
                                            className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-2 group"
                                        >
                                            Read Full Details
                                            <motion.span
                                                className="group-hover:translate-x-1 transition-transform"
                                                whileHover={{ x: 3 }}
                                            >
                                                →
                                            </motion.span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Article Modal */}
            <ArticleModal 
                article={selectedArticle} 
                isOpen={isModalOpen} 
                onClose={closeModal} 
            />
        </div>
    )
}

export default News