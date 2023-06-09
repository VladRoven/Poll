import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './style'
import Button from '../button/index'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import Input from '../input'

const Modal = inject('Common')(
  observer(({ Common }) => {
    const {
      type,
      title,
      text,
      btnConfirmTitle,
      btnCancelTitle,
      onSubmit,
      onHide,
      hideOnSubmit,
      style,
      fields,
    } = useMemo(() => toJS(Common.modalConfig))
    const [isShow, setIsShow] = useState(false)
    const [img, setImg] = useState(null)
    const toggleShow = node => {
      if (!node) return
      if (Common.isShowModal) {
        setTimeout(() => {
          node.classList.add('show')
        }, 20)
        return
      }
      node.classList.remove('show')
    }
    const backdrop = useCallback(toggleShow)
    const modal = useCallback(toggleShow)
    const hideHandler = () => {
      onHide()
      setImg(null)
      Common.hideModal()
    }

    const renderModal = () => {
      switch (type) {
        case 'confirm': {
          return (
            <div className="poll-modal" ref={modal} id="confirm" style={style}>
              {title && <h2 className="title">{title}</h2>}
              {text && (
                <p className="text">
                  {text.split('\n').map((_text, idx) => (
                    <span key={idx}>
                      {_text}
                      <br />
                    </span>
                  ))}
                </p>
              )}
              <div className="buttons">
                <Button
                  onClick={e => {
                    onSubmit(e)
                    if (hideOnSubmit) hideHandler()
                  }}
                >
                  {btnConfirmTitle}
                </Button>
                <Button onClick={hideHandler}>{btnCancelTitle}</Button>
              </div>
            </div>
          )
        }
        case 'info': {
          return (
            <div className="poll-modal" ref={modal} id="info" style={style}>
              {title && <h2 className="title">{title}</h2>}
              {text && (
                <p className="text">
                  {text.split('\n').map((_text, idx) => (
                    <span key={idx}>
                      {_text}
                      <br />
                    </span>
                  ))}
                </p>
              )}
              <Button
                onClick={e => {
                  onSubmit(e)
                  if (hideOnSubmit) hideHandler()
                }}
              >
                {btnConfirmTitle}
              </Button>
            </div>
          )
        }
        case 'uploadImage': {
          return (
            <div
              className="poll-modal"
              ref={modal}
              id="upload-image"
              style={style}
            >
              {title && <h2 className="title">{title}</h2>}
              {text && (
                <p className="text">
                  {text.split('\n').map((_text, idx) => (
                    <span key={idx}>
                      {_text}
                      <br />
                    </span>
                  ))}
                </p>
              )}
              <div className="img-uploader">
                <label
                  id="img-preview"
                  htmlFor="upload-input"
                  style={{
                    ...(img
                      ? {
                          backgroundImage: `url(${(
                            window.URL || window.webkitURL
                          ).createObjectURL(img)})`,
                        }
                      : {}),
                  }}
                >
                  {img ? '' : 'Натисніть, щоб додати'}
                </label>
                <input
                  tabIndex="-1"
                  id="upload-input"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={e => setImg(e.target.files[0])}
                />
              </div>
              <Button
                onClick={e => {
                  onSubmit(img, hideHandler)
                  if (hideOnSubmit) hideHandler()
                }}
              >
                {btnConfirmTitle}
              </Button>
            </div>
          )
        }
        case 'inputs': {
          const fieldsRef = {}
          return (
            <div className="poll-modal" ref={modal} id="inputs" style={style}>
              {title && <h2 className="title">{title}</h2>}
              {text && (
                <p className="text">
                  {text.split('\n').map((_text, idx) => (
                    <span key={idx}>
                      {_text}
                      <br />
                    </span>
                  ))}
                </p>
              )}
              <div className="fields">
                {fields.map((field, idx) => {
                  return (
                    <Input
                      key={idx}
                      type={field.type}
                      placeholder={field.placeholder}
                      ref={ref => (fieldsRef[field.name] = ref)}
                    />
                  )
                })}
              </div>
              <Button
                onClick={e => {
                  onSubmit(fieldsRef, hideHandler)
                  if (hideOnSubmit) hideHandler()
                }}
              >
                {btnConfirmTitle}
              </Button>
            </div>
          )
        }
      }
    }

    useEffect(() => {
      const body = document.querySelector('body')

      if (Common.isShowModal) {
        body.classList.add('poll-modal-open')
        setIsShow(true)
        return
      }
      setTimeout(() => setIsShow(false), 150)
      body.classList.remove('poll-modal-open')
    }, [Common.isShowModal])

    return (
      isShow && (
        <>
          <div
            className="poll-modal-backdrop"
            onClick={hideHandler}
            ref={backdrop}
          ></div>
          {renderModal()}
        </>
      )
    )
  })
)

export default Modal
