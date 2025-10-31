import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

const slidesData = [
  {
    type: 'SCROLL',
    src: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    bg: '#6d597a',
  },
  {
    type: 'SWIPE',
    src: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    bg: '#355070',
  },
  {
    type: 'SCROLL',
    src: 'https://images.unsplash.com/photo-1537165924986-cc3568f5d454?crop=entropy&cs=srgb&fm=jpg&q=85&w=400',
    bg: '#b56576',
  },
  {
    type: 'SWIPE',
    src: 'https://images.unsplash.com/photo-1589271243958-d61e12b61b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    bg: '#9a8c98',
  },
]

const overlayImages = [
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  'https://images.unsplash.com/photo-1594666757003-3ee20de41568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  'https://images.unsplash.com/photo-1579830341096-05f2f31b8259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  'https://images.unsplash.com/photo-1603771628302-c32c88e568e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
]

export default function Hero() {
  const rootRef = useRef(null)
  const countRef = useRef(null)
  const animating = useRef(false)
  const currentIndex = useRef(0)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.slide')
      const images = gsap.utils.toArray('.overlay .image').reverse()
      const slideImages = gsap.utils.toArray('.slide__img')
      const outerWrappers = gsap.utils.toArray('.slide__outer')
      const innerWrappers = gsap.utils.toArray('.slide__inner')
      const wrap = gsap.utils.wrap(0, sections.length)

      gsap.set(outerWrappers, { xPercent: 100 })
      gsap.set(innerWrappers, { xPercent: -100 })
      gsap.set('.slide:nth-of-type(1) .slide__outer', { xPercent: 0 })
      gsap.set('.slide:nth-of-type(1) .slide__inner', { xPercent: 0 })

      function gotoSection(index, direction) {
        if (animating.current) return
        animating.current = true
        index = wrap(index)

        const tl = gsap.timeline({
          defaults: { duration: 1, ease: 'expo.inOut' },
          onComplete: () => {
            animating.current = false
          },
        })

        const currentSection = sections[currentIndex.current]
        const heading = currentSection.querySelector('.slide__heading')
        const nextSection = sections[index]
        const nextHeading = nextSection.querySelector('.slide__heading')

        gsap.set([sections, images], { zIndex: 0, autoAlpha: 0 })
        gsap.set([sections[currentIndex.current], images[index]], {
          zIndex: 1,
          autoAlpha: 1,
        })
        gsap.set([sections[index], images[currentIndex.current]], {
          zIndex: 2,
          autoAlpha: 1,
        })

        tl.add(() => {
          countRef.current.textContent = index + 1
        }, 0.32)
          .fromTo(
            outerWrappers[index],
            { xPercent: 100 * direction },
            { xPercent: 0 },
            0
          )
          .fromTo(
            innerWrappers[index],
            { xPercent: -100 * direction },
            { xPercent: 0 },
            0
          )
          .to(heading, { '--width': 800, xPercent: 30 * direction }, 0)
          .fromTo(
            nextHeading,
            { '--width': 800, xPercent: -30 * direction },
            { '--width': 200, xPercent: 0 },
            0
          )
          .fromTo(
            images[index],
            { xPercent: 125 * direction, scaleX: 1.5, scaleY: 1.3 },
            { xPercent: 0, scaleX: 1, scaleY: 1, duration: 1 },
            0
          )
          .fromTo(
            images[currentIndex.current],
            { xPercent: 0, scaleX: 1, scaleY: 1 },
            { xPercent: -125 * direction, scaleX: 1.5, scaleY: 1.3 },
            0
          )
          .fromTo(slideImages[index], { scale: 2 }, { scale: 1 }, 0)
          .timeScale(0.8)

        currentIndex.current = index
      }

      Observer.create({
        type: 'wheel,touch,pointer',
        preventDefault: true,
        wheelSpeed: -1,
        onUp: () => gotoSection(currentIndex.current + 1, +1),
        onDown: () => gotoSection(currentIndex.current - 1, -1),
        tolerance: 10,
      })

      window.addEventListener('keydown', e => {
        if (animating.current) return
        if (e.code === 'ArrowUp' || e.code === 'ArrowLeft')
          gotoSection(currentIndex.current - 1, -1)
        if (
          e.code === 'ArrowDown' ||
          e.code === 'ArrowRight' ||
          e.code === 'Space' ||
          e.code === 'Enter'
        )
          gotoSection(currentIndex.current + 1, 1)
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="min-h-screen">
      {slidesData.map((s, i) => (
        <section key={i} className="slide" aria-hidden={i !== 0}>
          <div className="slide__outer" style={{ backgroundColor: s.bg }}>
            <div className="slide__inner">
              <div className="slide__content">
                <div className="slide__container">
                  <h2 className="slide__heading">{s.type}</h2>
                  <figure className="slide__img-cont">
                    <img className="slide__img" src={s.src} alt="" />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="overlay">
        <div className="overlay__content">
          <p className="overlay__count">
            0
            <span className="count" ref={countRef}>
              1
            </span>
          </p>
          <figure className="overlay__img-cont">
            {overlayImages.map((src, idx) => (
              <img key={idx} className="image" src={src} alt="overlay" />
            ))}
          </figure>
        </div>
      </section>

      <footer>
        <p>design is how it works</p>
      </footer>
    </div>
  )
}
