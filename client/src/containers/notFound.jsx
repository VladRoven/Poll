import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="container" id="not-found-page">
        <div className="not-found-icon">
          <h1>4</h1>
          <div className="logo">
            <p>P</p>
          </div>
          <h1>4</h1>
        </div>
        <p className="description">
          Нажаль, за даним посиланням <br /> сторінки не знайдено.
        </p>
      </div>
      <Footer />
    </>
  )
}

export default NotFound
