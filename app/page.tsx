'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import AnimatedBackground from '@/components/AnimatedBackground'
import { COMPANY_TAGLINE, SERVICES, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants'

const PORTFOLIO_IMAGES = [
  '/images/Websites/aceplanner.png',
  '/images/Websites/stgofineart.png',
  '/images/Websites/nuvepet.png',
  '/images/Websites/nordkaliber.png',
]

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const servicesTitleRef = useRef<HTMLHeadingElement>(null)
  const ctaSectionRef = useRef<HTMLDivElement>(null)
  const ctaTitleRef = useRef<HTMLHeadingElement>(null)
  const ctaTextRef = useRef<HTMLParagraphElement>(null)
  const ctaButtonRef = useRef<HTMLDivElement>(null)
  const portfolioCarouselRef = useRef<HTMLDivElement>(null)
  const serviceCard2Ref = useRef<HTMLDivElement>(null)
  const funnelRef = useRef<HTMLDivElement>(null)
  const serviceCard3Ref = useRef<HTMLDivElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const serviceCard4Ref = useRef<HTMLDivElement>(null)
  const roiChartRef = useRef<HTMLDivElement>(null)
  const serviceCard5Ref = useRef<HTMLDivElement>(null)
  const analyticsDashboardRef = useRef<HTMLDivElement>(null)
  const serviceCard6Ref = useRef<HTMLDivElement>(null)
  const integrationsRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const aboutTitleRef = useRef<HTMLHeadingElement>(null)
  const aboutTextRef = useRef<HTMLParagraphElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const faqTitleRef = useRef<HTMLHeadingElement>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  useEffect(() => {
    let scrollCleanup: (() => void) | null = null
    
    // Detect mobile and reduced motion preference
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    const ctx = gsap.context(() => {
      // Hero animations - optimized for mobile
      if (titleRef.current && taglineRef.current && ctaRef.current) {
        const tl = gsap.timeline()
        tl.fromTo(
          titleRef.current,
          { y: isMobile ? 60 : 100, opacity: 0 },
          { y: 0, opacity: 1, duration: isMobile ? 0.7 : 1, ease: isMobile ? 'power2.out' : 'power3.out' }
        )
          .fromTo(
            taglineRef.current,
            { y: isMobile ? 30 : 50, opacity: 0 },
            { y: 0, opacity: 1, duration: isMobile ? 0.5 : 0.8, ease: isMobile ? 'power2.out' : 'power3.out' },
            '-=0.5'
          )
          .fromTo(
            ctaRef.current,
            { y: isMobile ? 20 : 30, opacity: 0 },
            { y: 0, opacity: 1, duration: isMobile ? 0.4 : 0.6, ease: isMobile ? 'power2.out' : 'power3.out' },
            '-=0.4'
          )
      }

      // Services section scroll animations
      if (servicesTitleRef.current) {
        gsap.fromTo(
          servicesTitleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: servicesTitleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (servicesRef.current) {
        const serviceCard = servicesRef.current.querySelector('.service-card')
        if (serviceCard) {
          // Simpler animation on mobile for better performance
          const slideDistance = isMobile ? 20 : 50
          gsap.fromTo(
            serviceCard,
            { x: -slideDistance, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: isMobile ? 0.5 : 0.6,
              ease: isMobile ? 'power1.out' : 'power2.out',
              force3D: !isMobile, // Disable force3D on mobile to reduce lag
              scrollTrigger: {
                trigger: serviceCard,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          )
        }
      }

      // Constant rotation carousel animation
      if (portfolioCarouselRef.current && !prefersReducedMotion) {
        const images = portfolioCarouselRef.current.querySelectorAll('.portfolio-image')
        const totalImages = images.length
        const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 580
        const radius = isSmallMobile ? 70 : (isMobile ? 95 : 170)
        
        let currentRotation = 0
        let animationFrameId: number | null = null
        const rotationSpeed = isMobile ? 0.1 : 0.15 // Slower rotation on mobile
        
        images.forEach((img: any, index: number) => {
          const angle = (index * 360) / totalImages
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const z = isMobile ? 0 : Math.sin((angle * Math.PI) / 180) * radius // Flatten on mobile
          
          gsap.set(img, {
            x: x,
            z: z,
            rotationY: isMobile ? 0 : angle + 90, // No 3D rotation on mobile
            transformOrigin: 'center center',
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
          })
        })

        const updateRotation = () => {
          images.forEach((img: any, index: number) => {
            const baseAngle = (index * 360) / totalImages
            const currentAngle = baseAngle + currentRotation
            const x = Math.cos((currentAngle * Math.PI) / 180) * radius
            const z = isMobile ? 0 : Math.sin((currentAngle * Math.PI) / 180) * radius
            
            const frontFacing = Math.abs(Math.sin((currentAngle * Math.PI) / 180)) < 0.3
            
            gsap.set(img, {
              x: x,
              z: z,
              rotationY: isMobile ? 0 : currentAngle + 90,
              opacity: 1,
              scale: 1,
            })
          })
        }

        const animate = () => {
          currentRotation += rotationSpeed
          updateRotation()
          animationFrameId = requestAnimationFrame(animate)
        }

        animate()
        
        scrollCleanup = () => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
          }
        }
      }

      if (funnelRef.current) {
        const funnelStages = funnelRef.current.querySelectorAll('.funnel-stage')
        const funnelBars = funnelRef.current.querySelectorAll('.funnel-bar')
        const funnelBottom = funnelRef.current.querySelector('.funnel-bottom')
        const paths = funnelRef.current.querySelectorAll('path')
        
        // Animate connecting lines
        paths.forEach((path: any, index: number) => {
          const pathLength = path.getTotalLength()
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          })
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: funnelRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.2 + 0.3,
          })
        })
        
        funnelStages.forEach((stage: any, index: number) => {
          gsap.fromTo(
            stage,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: funnelRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.2 + 0.4,
            }
          )
        })

        funnelBars.forEach((bar: any, index: number) => {
          gsap.fromTo(
            bar,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: funnelRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.2 + 0.45,
            }
          )
        })

        // Blinking green animation - slower on mobile for performance
        if (funnelBottom && !prefersReducedMotion) {
          gsap.to(funnelBottom, {
            borderColor: 'rgba(34, 197, 94, 0.6)',
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
            opacity: 0.9,
            duration: isMobile ? 2 : 1.5, // Slower on mobile
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: 1.5,
            scrollTrigger: {
              trigger: funnelRef.current,
              start: 'top 75%',
              toggleActions: 'play pause resume reset',
            },
          })
        }
      }

      if (serviceCard3Ref.current) {
        // Simpler animation on mobile for better performance
        const slideDistance = isMobile ? 20 : 50
        gsap.fromTo(
          serviceCard3Ref.current,
          { x: -slideDistance, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.6,
            ease: isMobile ? 'power1.out' : 'power2.out',
            force3D: !isMobile, // Disable force3D on mobile to reduce lag
            scrollTrigger: {
              trigger: serviceCard3Ref.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (searchResultsRef.current) {
        const results = searchResultsRef.current.querySelectorAll('.search-result')
        const firstResult = searchResultsRef.current.querySelector('.search-result:first-child')
        
        results.forEach((result: any, index: number) => {
          gsap.fromTo(
            result,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: searchResultsRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.1,
            }
          )
        })

        // Blinking animation - slower on mobile for performance
        if (firstResult && !prefersReducedMotion) {
          gsap.fromTo(
            firstResult,
            { borderColor: 'rgba(134, 239, 172, 0)' },
            {
              borderColor: 'rgba(134, 239, 172, 0.6)',
              duration: isMobile ? 2 : 1.5, // Slower on mobile
              ease: 'power1.inOut',
              repeat: -1,
              yoyo: true,
              delay: 1.5,
              scrollTrigger: {
                trigger: searchResultsRef.current,
                start: 'top 75%',
                toggleActions: 'play pause resume reset',
              },
            }
          )
        }
      }

      if (serviceCard4Ref.current) {
        // Simpler animation on mobile for better performance
        const slideDistance = isMobile ? 20 : 50
        gsap.fromTo(
          serviceCard4Ref.current,
          { x: -slideDistance, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.6,
            ease: isMobile ? 'power1.out' : 'power2.out',
            force3D: !isMobile, // Disable force3D on mobile to reduce lag
            scrollTrigger: {
              trigger: serviceCard4Ref.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (roiChartRef.current) {
        const adFormats = roiChartRef.current.querySelectorAll('.ad-format')
        
        adFormats.forEach((format: any, index: number) => {
          gsap.fromTo(
            format,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: roiChartRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.15,
            }
          )
        })
      }

      if (serviceCard5Ref.current) {
        // Simpler animation on mobile for better performance
        const slideDistance = isMobile ? 20 : 50
        gsap.fromTo(
          serviceCard5Ref.current,
          { x: -slideDistance, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.6,
            ease: isMobile ? 'power1.out' : 'power2.out',
            force3D: !isMobile, // Disable force3D on mobile to reduce lag
            scrollTrigger: {
              trigger: serviceCard5Ref.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (analyticsDashboardRef.current) {
        const metricCards = analyticsDashboardRef.current.querySelectorAll('.metric-card')
        const chartBars = analyticsDashboardRef.current.querySelectorAll('.chart-bar')
        
        metricCards.forEach((card: any, index: number) => {
          gsap.fromTo(
            card,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: analyticsDashboardRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.1,
            }
          )
        })

        chartBars.forEach((bar: any, index: number) => {
          gsap.fromTo(
            bar,
            { scaleY: 0, transformOrigin: 'bottom' },
            {
              scaleY: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: analyticsDashboardRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: 0.4 + index * 0.05,
            }
          )
        })
      }

      if (serviceCard6Ref.current) {
        // Simpler animation on mobile for better performance
        const slideDistance = isMobile ? 20 : 50
        gsap.fromTo(
          serviceCard6Ref.current,
          { x: -slideDistance, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.6,
            ease: isMobile ? 'power1.out' : 'power2.out',
            force3D: !isMobile, // Disable force3D on mobile to reduce lag
            scrollTrigger: {
              trigger: serviceCard6Ref.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (integrationsRef.current) {
        const automationSteps = integrationsRef.current.querySelectorAll('.automation-step')
        const automationArrows = integrationsRef.current.querySelectorAll('.automation-arrow')
        const gearIcon = integrationsRef.current.querySelector('.automation-step:nth-of-type(2) svg')
        const successIcon = integrationsRef.current.querySelector('.automation-success')
        
        // Animate steps
        automationSteps.forEach((step: any, index: number) => {
          gsap.fromTo(
            step,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: integrationsRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.2,
            }
          )
        })

        // Rotate gear icon continuously - slower on mobile
        const gearIconElement = integrationsRef.current?.querySelector('.gear-icon')
        if (gearIconElement && !prefersReducedMotion) {
          const gearRotation = gsap.to(gearIconElement, {
            rotation: 360,
            duration: isMobile ? 6 : 4, // Slower rotation on mobile
            repeat: -1,
            ease: 'none',
            transformOrigin: 'center center',
            paused: true,
          })
          
          ScrollTrigger.create({
            trigger: integrationsRef.current,
            start: 'top 75%',
            onEnter: () => gearRotation.play(),
            once: true,
          })
        }

        // Blink animation for success icon - slower on mobile
        if (successIcon && !prefersReducedMotion) {
          gsap.to(successIcon, {
            opacity: 0.5,
            duration: isMobile ? 2 : 1.5, // Slower on mobile
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: integrationsRef.current,
              start: 'top 75%',
              toggleActions: 'play pause resume reset',
            },
          })
        }

        // Animate arrows
        automationArrows.forEach((arrow: any, index: number) => {
          gsap.fromTo(
            arrow,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: integrationsRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: 0.3 + index * 0.2,
              transformOrigin: 'left center',
            }
          )
        })
      }

      // About section scroll animations - optimized for mobile
      if (aboutTitleRef.current) {
        gsap.fromTo(
          aboutTitleRef.current,
          { y: isMobile ? 30 : 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.6 : 1,
            ease: isMobile ? 'power2.out' : 'power3.out',
            scrollTrigger: {
              trigger: aboutTitleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (aboutTextRef.current) {
        gsap.fromTo(
          aboutTextRef.current,
          { y: isMobile ? 20 : 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.8,
            ease: isMobile ? 'power2.out' : 'power3.out',
            scrollTrigger: {
              trigger: aboutTextRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // FAQ section scroll animations - optimized for mobile
      if (faqTitleRef.current) {
        gsap.fromTo(
          faqTitleRef.current,
          { y: isMobile ? 30 : 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.6 : 1,
            ease: isMobile ? 'power2.out' : 'power3.out',
            scrollTrigger: {
              trigger: faqTitleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (faqRef.current) {
        const faqItems = faqRef.current.querySelectorAll('.faq-item')
        faqItems.forEach((item: any, index: number) => {
          gsap.fromTo(
            item,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: faqRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              delay: index * 0.1,
            }
          )
        })
      }

      // CTA section scroll animations - optimized for mobile
      if (ctaTitleRef.current) {
        gsap.fromTo(
          ctaTitleRef.current,
          { y: isMobile ? 30 : 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.6 : 1,
            ease: isMobile ? 'power2.out' : 'power3.out',
            scrollTrigger: {
              trigger: ctaTitleRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (ctaTextRef.current) {
        gsap.fromTo(
          ctaTextRef.current,
          { y: isMobile ? 20 : 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.8,
            ease: isMobile ? 'power2.out' : 'power3.out',
            scrollTrigger: {
              trigger: ctaTextRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (ctaButtonRef.current) {
        gsap.fromTo(
          ctaButtonRef.current,
          { y: isMobile ? 20 : 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.8,
            ease: isMobile ? 'power2.out' : 'power3.out',
            scrollTrigger: {
              trigger: ctaButtonRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => {
      ctx.revert()
      if (scrollCleanup) {
        scrollCleanup()
      }
    }
  }, [])

  return (
    <>
      <AnimatedBackground />
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="min-h-screen flex items-center justify-center px-6 pt-24"
        >
          <div className="container mx-auto max-w-none md:max-w-5xl text-center">
            <h1
              ref={titleRef}
              className="glow-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-frank font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent pb-2 overflow-visible"
            >
              Brehaut Consulting
            </h1>
            <p
              ref={taglineRef}
              className="text-xl md:text-2xl text-white/90 mb-6 md:mb-4 leading-relaxed max-w-4xl mx-auto"
            >
              {COMPANY_TAGLINE}
            </p>
            <p className="hidden md:block text-lg text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              We help businesses get more customers through high-performance websites and measurable digital systems — designed to make attraction, conversion, and retention intentional rather than accidental.
            </p>
            <div ref={ctaRef} className="flex flex-col items-center gap-6">
              <Link
                href="/booking"
                className="glow-button inline-block px-10 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-white/90 shadow-2xl"
              >
                Book a Meeting
              </Link>
              <Link
                href="/how-it-works"
                className="text-white/70 hover:text-white transition-colors text-base underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section data-services-section className="pt-32 pb-16 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <h2
              ref={servicesTitleRef}
              className="glow-title text-5xl md:text-6xl font-heading font-bold text-center mb-20 text-white"
            >
              What We Offer
            </h2>
            <div ref={servicesRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative">
              {/* Connecting line on desktop - shows relationship between description and visualization */}
              <div className="hidden lg:block absolute left-[calc(50%-1px)] top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent z-0"></div>
              
              {/* Left Column - Service Card */}
              <div className="service-card description-card bg-gradient-to-br from-black/50 via-black/60 to-black/50 rounded-3xl p-10 lg:p-10 hover:bg-gradient-to-br hover:from-black/55 hover:via-black/65 hover:to-black/55 transition-all duration-300 relative z-10 backdrop-blur-md border border-white/10 hover:border-white/20 overflow-hidden">
                {/* Colored gradient overlay */}
                <div className="absolute top-1/2 right-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="glow-text text-3xl lg:text-4xl font-heading font-bold mb-4 text-white leading-tight text-center lg:text-left">
                    {SERVICES[0].title}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed text-center lg:text-left">
                    {SERVICES[0].description}
                  </p>
                </div>
              </div>

              {/* Right Column - Portfolio Carousel Visualization */}
              <div 
                ref={portfolioCarouselRef} 
                className="relative h-[200px] sm:h-[240px] lg:h-[220px] overflow-visible perspective-1000 z-10"
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d', textAlign: 'center' }}>
                  {PORTFOLIO_IMAGES.map((src, index) => (
                    <div
                      key={index}
                      className="portfolio-image absolute w-full max-w-[160px] sm:max-w-[200px] lg:max-w-[240px]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm">
                        <Image
                          src={src}
                          alt={`Portfolio project ${index + 1} - ${src.split('/').pop()?.replace('.png', '').replace(/([A-Z])/g, ' $1').trim()}`}
                          width={800}
                          height={600}
                          className="w-full h-auto object-cover brightness-[0.5]"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 80% 100% at center, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at center, black 60%, transparent 100%)' }}></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 100% 80% at center, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at center, black 60%, transparent 100%)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Second Service Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-20 relative">
              {/* Connecting line on desktop - shows relationship between description and visualization */}
              <div className="hidden lg:block absolute left-[calc(50%-1px)] top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent z-0"></div>
              
              {/* Left Column - Service Card */}
              <div 
                ref={serviceCard2Ref}
                className="description-card bg-gradient-to-br from-black/50 via-black/60 to-black/50 rounded-3xl p-10 lg:p-14 hover:bg-gradient-to-br hover:from-black/55 hover:via-black/65 hover:to-black/55 transition-all duration-300 relative z-10 backdrop-blur-md border border-white/10 hover:border-white/20 overflow-hidden"
              >
                {/* Colored gradient overlay */}
                <div className="absolute top-1/2 right-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="glow-text text-3xl lg:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                    {SERVICES[1].title}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                    {SERVICES[1].description}
                  </p>
                </div>
              </div>

              {/* Right Column - Conversion Flow Visualization */}
              <div 
                ref={funnelRef}
                className="relative h-[150px] md:h-[220px] lg:h-[300px] flex items-center justify-center z-10"
              >
                <div className="w-full max-w-md h-full flex items-center justify-center relative bg-white/3 border border-transparent rounded-2xl p-4 backdrop-blur-sm">
                  {/* Flow Diagram - Horizontal Connected Nodes */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                      <path
                        d="M 16 50 L 30 50"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3 3"
                        className="funnel-bar md:hidden"
                      />
                      <path
                        d="M 30 50 L 52 50"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3 3"
                        className="funnel-bar md:hidden"
                      />
                      <path
                        d="M 52 50 L 73 50"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3 3"
                        className="funnel-bar md:hidden"
                      />
                      <path
                        d="M 15 50 L 35 50"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3 3"
                        className="funnel-bar hidden md:block"
                      />
                      <path
                        d="M 35 50 L 60 50"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3 3"
                        className="funnel-bar hidden md:block"
                      />
                      <path
                        d="M 60 50 L 85 50"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3 3"
                        className="funnel-bar hidden md:block"
                      />
                    </svg>

                    {/* Node 1 - Left (Smallest) */}
                    <div className="funnel-stage absolute left-[12%] md:left-[10%] top-1/2 -translate-y-1/2">
                      <div className="funnel-bar w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-white/15 via-white/10 to-white/8 border-2 border-white/30 rounded-full backdrop-blur-md shadow-lg shadow-white/5 flex items-center justify-center">
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-white/20 rounded-full"></div>
                      </div>
                    </div>

                    {/* Node 2 */}
                    <div className="funnel-stage absolute left-[33%] md:left-[35%] top-1/2 -translate-y-1/2">
                      <div className="funnel-bar w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-white/15 via-white/10 to-white/8 border-2 border-white/30 rounded-full backdrop-blur-md shadow-lg shadow-white/5 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 md:w-5 md:h-5 bg-white/20 rounded-full"></div>
                      </div>
                    </div>

                    {/* Node 3 */}
                    <div className="funnel-stage absolute left-[54%] md:left-[60%] top-1/2 -translate-y-1/2">
                      <div className="funnel-bar w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-white/15 via-white/10 to-white/8 border-2 border-white/30 rounded-full backdrop-blur-md shadow-lg shadow-white/5 flex items-center justify-center">
                        <div className="w-4 h-4 md:w-6 md:h-6 bg-white/20 rounded-full"></div>
                      </div>
                    </div>

                    {/* Node 4 - Right (Success - Largest) */}
                    <div className="funnel-stage absolute left-[75%] md:left-[85%] top-1/2 -translate-y-1/2">
                      <div className="funnel-bar funnel-bottom w-11 h-11 md:w-16 md:h-16 bg-gradient-to-br from-white/15 via-white/10 to-white/8 border-2 border-white/30 rounded-full backdrop-blur-md shadow-lg shadow-white/5 flex items-center justify-center">
                        <svg className="w-5 h-5 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Service Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start mt-20 relative">
              {/* Connecting line on desktop - shows relationship between description and visualization */}
              <div className="hidden lg:block absolute left-[calc(50%-1px)] top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent z-0"></div>
              
              {/* Left Column - Service Card */}
              <div 
                ref={serviceCard3Ref}
                className="description-card bg-gradient-to-br from-black/50 via-black/60 to-black/50 rounded-3xl p-10 lg:p-14 hover:bg-gradient-to-br hover:from-black/55 hover:via-black/65 hover:to-black/55 transition-all duration-300 relative z-10 backdrop-blur-md border border-white/10 hover:border-white/20 overflow-hidden"
              >
                {/* Colored gradient overlay */}
                <div className="absolute top-1/2 right-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="glow-text text-3xl lg:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                    {SERVICES[2].title}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                    {SERVICES[2].description}
                  </p>
                </div>
              </div>

              {/* Right Column - Search Results Mockup Visualization */}
              <div 
                ref={searchResultsRef}
                className="relative h-[320px] lg:h-[275px] flex items-start justify-center z-10"
              >
                <div className="w-full max-w-md bg-white/3 border border-transparent rounded-2xl p-4 backdrop-blur-sm">
                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-2">
                      <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                      <div className="flex-1 h-2.5 bg-white/10 rounded"></div>
                      <div className="w-4 h-4 bg-white/15 rounded"></div>
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="space-y-3.5">
                    {/* Result 1 - Featured/Optimized */}
                    <div className="search-result border border-transparent rounded-lg p-2 -m-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2.5 w-2.5 bg-green-400/40 rounded"></div>
                        <div className="h-2.5 w-28 bg-white/30 rounded"></div>
                      </div>
                      <div className="h-3.5 w-40 bg-white/40 rounded mb-1.5"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-white/15 rounded"></div>
                        <div className="h-1.5 w-5/6 bg-white/15 rounded"></div>
                        <div className="h-1.5 w-4/6 bg-white/15 rounded"></div>
                      </div>
                    </div>

                    {/* Result 2 */}
                    <div className="search-result">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2.5 w-2.5 bg-white/20 rounded"></div>
                        <div className="h-2.5 w-24 bg-white/25 rounded"></div>
                      </div>
                      <div className="h-3.5 w-36 bg-white/35 rounded mb-1.5"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-white/12 rounded"></div>
                        <div className="h-1.5 w-5/6 bg-white/12 rounded"></div>
                      </div>
                    </div>

                    {/* Result 3 */}
                    <div className="search-result">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2.5 w-2.5 bg-white/20 rounded"></div>
                        <div className="h-2.5 w-32 bg-white/25 rounded"></div>
                      </div>
                      <div className="h-3.5 w-32 bg-white/35 rounded mb-1.5"></div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-white/12 rounded"></div>
                        <div className="h-1.5 w-4/6 bg-white/12 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fourth Service Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-20 relative">
              {/* Connecting line on desktop - shows relationship between description and visualization */}
              <div className="hidden lg:block absolute left-[calc(50%-1px)] top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent z-0"></div>
              
              {/* Left Column - Service Card */}
              <div 
                ref={serviceCard4Ref}
                className="description-card bg-gradient-to-br from-black/50 via-black/60 to-black/50 rounded-3xl p-10 lg:p-14 hover:bg-gradient-to-br hover:from-black/55 hover:via-black/65 hover:to-black/55 transition-all duration-300 relative z-10 backdrop-blur-md border border-white/10 hover:border-white/20 overflow-hidden"
              >
                {/* Colored gradient overlay */}
                <div className="absolute top-1/2 right-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="glow-text text-3xl lg:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                    {SERVICES[3].title}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                    {SERVICES[3].description}
                  </p>
                </div>
              </div>

              {/* Right Column - Ad Platform Icons Visualization */}
              {/* Visualization showing different advertising platforms connected to a central search ads icon */}
              <div 
                ref={roiChartRef}
                className="relative h-[320px] lg:h-[360px] flex items-center justify-center z-10"
              >
                <div className="w-full max-w-md bg-white/3 border border-transparent rounded-2xl p-8 backdrop-blur-sm relative" style={{ minHeight: '100%' }}>
                  {/* Connecting Lines SVG - Lines connecting outer icons to the center search icon */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" style={{ padding: '2rem' }}>
                    {/* Line connecting to Social Ads icon (bottom center) - responsive positioning for mobile */}
                    <line 
                      x1="50%" 
                      y1="72%" 
                      x2="50%" 
                      y2="50%"
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth="1.5"
                      className="ad-format md:hidden"
                    />
                    <line 
                      x1="50%" 
                      y1="65%" 
                      x2="50%" 
                      y2="50%"
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth="1.5"
                      className="ad-format hidden md:block"
                    />
                    {/* Line connecting to Display/Banner Ads icon (top-left) - responsive positioning for mobile */}
                    <line 
                      x1="50%" 
                      y1="50%" 
                      x2="15%" 
                      y2="25%" 
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth="1.5"
                      className="ad-format md:hidden"
                    />
                    <line 
                      x1="50%" 
                      y1="50%" 
                      x2="25%" 
                      y2="30%" 
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth="1.5"
                      className="ad-format hidden md:block"
                    />
                    {/* Line connecting to Video Ads icon (top-right) - responsive positioning for mobile */}
                    <line 
                      x1="50%" 
                      y1="50%" 
                      x2="85%" 
                      y2="25%" 
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth="1.5"
                      className="ad-format md:hidden"
                    />
                    <line 
                      x1="50%" 
                      y1="50%" 
                      x2="75%" 
                      y2="30%" 
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth="1.5"
                      className="ad-format hidden md:block"
                    />
                  </svg>

                  {/* Center - Search Ads Icon (Magnifying Glass) */}
                  {/* This represents search advertising platforms with colored circles suggesting search engines */}
                  <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    {/* Container with solid background to block connecting lines from showing through */}
                    <div className="w-20 h-20 border-2 border-white/30 rounded-2xl flex items-center justify-center relative backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                      {/* Colored circles in the background suggesting search platform colors */}
                      <div className="absolute inset-0 flex items-center justify-center gap-1">
                        <div className="w-3 h-3 bg-blue-500/60 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500/60 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500/60 rounded-full"></div>
                        <div className="w-3 h-3 bg-red-500/60 rounded-full"></div>
                      </div>
                      {/* Magnifying glass icon - represents search advertising */}
                      <svg className="w-10 h-10 relative z-10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom Center - Social Ads Icon */}
                  {/* Represents social media advertising platforms */}
                  <div className="ad-format absolute bottom-[8%] md:bottom-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 border-2 border-white/30 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </div>
                  </div>

                  {/* Top-Left - Display/Banner Ads Icon */}
                  {/* Represents display and banner advertising formats */}
                  <div className="ad-format absolute top-[8%] md:top-[15%] left-[10%] md:left-[20%] flex flex-col items-center justify-center z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 border-2 border-white/30 rounded-2xl flex items-center justify-center">
                      <div className="w-9 h-6 md:w-12 md:h-8 bg-gradient-to-br from-purple-500/50 to-pink-500/30 rounded-lg border border-purple-400/40 flex items-center justify-center">
                        <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="9" y1="9" x2="15" y2="9" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Top-Right - Video Ads Icon */}
                  {/* Represents video advertising platforms */}
                  <div className="ad-format absolute top-[8%] md:top-[15%] right-[10%] md:right-[20%] flex flex-col items-center justify-center z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 border-2 border-white/30 rounded-2xl flex items-center justify-center">
                      <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center border border-white/20">
                        <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fifth Service Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-20 relative">
              {/* Connecting line on desktop - shows relationship between description and visualization */}
              <div className="hidden lg:block absolute left-[calc(50%-1px)] top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent z-0"></div>
              
              {/* Left Column - Service Card */}
              <div 
                ref={serviceCard5Ref}
                className="description-card bg-gradient-to-br from-black/50 via-black/60 to-black/50 rounded-3xl p-10 lg:p-14 hover:bg-gradient-to-br hover:from-black/55 hover:via-black/65 hover:to-black/55 transition-all duration-300 relative z-10 backdrop-blur-md border border-white/10 hover:border-white/20 overflow-hidden"
              >
                {/* Colored gradient overlay */}
                <div className="absolute top-1/2 right-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="glow-text text-3xl lg:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                    {SERVICES[4].title}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                    {SERVICES[4].description}
                  </p>
                </div>
              </div>

              {/* Right Column - Analytics Dashboard Visualization */}
              <div 
                ref={analyticsDashboardRef}
                className="relative h-[320px] lg:h-[325px] flex items-start justify-center z-10"
              >
                <div className="w-full max-w-md bg-white/3 border border-transparent rounded-2xl p-5 backdrop-blur-sm">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Metric 1 */}
                    <div className="metric-card bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="h-2 w-16 bg-white/20 rounded mb-2"></div>
                      <div className="h-5 w-20 bg-white/40 rounded mb-1"></div>
                      <div className="h-1.5 w-12 bg-green-400/40 rounded"></div>
                    </div>

                    {/* Metric 2 */}
                    <div className="metric-card bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="h-2 w-16 bg-white/20 rounded mb-2"></div>
                      <div className="h-5 w-20 bg-white/40 rounded mb-1"></div>
                      <div className="h-1.5 w-12 bg-blue-400/40 rounded"></div>
                    </div>

                    {/* Metric 3 */}
                    <div className="metric-card bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="h-2 w-16 bg-white/20 rounded mb-2"></div>
                      <div className="h-5 w-20 bg-white/40 rounded mb-1"></div>
                      <div className="h-1.5 w-12 bg-purple-400/40 rounded"></div>
                    </div>

                    {/* Metric 4 */}
                    <div className="metric-card bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="h-2 w-16 bg-white/20 rounded mb-2"></div>
                      <div className="h-5 w-20 bg-white/40 rounded mb-1"></div>
                      <div className="h-1.5 w-12 bg-amber-400/40 rounded"></div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="h-2 w-20 bg-white/20 rounded mb-3"></div>
                    <div className="flex items-end justify-between gap-2 h-20">
                      <div className="chart-bar flex-1 bg-gradient-to-t from-blue-500/40 to-blue-400/20 rounded-t" style={{ height: '45%' }}></div>
                      <div className="chart-bar flex-1 bg-gradient-to-t from-green-500/40 to-green-400/20 rounded-t" style={{ height: '65%' }}></div>
                      <div className="chart-bar flex-1 bg-gradient-to-t from-purple-500/40 to-purple-400/20 rounded-t" style={{ height: '55%' }}></div>
                      <div className="chart-bar flex-1 bg-gradient-to-t from-blue-500/40 to-blue-400/20 rounded-t" style={{ height: '80%' }}></div>
                      <div className="chart-bar flex-1 bg-gradient-to-t from-green-500/40 to-green-400/20 rounded-t" style={{ height: '70%' }}></div>
                      <div className="chart-bar flex-1 bg-gradient-to-t from-purple-500/40 to-purple-400/20 rounded-t" style={{ height: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sixth Service Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-20 relative">
              {/* Connecting line on desktop - shows relationship between description and visualization */}
              <div className="hidden lg:block absolute left-[calc(50%-1px)] top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent z-0"></div>
              
              {/* Left Column - Service Card */}
              <div 
                ref={serviceCard6Ref}
                className="description-card bg-gradient-to-br from-black/50 via-black/60 to-black/50 rounded-3xl p-10 lg:p-14 hover:bg-gradient-to-br hover:from-black/55 hover:via-black/65 hover:to-black/55 transition-all duration-300 relative z-10 flex flex-col justify-center backdrop-blur-md border border-white/10 hover:border-white/20 overflow-hidden"
              >
                {/* Colored gradient overlay */}
                <div className="absolute top-1/2 right-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="glow-text text-3xl lg:text-4xl font-heading font-bold mb-6 text-white leading-tight">
                    {SERVICES[5].title}
                  </h3>
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                    {SERVICES[5].description}
                  </p>
                </div>
              </div>

              {/* Right Column - Automation Workflow Visualization */}
              <div 
                ref={integrationsRef}
                className="relative h-[180px] md:h-[240px] lg:h-[360px] flex items-center justify-center z-10"
              >
                <div className="w-full max-w-md bg-white/3 border border-transparent rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    {/* Step 1 - Manual */}
                    <div className="automation-step flex flex-col items-center flex-1 min-w-0">
                      <div className="w-12 h-12 bg-white/10 border-2 border-white/30 rounded-xl flex items-center justify-center mb-2">
                        <div className="w-6 h-6 bg-white/20 rounded"></div>
                      </div>
                      <div className="h-1.5 w-16 bg-white/20 rounded mb-1"></div>
                      <div className="h-1 w-12 bg-white/15 rounded"></div>
                    </div>

                    {/* Arrow 1 */}
                    <div className="automation-arrow flex items-center flex-shrink-0">
                      <div className="w-8 h-px bg-white/40"></div>
                      <div className="w-0 h-0 border-l-6 border-l-white/40 border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
                    </div>

                    {/* Step 2 - Automation (Gear Icon) */}
                    <div className="automation-step flex flex-col items-center flex-1 min-w-0">
                      <div className="w-16 h-16 bg-white/15 border-2 border-white/40 rounded-full flex items-center justify-center mb-2">
                        {/* Sophisticated gear icon */}
                        <svg className="w-11 h-11 gear-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2">
                          {/* Gear outer ring with subtle gradient effect */}
                          <circle cx="12" cy="12" r="9" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.85)" />
                          {/* 8 teeth - cleaner design */}
                          <rect x="10.5" y="1" width="3" height="4.5" rx="0.5" />
                          <rect x="10.5" y="18.5" width="3" height="4.5" rx="0.5" />
                          <rect x="1" y="10.5" width="4.5" height="3" rx="0.5" />
                          <rect x="18.5" y="10.5" width="4.5" height="3" rx="0.5" />
                          <rect x="3.5" y="3.5" width="3" height="4.5" rx="0.5" transform="rotate(-45 5 5.75)" />
                          <rect x="17.5" y="16" width="3" height="4.5" rx="0.5" transform="rotate(-45 19 18.25)" />
                          <rect x="17.5" y="3.5" width="3" height="4.5" rx="0.5" transform="rotate(45 19 5.75)" />
                          <rect x="3.5" y="16" width="3" height="4.5" rx="0.5" transform="rotate(45 5 18.25)" />
                          {/* Inner hub */}
                          <circle cx="12" cy="12" r="4.5" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.6)" />
                          <circle cx="12" cy="12" r="2.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                        </svg>
                      </div>
                      <div className="h-1.5 w-20 bg-white/25 rounded mb-1"></div>
                      <div className="h-1 w-16 bg-white/20 rounded"></div>
                    </div>

                    {/* Arrow 2 */}
                    <div className="automation-arrow flex items-center flex-shrink-0">
                      <div className="w-8 h-px bg-white/40"></div>
                      <div className="w-0 h-0 border-l-6 border-l-white/40 border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
                    </div>

                    {/* Step 3 - Automated */}
                    <div className="automation-step flex flex-col items-center flex-1 min-w-0">
                      <div className="w-12 h-12 bg-white/10 border-2 border-white/30 rounded-xl flex items-center justify-center mb-2">
                        <div className="automation-success w-6 h-6 bg-green-400/30 rounded"></div>
                      </div>
                      <div className="h-1.5 w-16 bg-white/20 rounded mb-1"></div>
                      <div className="h-1 w-12 bg-white/15 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 relative z-10">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/booking"
                className="glow-button inline-block px-10 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-white/90 shadow-2xl w-full sm:w-auto"
              >
                Book a Meeting
              </Link>
              <Link
                href="/how-it-works"
                className="glow-button inline-block px-10 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white/10 shadow-2xl w-full sm:w-auto"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="pt-16 pb-32 px-6 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <h2
              ref={aboutTitleRef}
              className="glow-title text-5xl md:text-6xl font-heading font-bold text-center mb-12 text-white"
            >
              About Brehaut Consulting
            </h2>
            <div ref={aboutTextRef} className="prose prose-invert max-w-none">
              <p className="text-xl md:text-2xl text-white/90 text-center leading-relaxed mb-8">
                We specialize in creating digital solutions that drive real business results. 
                Our approach combines technical expertise with a deep understanding of growth 
                marketing and conversion optimization.
              </p>
              <p className="text-lg md:text-xl text-white/80 text-center leading-relaxed max-w-3xl mx-auto">
                Whether you need a modern web application, improved search visibility, 
                strategic advertising, or seamless integrations, we work with you to build 
                systems that scale with your business and deliver measurable outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <h2
              ref={faqTitleRef}
              className="glow-title text-5xl md:text-6xl font-heading font-bold text-center mb-12 text-white"
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: 'How does working with Brehaut Consulting start?',
                  answer: 'It starts with a conversation. You book a meeting through our booking system, and we discuss your business, goals, and current challenges. This helps us understand if we&apos;re a good fit and what approach would work best for you.',
                },
                {
                  question: 'What happens during the first meeting?',
                  answer: 'We listen to your situation, ask questions about your business and goals, and discuss what you&apos;re trying to achieve. It&apos;s a discovery conversation, not a sales pitch. By the end, you&apos;ll have clarity on whether we can help and what that might look like.',
                },
                {
                  question: 'How long does a typical project take?',
                  answer: 'Timelines depend on scope and complexity. A website project might take 4-8 weeks, while a complete system build could be 2-4 months. We provide a clear timeline during our initial discussion based on your specific needs.',
                },
                {
                  question: 'Do I need all services to work with you?',
                  answer: 'No. Some clients need a complete system, while others need help with a specific part. The scope is defined after understanding your business and goals, and only what creates real value is recommended.',
                },
                {
                  question: 'Can I hire you for just a website or just ads?',
                  answer: 'Yes. While we often work on integrated systems, we can focus on a single service if that&apos;s what you need. We&apos;ll be honest if we think you&apos;d benefit from additional services, but the decision is yours.',
                },
                {
                  question: 'How is pricing structured?',
                  answer: 'Pricing is based on project scope, complexity, and goals. We provide clear proposals after understanding your needs, so you know exactly what you&apos;re investing in and why.',
                },
                {
                  question: 'Is this a one-time project or ongoing work?',
                  answer: 'It depends on what you need. Some clients need a one-time build, while others benefit from ongoing support and optimization. We discuss what makes sense for your situation during our initial conversation.',
                },
                {
                  question: 'Can you guarantee results?',
                  answer: 'We guarantee our work quality and approach, but we can&apos;t guarantee specific business outcomes since many factors are outside our control. What we can promise is honest communication, strategic thinking, and execution based on proven methods.',
                },
                {
                  question: 'How long does it take to see results?',
                  answer: 'It varies by service. A new website might show immediate improvements, while SEO and advertising typically take 2-4 months to show meaningful results. We set realistic expectations upfront and track progress transparently.',
                },
                {
                  question: 'What types of businesses do you work with?',
                  answer: 'We work with businesses of various sizes, from small local companies to larger organizations. The common thread is businesses that want to grow and are ready to invest in systems that drive measurable results.',
                },
                {
                  question: 'Do you work internationally or only locally?',
                  answer: 'We work with clients globally, with a focus on Europe and Latin America. Our services are delivered remotely, so location isn&apos;t a barrier as long as we can communicate effectively.',
                },
                {
                  question: 'Who owns the website, ads, and data?',
                  answer: 'You do. The website code, content, and any data collected belong to you. We work with third-party platforms when needed, but you maintain ownership and control of your digital assets.',
                },
              ].map((faq, index) => {
                const triggerId = `faq-trigger-${index}`
                const panelId = `faq-panel-${index}`
                const isOpen = openFaqIndex === index

                const handleToggle = () => {
                  setOpenFaqIndex(isOpen ? null : index)
                }

                const handleKeyDown = (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleToggle()
                  }
                }

                return (
                  <div
                    key={index}
                    className="faq-item bg-white/10 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20"
                  >
                    <button
                      id={triggerId}
                      type="button"
                      className="w-full text-left p-4 lg:p-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-t-2xl"
                      onClick={handleToggle}
                      onKeyDown={handleKeyDown}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-heading font-bold text-white pr-4">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          <svg
                            className={`w-5 h-5 text-white/70 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-96 mt-2' : 'max-h-0'
                      }`}
                    >
                      <div className="px-4 lg:px-5 pb-4 lg:pb-5">
                        <p className="text-base text-white/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaSectionRef} className="py-32 px-6 relative z-10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2
              ref={ctaTitleRef}
              className="glow-title text-5xl md:text-6xl font-heading font-bold mb-8 text-white"
            >
              Ready to Grow?
            </h2>
            <p
              ref={ctaTextRef}
              className="text-xl text-white/90 mb-12 max-w-2xl mx-auto"
            >
              Let&apos;s discuss how we can help transform your digital presence and drive real business results.
            </p>
            <div ref={ctaButtonRef}>
              <Link
                href="/booking"
                className="glow-button inline-block px-10 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-white/90 shadow-2xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Brehaut Consulting',
            description: COMPANY_TAGLINE,
            url: 'https://brehautconsulting.com',
            telephone: CONTACT_PHONE,
            email: CONTACT_EMAIL,
            areaServed: ['Europe', 'Latin America'],
            serviceType: 'Technology and Growth Consultancy',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Consulting Services',
              itemListElement: SERVICES.map((service, index) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service.title,
                  description: service.description,
                },
              })),
            },
          }),
        }}
      />
    </>
  )
}