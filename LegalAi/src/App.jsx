import React from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Layout from './components/layout/Layout';
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
