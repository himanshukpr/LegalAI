import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Layout from './components/Layout';
import Router from './Router';

function App() {
  return (
    <Layout>
      <Header />
      <main className="relative">
        <Router />
      </main>
      <Footer />
    </Layout>
  );
}

export default App;
