import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import { Link } from 'react-router-dom'
import Button from '../components/button/index.jsx'
import Constructor from '../assets/images/constructor.png'
import Adaptive from '../assets/images/adaptive.png'

const About = () => {
  return (
    <>
      <Header />
      <div className="container" id="about-page">
        <div id="header">
          <div className="context">
            <h1 data-aos="fade-right" data-aos-duration="800">
              Створи онлайн опитування повністю безкоштовно
            </h1>
            <p
              id="description"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="600"
            >
              <b>Poll</b> - абсолютно безкоштовний сервіс: для реєстрації не
              потрібно вказувати номер банківської карти. Всі ваші дані
              захищені, знаходяться в цілковитій безпеці і зберігаються
              безкоштовно. Ідеально для бізнесу, некомерційних організацій,
              освітніх установ і особистого використання.
            </p>
          </div>
          <div
            className="logo-block"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <div className="logo" data-aos="fade-left" data-aos-delay="800">
              <p>P</p>
            </div>
          </div>
          <a href="#constructor" className="arrow">
            <div className="movable">
              <div className="fixed">
                <span></span>
                <span></span>
              </div>
            </div>
          </a>
        </div>
        <div id="constructor" className="block">
          <img
            src={Constructor}
            alt="Конструктор"
            data-aos="fade-right"
            data-aos-duration="800"
          />
          <span
            className="description"
            data-aos="fade-left"
            data-aos-duration="800"
          >
            <h2>Зручний конструктор</h2>
            <p>
              Простий, зрозумілий та легкий в освоєнні конструктор, з яким
              впорається навіть самий недосвідченній користувач. Саме він
              допоможе вам створити ваше опитування.
            </p>
          </span>
        </div>
        <div id="adaptive" className="block">
          <span
            className="description"
            data-aos="fade-right"
            data-aos-duration="800"
          >
            <h2>Адаптивний дизайн</h2>
            <p>
              Більшість інформації сьогодні виходить за допомогою мобільних
              девайсів, тому так важливо надати можливість проходження
              опитування на смартфонах і планшетах.
            </p>
          </span>
          <img
            src={Adaptive}
            alt="Адаптив"
            data-aos="fade-left"
            data-aos-duration="800"
          />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
