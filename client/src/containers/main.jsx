import React from 'react'
import Header from '../components/header/index.jsx'
import Footer from '../components/footer/index.jsx'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Button from '../components/button/index.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartPie,
  faMagnifyingGlassChart,
  faPeopleGroup,
  faFileExcel,
  faListCheck,
  faChartColumn,
  faHeadset,
  faHandHoldingDollar,
  faMugHot,
} from '@fortawesome/free-solid-svg-icons'

const Main = inject('User')(
  observer(({ User, ...props }) => {
    return (
      <>
        <Header />
        <div className="container" id="main-page">
          <div id="header">
            <div className="context">
              <h1 data-aos="fade-right" data-aos-duration="800">
                Сервіс онлайн опитувань
              </h1>
              <Link
                to={User.token ? '/profile' : '/sign-up'}
                data-aos="zoom-out-up"
                data-aos-duration="500"
                data-aos-delay="500"
              >
                <Button>
                  {User.token ? 'Перейти в профіль' : 'Зареєструватись'}
                </Button>
              </Link>
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
            <a href="#features" className="arrow">
              <div className="movable">
                <div className="fixed">
                  <span></span>
                  <span></span>
                </div>
              </div>
            </a>
          </div>
          <div id="features">
            <h1>Для чого потрібен?</h1>
            <div className="data">
              <div className="block">
                <div data-aos="fade-right" data-aos-duration="800">
                  <FontAwesomeIcon icon={faChartPie} size="7x" />
                </div>
                <p data-aos="fade-left" data-aos-duration="800">
                  Онлайн опитування це найефективніший спосіб проаналізувати
                  попит на товар і зрозуміти свою цільову аудиторію.
                </p>
              </div>
              <div className="block center">
                <section>
                  <div data-aos="fade-right" data-aos-duration="800">
                    <FontAwesomeIcon icon={faMagnifyingGlassChart} size="7x" />
                  </div>
                  <p data-aos="fade-left" data-aos-duration="800">
                    Збирайте матеріал, щоб краще пізнати свого клієнта, а
                    відповідно за допомогою цієї інформації підвищуйте прибуток.
                  </p>
                </section>
              </div>
              <div className="block">
                <div data-aos="fade-right" data-aos-duration="800">
                  <FontAwesomeIcon icon={faPeopleGroup} size="6x" />
                </div>
                <p data-aos="fade-left" data-aos-duration="800">
                  За допомогою опитувань вивчайте думки з того чи іншого
                  соціального питання різних груп населення.
                </p>
              </div>
            </div>
          </div>
          <div id="functionality">
            <h1>Що ви можете зробити?</h1>
            <div className="data">
              <div
                className="block"
                data-aos="fade-right"
                data-aos-duration="800"
              >
                <FontAwesomeIcon icon={faListCheck} size="6x" />
                <h3>Створити опитування</h3>
                <p>
                  Зручний конструктор опитувань. 3 типа питань і налаштування
                  логічних правил.
                </p>
              </div>
              <div
                className="block"
                data-aos="fade-right"
                data-aos-delay="300"
                data-aos-duration="800"
              >
                <FontAwesomeIcon icon={faChartColumn} size="6x" />
                <h3>Зібрати відповіді</h3>
                <p>Онлайн-панель зі великою кількістю активних респондентів.</p>
              </div>
              <div
                className="block"
                data-aos="fade-right"
                data-aos-delay="600"
                data-aos-duration="800"
              >
                <FontAwesomeIcon icon={faFileExcel} size="6x" />
                <h3>Отримати результат</h3>
                <p>Результати опитування в форматі Excel.</p>
              </div>
            </div>
          </div>
          <div id="advantages">
            <h1>Чому саме Voice?</h1>
            <div className="data">
              <div
                className="block"
                data-aos="fade-left"
                data-aos-delay="600"
                data-aos-duration="800"
              >
                <FontAwesomeIcon icon={faMugHot} size="6x" />
                <h3>Простота</h3>
                <p>
                  Простий інтерфейс та зручний конструктор створення опитувань.
                </p>
              </div>
              <div
                className="block"
                data-aos="fade-left"
                data-aos-delay="300"
                data-aos-duration="800"
              >
                <FontAwesomeIcon icon={faHandHoldingDollar} size="6x" />
                <h3>Це безкоштовно</h3>
                <p>
                  Ви економите час і гроші створюючи опитування безкоштовно.
                </p>
              </div>
              <div
                className="block"
                data-aos="fade-left"
                data-aos-duration="800"
              >
                <FontAwesomeIcon icon={faHeadset} size="6x" />
                <h3>Підтримка</h3>
                <p>24/7 підтримка клієнтів і швидка реакція.</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  })
)

export default Main
